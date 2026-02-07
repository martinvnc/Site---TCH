-- Migration: Add confirmation system to reservations table
-- This enables two-step confirmation with automatic expiration after 15 minutes

-- Step 1: Add new columns to reservations table
ALTER TABLE reservations
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'confirmed', 'expired')),
  ADD COLUMN IF NOT EXISTS confirmed_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE NOT NULL 
    DEFAULT (now() + INTERVAL '15 minutes');

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_expires_at ON reservations(expires_at);
CREATE INDEX IF NOT EXISTS idx_reservations_confirmed_by ON reservations(confirmed_by);

-- Step 3: Update existing reservations to 'confirmed' status
-- (to avoid breaking existing reservations)
UPDATE reservations 
SET status = 'confirmed', 
    confirmed_at = created_at
WHERE status = 'pending' AND created_at < NOW() - INTERVAL '15 minutes';

-- Step 4: Create function to expire pending reservations
CREATE OR REPLACE FUNCTION expire_pending_reservations()
RETURNS void AS $$
BEGIN
  UPDATE reservations
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Update RLS policies to allow confirmation by other users
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all reservations" ON reservations;
DROP POLICY IF EXISTS "Users can create reservations" ON reservations;
DROP POLICY IF EXISTS "Users can update own reservations" ON reservations;
DROP POLICY IF EXISTS "Users can delete own reservations" ON reservations;

-- Allow all authenticated users to view reservations
CREATE POLICY "Users can view all reservations"
  ON reservations FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to create reservations
CREATE POLICY "Users can create reservations"
  ON reservations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to confirm others' pending reservations (but not their own)
CREATE POLICY "Users can confirm others reservations"
  ON reservations FOR UPDATE
  TO authenticated
  USING (
    status = 'pending' 
    AND auth.uid() != user_id
    AND expires_at > NOW()
  )
  WITH CHECK (
    status = 'confirmed'
    AND confirmed_by = auth.uid()
  );

-- Allow users to delete their own reservations
CREATE POLICY "Users can delete own reservations"
  ON reservations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Step 6: Add comment for documentation
COMMENT ON COLUMN reservations.status IS 'Reservation status: pending (awaiting confirmation), confirmed (validated by another user), expired (not confirmed within 15 minutes)';
COMMENT ON COLUMN reservations.expires_at IS 'Timestamp when pending reservation expires if not confirmed';
COMMENT ON FUNCTION expire_pending_reservations IS 'Marks expired pending reservations as expired. Should be called periodically (every minute) via cron or edge function';
