-- Script SQL pour créer la table user_roles et configurer les RLS
-- À exécuter dans Supabase SQL Editor

-- 1. Créer la table user_roles
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 2. Créer des index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- 3. Activer Row Level Security
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Politique RLS : les utilisateurs peuvent voir leur propre rôle
CREATE POLICY "Users can view their own role"
ON user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- 5. Politique RLS : seuls les admins peuvent modifier les rôles
-- (Cette politique sera ajustée une fois qu'on aura le premier admin)
CREATE POLICY "Only admins can update roles"
ON user_roles
FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- 6. Politique RLS : permettre l'insertion du premier rôle par l'utilisateur lui-même
CREATE POLICY "Users can insert their own initial role"
ON user_roles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 7. Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Trigger pour updated_at
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON user_roles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 9. (OPTIONNEL) Créer le premier admin
-- Remplacez 'VOTRE_USER_ID_ICI' par votre ID utilisateur réel
-- Vous pouvez trouver votre user ID dans Authentication > Users de Supabase
--
-- INSERT INTO user_roles (user_id, role)
-- VALUES ('VOTRE_USER_ID_ICI', 'admin')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- 10. Vérifier que tout fonctionne
SELECT * FROM user_roles;
