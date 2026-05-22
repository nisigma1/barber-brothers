-- Add per-booking cancellation token so customers can self-cancel from
-- a confirmation link without exposing the booking id.
-- The token is nullable to keep older bookings backward compatible.

ALTER TABLE bookings ADD COLUMN cancellation_token TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_cancellation_token
  ON bookings (cancellation_token)
  WHERE cancellation_token IS NOT NULL;
