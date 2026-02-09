# 📧 Configuration des Templates d'Email Supabase

## Objectif
Remplacer les emails par défaut de Supabase par des templates personnalisés avec le branding Tennis Club Halluin.

---

## Fichiers de Templates

Deux templates HTML ont été créés dans `email-templates/` :

1. **`confirm-email.html`** - Email de vérification d'inscription
2. **`reset-password.html`** - Email de récupération de mot de passe

---

## 📋 Instructions de Configuration

### Étape 1 : Accès au Dashboard Supabase

1. Connectez-vous à [app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet TCH
3. Dans le menu latéral, allez dans **Authentication** > **Email Templates**

### Étape 2 : Configurer l'Email de Confirmation

1. Dans la section **Email Templates**, cliquez sur **Confirm signup**
2. Remplacez tout le contenu par le code de `email-templates/confirm-email.html`
3. **Important** : Vérifiez que ces variables Supabase sont présentes :
   - `{{ .ConfirmationURL }}` - Lien de confirmation
   - `{{ .Email }}` - Email de l'utilisateur
   - `{{ .SiteURL }}` - URL de votre site
4. Modifiez le **Subject** : `Bienvenue au Tennis Club Halluin 🎾 - Confirmez votre email`
5. Cliquez sur **Save**

### Étape 3 : Configurer l'Email de Récupération

1. Toujours dans **Email Templates**, cliquez sur **Reset Password**
2. Remplacez par le contenu de `email-templates/reset-password.html`
3. Vérifiez les mêmes variables que ci-dessus
4. Modifiez le **Subject** : `Réinitialisation de votre mot de passe - Tennis Club Halluin 🔐`
5. Cliquez sur **Save**

### Étape 4 : Logo en  (Important !)

Les templates utilisent un logo blanc. Vous devez :

1. Créer/exporter une version **blanche** de votre logo TCH (pour le header vert)
2. Le nommer **`Logo TCH - Blanc.png`**
3. Le placer dans le dossier `public/` de votre projet Next.js
4. Ou héberger l'image ailleurs et modifier les liens dans les templates :
   ```html
   <img src="VOTRE_URL_ICI" alt="Tennis Club Halluin" />
   ```

> **Note** : Si vous n'avez pas de logo blanc, vous pouvez :
> - Garder le logo vert actuel mais adapter la couleur du header
> - Utiliser un outil comme Photoshop/Figma pour inverser les couleurs
> - Me demander de générer un logo blanc

---

## 🎨 Personnalisation Supplémentaire

Si vous souhaitez modifier les templates :

### Couleurs TCH utilisées
- **Vert principal** : `#4c7650`
- **Vert foncé** : `#3d5f41` 
- **Vert très foncé** : `#2d452e`
- **Jaune accent** : `#F6CA73`
- **Fond clair** : `#f8faf8`, `#f0f5f1`

### Éléments modifiables
- Texte du bouton CTA
- Messages de bienvenue
- Sections informatives (icônes et textes)

---

## ✅ Test des Emails

Pour tester que tout fonctionne :

1. **Test d'inscription** :
   - Créez un nouveau compte sur votre site
   - Vérifiez votre boîte mail
   - L'email devrait avoir le nouveau design TCH

2. **Test de récupération** :
   - Allez sur `/login`
   - Cliquez sur "Mot de passe oublié ?" (quand implémenté)
   - Vérifiez l'email reçu

---

## 🐛 Dépannage

### Le logo ne s'affiche pas
- Vérifiez que `Logo TCH - Blanc.png` existe dans `public/`
- Ou utilisez une URL absolue (ex: `https://votre-site.com/logo.png`)

### Les variables {{  }} apparaissent telles quelles
- Assurez-vous d'avoir collé le code dans Supabase, pas de l'avoir modifié localement

### L'email arrive en texte brut
- Vérifiez que vous avez bien sauvegardé dans la section HTML du template
- Certains clients email ont besoin de 24h pour mettre à jour leur cache

---

## 📱 Compatibilité Email

Les templates ont été conçus pour être compatibles avec :
- ✅ Gmail (web + mobile)
- ✅ Outlook
- ✅ Apple Mail
- ✅ Yahoo Mail
- ✅ Mobile (iOS & Android)

Ils utilisent uniquement des **tables HTML** pour garantir une compatibilité maximale.
