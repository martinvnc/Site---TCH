-- Migration CORRECTED: Fix infinite recursion in user_roles policies
-- This replaces the problematic policies from migration_add_admin_roles.sql

-- Step 1: Drop the problematic policies if they exist
DROP POLICY IF EXISTS "Only admins can modify roles" ON user_roles;
DROP POLICY IF EXISTS "Anyone can read roles" ON user_roles;

-- Step 2: Simple, safe policies without recursion

-- Everyone can READ their own role (no recursion)
CREATE POLICY "Users can read own role"
    ON user_roles FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- No INSERT/UPDATE/DELETE policies - we'll manage roles manually via SQL
-- This prevents the recursion issue and is safer for production

COMMENT ON TABLE user_roles IS 'User roles are managed via SQL only to avoid recursion in RLS policies';
