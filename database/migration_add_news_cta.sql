-- Ajout des colonnes pour le bouton CTA optionnel dans les actualités
ALTER TABLE homepage_news 
ADD COLUMN IF NOT EXISTS button_text TEXT,
ADD COLUMN IF NOT EXISTS button_url TEXT;
