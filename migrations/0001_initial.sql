CREATE TABLE IF NOT EXISTS bookings (
  booking_id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL UNIQUE,
  slot_key TEXT NOT NULL,
  barber_id TEXT NOT NULL,
  barber_name TEXT NOT NULL,
  service_name TEXT NOT NULL,
  service_duration_minutes INTEGER NOT NULL,
  service_price INTEGER NOT NULL,
  currency TEXT NOT NULL,
  local_date TEXT NOT NULL,
  local_time TEXT NOT NULL,
  end_local_time TEXT NOT NULL,
  start_utc TEXT NOT NULL,
  end_utc TEXT NOT NULL,
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  timezone TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'deleted')),
  created_at TEXT NOT NULL,
  deleted_at TEXT
);

CREATE TABLE IF NOT EXISTS slot_locks (
  slot_key TEXT PRIMARY KEY,
  barber_id TEXT NOT NULL,
  local_date TEXT NOT NULL,
  local_time TEXT NOT NULL,
  booking_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status = 'active'),
  start_utc TEXT NOT NULL,
  end_utc TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_bookings_status_start ON bookings (status, start_utc);
CREATE INDEX IF NOT EXISTS idx_bookings_slot_key ON bookings (slot_key);
CREATE INDEX IF NOT EXISTS idx_slot_locks_barber_date ON slot_locks (barber_id, local_date, status);
