-- Standalone function to expire pending reservations
-- This function should be called periodically (every minute)
-- via Supabase Edge Function or pg_cron

CREATE OR REPLACE FUNCTION expire_pending_reservations()
RETURNS void AS $$
BEGIN
  UPDATE reservations
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at < NOW();
    
  -- Optional: Log how many reservations were expired
  -- RAISE NOTICE 'Expired % pending reservations', (SELECT COUNT(*) FROM reservations WHERE status = 'expired');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users (for edge function)
GRANT EXECUTE ON FUNCTION expire_pending_reservations() TO authenticated;

COMMENT ON FUNCTION expire_pending_reservations IS 'Marks expired pending reservations as expired. Should be called periodically (every minute) via cron or edge function';
