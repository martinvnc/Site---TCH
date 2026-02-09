-- Migration CORRECTED: Admin roles with cleanup
-- Execute this version which cleans up existing policies first

-- Step 1: Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own role" ON user_roles;
DROP POLICY IF EXISTS "Anyone can read roles" ON user_roles;
DROP POLICY IF EXISTS "Only admins can modify roles" ON user_roles;

-- Step 2: Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Step 3: Enable RLS on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Step 4: Simple RLS policy - users can read their own role only
CREATE POLICY "Users can read own role"
    ON user_roles FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Step 5: Add Martin Van Caemerbeke as admin
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'martinvanca6@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Step 6: Add reservation type columns
ALTER TABLE reservations
    ADD COLUMN IF NOT EXISTS reservation_type TEXT DEFAULT 'normal' 
        CHECK (reservation_type IN ('normal', 'cours', 'match', 'interclub', 'admin')),
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS created_by_admin BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS confirmed_by_name TEXT;

-- Step 7: Create index
CREATE INDEX IF NOT EXISTS idx_reservations_type ON reservations(reservation_type);

-- Step 8: Comments
COMMENT ON TABLE user_roles IS 'User roles (admin/member). Roles managed manually via SQL to avoid RLS recursion.';
COMMENT ON COLUMN reservations.reservation_type IS 'Type: normal, cours, match, interclub, admin';
COMMENT ON COLUMN reservations.description IS 'Description for admin reservations';
COMMENT ON COLUMN reservations.created_by_admin IS 'True if created by admin';
COMMENT ON COLUMN reservations.confirmed_by_name IS 'Full name of the user who confirmed the reservation';
