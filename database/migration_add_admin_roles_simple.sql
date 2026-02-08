-- Migration SIMPLIFIED: Admin roles without RLS recursion
-- Execute this INSTEAD of migration_add_admin_roles.sql

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

-- Step 3: Simple RLS policy - users can read their own role only
CREATE POLICY "Users can read own role"
    ON user_roles FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Step 4: Add Martin Van Caemerbeke as admin
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'martinvanca6@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Step 5: Add reservation type columns
ALTER TABLE reservations
    ADD COLUMN IF NOT EXISTS reservation_type TEXT DEFAULT 'normal' 
        CHECK (reservation_type IN ('normal', 'cours', 'match', 'interclub', 'admin')),
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS created_by_admin BOOLEAN DEFAULT false;

-- Step 6: Create index
CREATE INDEX IF NOT EXISTS idx_reservations_type ON reservations(reservation_type);

-- Step 7: Comments
COMMENT ON TABLE user_roles IS 'User roles (admin/member). Roles managed manually via SQL to avoid RLS recursion.';
COMMENT ON COLUMN reservations.reservation_type IS 'Type: normal, cours, match, interclub, admin';
COMMENT ON COLUMN reservations.description IS 'Description for admin reservations';
COMMENT ON COLUMN reservations.created_by_admin IS 'True if created by admin';

-- NOTE: We don't add RLS policies for admin reservation management
-- because they would cause infinite recursion. Admin checks are done
-- in the application code via isAdmin() helper function.
