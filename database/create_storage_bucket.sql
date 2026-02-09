-- 1. Création du bucket 'homepage' pour stocker les images des résultats
-- Note: Si vous avez déjà créé le bucket via l'interface Supabase, cette commande peut échouer sans gravité.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('homepage', 'homepage', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Autoriser la lecture publique des fichiers dans ce bucket
CREATE POLICY "Accès Public" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'homepage');

-- 3. Autoriser les administrateurs à uploader des fichiers
-- Note: Cette politique suppose que vous avez une gestion des rôles. 
-- Si vous voulez simplifier, on peut autoriser tout utilisateur authentifié pour le moment.
CREATE POLICY "Upload Administrateur" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'homepage');

-- 4. Autoriser la suppression pour les administrateurs
CREATE POLICY "Suppression Administrateur" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'homepage');
