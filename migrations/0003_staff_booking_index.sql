CREATE INDEX IF NOT EXISTS idx_bookings_barber_status_start ON bookings (barber_id, status, start_utc);
