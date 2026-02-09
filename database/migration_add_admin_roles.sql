-- Migration: Add admin roles and reservation types
-- This enables admin users to create bulk/recurring reservations for courses, matches, etc.

-- Step 1: Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Step 2: Enable RLS on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Step 3: RLS Policies for user_roles
-- Anyone can read roles (needed to check permissions in app)
CREATE POLICY "Anyone can read roles"
    ON user_roles FOR SELECT
    TO authenticated
    USING (true);

-- Only admins can modify roles
CREATE POLICY "Only admins can modify roles"
    ON user_roles FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Step 4: Add Martin Van Caemerbeke as admin
-- Note: Run this after the table is created
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'martinvanca6@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Step 5: Modify reservations table to support different types
ALTER TABLE reservations
    ADD COLUMN IF NOT EXISTS reservation_type TEXT DEFAULT 'normal' 
        CHECK (reservation_type IN ('normal', 'cours', 'match', 'interclub', 'admin')),
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS created_by_admin BOOLEAN DEFAULT false;

-- Step 6: Create index for filtering by type
CREATE INDEX IF NOT EXISTS idx_reservations_type ON reservations(reservation_type);

-- Step 7: Update RLS policies for admin reservations
-- Admins can create any type of reservation
CREATE POLICY "Admins can create any reservation"
    ON reservations FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Admins can update/delete any reservation
CREATE POLICY "Admins can modify any reservation"
    ON reservations FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete any reservation"
    ON reservations FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Step 8: Add comments for documentation
COMMENT ON TABLE user_roles IS 'Stores user roles (admin, member) for permission management';
COMMENT ON COLUMN reservations.reservation_type IS 'Type of reservation: normal (requires confirmation), cours, match, interclub, admin (system reservations)';
COMMENT ON COLUMN reservations.description IS 'Additional description for admin reservations (e.g., "Cours débutants - Coach Marie")';
COMMENT ON COLUMN reservations.created_by_admin IS 'True if this reservation was created by an admin (bulk/recurring reservations)';
