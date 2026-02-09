-- Create table for homepage news
CREATE TABLE IF NOT EXISTS public.homepage_news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT NOT NULL,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create table for homepage results
CREATE TABLE IF NOT EXISTS public.homepage_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    players TEXT NOT NULL,
    type TEXT NOT NULL,
    score TEXT NOT NULL,
    status TEXT NOT NULL,
    date TEXT NOT NULL,
    icon TEXT NOT NULL,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.homepage_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_results ENABLE ROW LEVEL SECURITY;

-- Policies for public reading
CREATE POLICY "Allow public read-only access to visible news" ON public.homepage_news
    FOR SELECT USING (is_visible = true);

CREATE POLICY "Allow public read-only access to visible results" ON public.homepage_results
    FOR SELECT USING (is_visible = true);

-- Policies for admin management
-- Assuming 'user_roles' table exists and links 'user_id' to 'role'
CREATE POLICY "Allow admin full access to news" ON public.homepage_news
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Allow admin full access to results" ON public.homepage_results
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Add sample data for news
INSERT INTO public.homepage_news (title, date, category, description, image)
VALUES 
('Tournoi d''été 2026', '15 Janvier 2026', 'Événement', 'Inscription ouverte pour le grand tournoi annuel. Catégories jeunes et adultes disponibles.', '🎾'),
('Nouveaux horaires', '10 Janvier 2026', 'Club', 'Découvrez les nouveaux créneaux d''entraînement pour la saison printemps-été.', '🕐'),
('Stage vacances', '5 Janvier 2026', 'École de Tennis', 'Stage intensif pour les jeunes pendant les vacances de février. Places limitées !', '🏆');

-- Add sample data for results
INSERT INTO public.homepage_results (players, type, score, status, date, icon)
VALUES 
('Thomas Martin vs. Lucas Bernard', 'Simple Messieurs - Tournoi d''Hiver', '6/4 - 7/5', 'Victoire', '08 Fev. 2026', 'Trophy'),
('Sophie Leroy', 'Simple Dames - Division 1', '6/2 - 6/1', 'Victoire', '07 Fev. 2026', 'Star'),
('M. Petit / J. Roux vs. G. Blanc / R. Noir', 'Double Messieurs', '4/6 - 6/3 - 10/8', 'Victoire', '05 Fev. 2026', 'Users');
