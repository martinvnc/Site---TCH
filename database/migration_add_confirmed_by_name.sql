-- Migration: Add confirmed_by_name column to reservations table
-- This allows storing the confirmer's name directly in the reservation

ALTER TABLE reservations
    ADD COLUMN IF NOT EXISTS confirmed_by_name TEXT;

COMMENT ON COLUMN reservations.confirmed_by_name IS 'Full name of the user who confirmed the reservation';
