# Guide de Déploiement - Système de Confirmation à Deux Étapes

## 📋 Ordre d'Exécution

Suivez ces étapes **dans l'ordre** pour déployer le système de confirmation :

---

## 1️⃣ Backup de la Base de Données

Avant toute modification, créez un backup de votre base Supabase :

```bash
# Dans le dashboard Supabase > Database > Backups
# Ou exportez les réservations existantes :
```

```sql
-- Exporter les réservations existantes
SELECT * FROM reservations;
```

---

## 2️⃣ Exécuter la Migration Principale

Dans votre dashboard Supabase SQL Editor, exécutez le fichier :

**`database/migration_add_confirmation.sql`**

Cette migration va :
- ✅ Ajouter les colonnes `status`, `confirmed_by`, `confirmed_at`, `expires_at`
- ✅ Créer les index pour la performance
- ✅ Mettre à jour les réservations existantes en statut 'confirmed'
- ✅ Créer la fonction `expire_pending_reservations()`
- ✅ Mettre à jour les policies RLS

**⚠️ IMPORTANT** : Les réservations existantes seront automatiquement marquées comme `confirmed` pour ne pas casser le système.

---

## 3️⃣ Configurer l'Expiration Automatique

### Option A : Supabase Edge Function (Recommandée)

Suivez le guide dans **`database/EXPIRATION_SETUP.md`** section "Option 1".

### Option B : Test manuel (pour développement)

Vous pouvez tester l'expiration manuellement :

```sql
-- Exécuter cette requête manuellement pour tester
SELECT expire_pending_reservations();
```

---

## 4️⃣ Tester le Système

### Test 1 : Créer une réservation

1. Connectez-vous avec un utilisateur
2. Allez sur `/reservation`
3. Créez une réservation
4. **Vérification** : 
   - Message "Réservation créée ! Un autre membre doit la confirmer dans les 15 minutes."
   - Dans Supabase : vérifier que `status = 'pending'` et `expires_at` est défini

### Test 2 : Confirmer une réservation

1. Déconnectez-vous et connectez-vous avec **un autre utilisateur**
2. Allez sur `/reservation`
3. Vous devriez voir le créneau en orange avec un bouton "Confirmer"
4. Cliquez sur "Confirmer"
5. **Vérification** :
   - Message "Réservation confirmée avec succès !"
   - Le créneau devient vert
   - Dans Supabase : `status = 'confirmed'`, `confirmed_by` rempli

### Test 3 : Vérifier "Mes Réservations"

1. Allez sur `/mes-reservations`
2. **Vérification** :
   - Les réservations pending affichent un badge orange avec compte à rebours
   - Les réservations confirmed affichent un badge vert
   - Le temps restant se met à jour en temps réel

### Test 4 : Expiration automatique

Pour tester rapidement l'expiration :

```sql
-- Forcer l'expiration d'une réservation pour test
UPDATE reservations 
SET expires_at = NOW() - INTERVAL '1 minute'
WHERE id = 'VOTRE_ID_RESERVATION';

-- Puis exécuter
SELECT expire_pending_reservations();
```

Vérifier que le statut passe à `'expired'`.

---

## 5️⃣ Vérifier les Logs

### Logs de la base de données

```sql
-- Vérifier les réservations par statut
SELECT status, COUNT(*) 
FROM reservations 
GROUP BY status;

-- Voir les réservations récentes
SELECT id, user_name, status, created_at, expires_at, confirmed_by
FROM reservations
ORDER BY created_at DESC
LIMIT 10;
```

### Logs de l'application

Ouvrez la console du navigateur (F12) et vérifiez :
- Les erreurs de fetch/insert
- Les confirmations réussies
- Les expirations

---

## 🔧 Rollback (en cas de problème)

Si vous devez annuler les changements :

```sql
-- Supprimer les nouvelles colonnes
ALTER TABLE reservations
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS confirmed_by,
  DROP COLUMN IF EXISTS confirmed_at,
  DROP COLUMN IF EXISTS expires_at;

-- Supprimer les index
DROP INDEX IF EXISTS idx_reservations_status;
DROP INDEX IF EXISTS idx_reservations_expires_at;
DROP INDEX IF EXISTS idx_reservations_confirmed_by;

-- Supprimer la fonction
DROP FUNCTION IF EXISTS expire_pending_reservations();

-- Restaurer les anciennes policies
-- (voir supabase_setup.sql pour les policies d'origine)
```

Puis redéployez l'ancien code frontend avec Git :
```bash
git checkout HEAD~1 src/app/reservation/page.tsx
git checkout HEAD~1 src/app/mes-reservations/page.tsx
```

---

## ✅ Checklist de Déploiement

- [ ] Backup de la base de données créé
- [ ] Migration `migration_add_confirmation.sql` exécutée
- [ ] Colonnes et index créés correctement
- [ ] Réservations existantes marquées 'confirmed'
- [ ] Fonction `expire_pending_reservations()` créée
- [ ] Edge Function déployée OU pg_cron configuré
- [ ] Test 1 : Création réservation pending ✓
- [ ] Test 2 : Confirmation par autre user ✓
- [ ] Test 3 : Affichage statuts dans "Mes Réservations" ✓
- [ ] Test 4 : Expiration automatique ✓
- [ ] Logs vérifiés, aucune erreur
- [ ] Application en production fonctionne correctement

---

## 📞 Support

En cas de problème :

1. Vérifiez les logs Supabase (Database > Logs)
2. Vérifiez la console navigateur (F12)
3. Testez les requêtes SQL directement dans le SQL Editor
4. Vérifiez que les policies RLS sont correctes

**Colonnes à vérifier dans `reservations` :**
- `status` TEXT (pending/confirmed/expired)
- `confirmed_by` UUID
- `confirmed_at` TIMESTAMP WITH TIME ZONE
- `expires_at` TIMESTAMP WITH TIME ZONE
