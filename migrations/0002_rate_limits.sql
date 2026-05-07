CREATE TABLE IF NOT EXISTS request_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL,
  reset_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_request_limits_reset_at ON request_limits (reset_at);
CREATE INDEX IF NOT EXISTS idx_bookings_phone_created ON bookings (customer_phone, status, created_at);
