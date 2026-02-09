# Configuration de l'Expiration Automatique des Réservations

## Option 1 : Supabase Edge Function (Recommandé)

### 1. Créer une Edge Function

Dans votre projet Supabase, créez une nouvelle Edge Function nommée `expire-reservations` :

```typescript
// supabase/functions/expire-reservations/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Call the expire function
    const { error } = await supabaseClient.rpc('expire_pending_reservations')

    if (error) {
      console.error('Error expiring reservations:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
```

### 2. Déployer la fonction

```bash
supabase functions deploy expire-reservations
```

### 3. Configurer le Cron Job

Dans le dashboard Supabase :
1. Allez dans **Database** → **Cron Jobs**
2. Créez un nouveau job :
   - **Name**: Expire Pending Reservations
   - **Schedule**: `* * * * *` (toutes les minutes)
   - **Command**: 
   ```sql
   SELECT net.http_post(
     url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/expire-reservations',
     headers := jsonb_build_object('Authorization', 'Bearer YOUR_ANON_KEY')
   );
   ```

---

## Option 2 : pg_cron (Alternative)

Si vous avez accès à `pg_cron` dans votre instance PostgreSQL :

### 1. Activer l'extension

```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

### 2. Créer le job cron

```sql
SELECT cron.schedule(
  'expire-pending-reservations',  -- job name
  '* * * * *',                     -- every minute
  'SELECT expire_pending_reservations();'
);
```

### 3. Vérifier le job

```sql
SELECT * FROM cron.job;
```

### 4. Supprimer le job (si nécessaire)

```sql
SELECT cron.unschedule('expire-pending-reservations');
```

---

## Option 3 : Client-side Polling (Solution de secours)

Si ni Edge Functions ni pg_cron ne sont disponibles, vous pouvez appeler la fonction depuis le client :

```typescript
// Dans un composant React avec useEffect
useEffect(() => {
  const interval = setInterval(async () => {
    await supabase.rpc('expire_pending_reservations');
  }, 60000); // Toutes les minutes

  return () => clearInterval(interval);
}, []);
```

**⚠️ Attention** : Cette solution n'est pas idéale car elle dépend d'un utilisateur connecté avec une page ouverte.

---

## Vérification

Pour vérifier que l'expiration fonctionne :

1. Créez une réservation
2. Modifiez manuellement `expires_at` dans le passé :
```sql
UPDATE reservations 
SET expires_at = NOW() - INTERVAL '1 minute'
WHERE id = 'YOUR_RESERVATION_ID';
```
3. Attendez 1 minute (ou exécutez manuellement `SELECT expire_pending_reservations();`)
4. Vérifiez que le statut est passé à 'expired'

---

## Recommandation

**Je recommande l'Option 1 (Edge Function + Cron)** car :
- ✅ Fiable et indépendant des clients
- ✅ S'exécute même si aucun utilisateur n'est connecté
- ✅ Facile à monitorer et débugger
- ✅ Scalable
