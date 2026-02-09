# 🚀 Guide de Configuration - Système d'Authentification & Admin

## Vue d'ensemble

Ce guide vous explique comment configurer le système complet d'authentification avec rôles admin et emails personnalisés.

---

## ✅ Ce qui est déjà fait (Code)

- ✅ Bug du bouton "Retour" corrigé sur `/register`
- ✅ Page "Mot de passe oublié" créée (`/forgot-password`)
- ✅ Système de rôles implémenté (`src/lib/roles.ts`)
- ✅ Attribution automatique du rôle "user" lors de l'inscription
- ✅ Templates d'email HTML personnalisés créés

---

## 📋 Configuration Requise (Actions à faire)

### 1. Configuration de la Base de Données Supabase

#### Étape 1.1 : Créer la table `user_roles`

1. Connectez-vous à [app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor** (icône `</>` dans le menu)
4. Cliquez sur **New query**
5. Copiez-collez **tout le contenu** de `database/create_user_roles.sql`
6. Cliquez sur **Run** (ou appuyez sur Ctrl+Enter)

#### Étape 1.2 : Créer votre premier compte admin

Après avoir exécuté le script SQL ci-dessus :

1. Créez-vous un compte sur votre site (ou utilisez un compte existant)
2. Trouvez votre User ID :
   - Dans Supabase, allez dans **Authentication** > **Users**
   - Trouvez votre email et copiez l'ID (format : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
3. Retournez dans **SQL Editor** et exécutez :

```sql
INSERT INTO user_roles (user_id, role)
VALUES ('VOTRE_USER_ID_ICI', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
```

4. Remplacez `VOTRE_USER_ID_ICI` par votre ID utilisateur réel
5. Cliquez sur **Run**

✅ Vous êtes maintenant admin !

---

### 2. Configuration des Templates d'Email

Les templates HTML sont dans `email-templates/` :
- `confirm-email.html` - Email de vérification
- `reset-password.html` - Email de récupération de mot de passe

#### Étape 2.1 : Ajouter le logo blanc

1. Créez une version **blanche** du logo TCH (pour le header vert des emails)
2. Nommez-le **`Logo TCH - Blanc.png`**
3. Placez-le dans le dossier `public/` de votre projet

**Ou** modifiez les templates pour utiliser le logo vert existant (moins optimal visuellement)

#### Étape 2.2 : Configurer les templates dans Supabase

Suivez le guide détaillé dans **`email-templates/README.md`**

En résumé :
1. Allez dans Supabase > **Authentication** > **Email Templates**
2. Pour **Confirm signup** :
   - Copiez le contenu de `confirm-email.html`
   - Collez-le dans l'éditeur
   - Subject : `Bienvenue au Tennis Club Halluin 🎾 - Confirmez votre email`
   - Save
3. Pour **Reset Password** :
   - Même chose avec `reset-password.html`
   - Subject : `Réinitialisation de votre mot de passe - Tennis Club Halluin 🔐`
   - Save

---

## 🧪 Tests

### Test 1 : Inscription d'un nouveau membre

1. Allez sur `/register`
2. Remplissez le formulaire
3. Soumettez
4. ✅ Vérifiez que vous recevez un email avec le nouveau design TCH
5. ✅ Cliquez sur le lien de confirmation
6. ✅ Vérifiez dans Supabase que le rôle "user" a été créé automatiquement

### Test 2 : Mot de passe oublié

1. Allez sur `/login`
2. Cliquez sur "Oublié ?"
3. Entrez votre email
4. ✅ Vérifiez que vous recevez un email avec le nouveau design
5. ✅ Cliquez sur le lien et changez votre mot de passe

### Test 3 : Vérifier votre rôle admin

1. Connectez-vous avec votre compte admin
2. Dans la console du navigateur (F12), exécutez :

```javascript
const { data } = await (await fetch('/api/user-role')).json();
console.log('Mon rôle:', data.role);
```

Devrait afficher : `Mon rôle: admin`

---

## 📁 Structure des Fichiers Créés

```
Site - TCH/
├── src/
│   ├── lib/
│   │   └── roles.ts                    ✨ Nouveau - Fonctions de gestion des rôles
│   └── app/
│       ├── register/page.tsx           📝 Modifié - Crée le rôle à l'inscription
│       ├── login/page.tsx              📝 Modifié - Lien mot de passe oublié
│       └── forgot-password/page.tsx    ✨ Nouveau - Page récupération MDP
├── database/
│   └── create_user_roles.sql           ✨ Nouveau - Script SQL pour la table
└── email-templates/
    ├── confirm-email.html              ✨ Nouveau - Template email vérification
    ├── reset-password.html             ✨ Nouveau - Template email réinit MDP
    └── README.md                       ✨ Nouveau - Guide détaillé emails
```

---

## 🔜 Prochaines Étapes (Optionnel)

Une fois que tout fonctionne, vous pouvez :

1. **Créer le dashboard admin** (`/admin`)
   - Vue d'ensemble des statistiques
   - Gestion des utilisateurs
   - Vue globale des réservations

2. **Ajouter un lien Admin dans le header**
   - Visible uniquement pour les admins
   - Icône Shield
   - Badge "ADMIN"

3. **Page de gestion des utilisateurs**
   - Promouvoir/rétrograder des admins
   - Désactiver des comptes
   - Voir les détails de chaque utilisateur

Dites-moi quand vous êtes prêt pour ces fonctionnalités ! 🚀

---

## ❓ Besoin d'Aide ?

Si vous rencontrez un problème :

1. Vérifiez que le script SQL a bien été exécuté sans erreur
2. Vérifiez que votre User ID est correct
3. Vérifiez que les templates d'email ont été sauvegardés dans Supabase
4. Consultez les guides détaillés dans `email-templates/README.md`

N'hésitez pas à me demander ! 👍
