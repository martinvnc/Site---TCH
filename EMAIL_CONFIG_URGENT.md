# 🚨 IMPORTANT : Configuration Manuelle des Emails Supabase

## Pourquoi les emails n'ont pas changé ?

Les templates d'email que j'ai créés (`confirm-email.html` et `reset-password.html`) sont des **fichiers locaux** dans votre projet. **Ils ne sont PAS automatiquement appliqués à Supabase.**

> **⚠️ VOUS DEVEZ les configurer MANUELLEMENT dans le dashboard Supabase.**
>
> C'est impossible à faire via code - Supabase ne permet la configuration des emails QUE via leur interface web.

---

## 📋 Configuration Obligatoire (5 minutes)

### Étape 1 : Accéder aux Templates d'Email

1. Allez sur [app.supabase.com](https://app.supabase.com)
2. Ouvrez votre projet
3. Dans le menu de gauche : **Authentication** > **Email Templates**

### Étape 2 : Configurer l'Email de Vérification

1. Cliquez sur **"Confirm signup"**
2. **Copiez TOUT le contenu** de `email-templates/confirm-email.html`
3. **Collez-le** dans le champ de template (supprimez l'ancien contenu)
4. Dans **Subject**, mettez : `Bienvenue au Tennis Club Halluin 🎾`
5. Cliquez sur **Save**

### Étape 3 : Configurer l'Email de Récupération

1. Cliquez sur **"Reset Password"** (Magic Link)
2. **Copiez TOUT le contenu** de `email-templates/reset-password.html`
3. **Collez-le** dans le champ de template
4. Dans **Subject**, mettez : `Réinitialisez votre mot de passe - TCH 🔐`
5. Cliquez sur **Save**

### Étape 4 : Vérifier l'URL de Redirection

1. Toujours dans **Email Templates**
2. Vérifiez que l'URL de redirection est bien : `{{ .SiteURL }}/reset-password`
3. Si ce n'est pas le cas, corrigez-le

---

## ❓ Problème des Emails Dupliqués

### Pourquoi je peux créer 2 comptes avec le même email ?

Cela arrive si **la confirmation d'email est désactivée** dans Supabase.

### Solution :

1. Dans Supabase : **Authentication** > **Providers** > **Email**
2. Vérifiez que **"Confirm email"** est **ACTIVÉ** (ON)
3. Si ce n'est pas le cas, activez-le et sauvegardez

Avec cette option activée :
- ✅ L'email doit être vérifié avant la première connexion
- ✅ Impossible de créer 2 comptes avec le même email
- ✅ L'utilisateur reçoit l'email de vérification

---

## 🧪 Test Rapide

Après avoir configuré les templates :

1. **Testez l'inscription** : Créez un nouveau compte
2. **Vérifiez votre boîte mail** : Vous devriez voir le nouveau design vert TCH
3. **Testez la récupération** : Utilisez "Mot de passe oublié"
4. **Cliquez sur le lien** : Vous arriverez sur `/reset-password` (plus de 404 !)

---

## ⏱️ Temps estimé : 5 minutes

C'est fastidieux mais c'est la seule façon. Supabase ne permet pas de configurer les emails via code pour des raisons de sécurité.

**Une fois fait, vous n'aurez plus jamais à y retoucher !** 🎉
