CREATE TABLE IF NOT EXISTS staff_users (
  email TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  barber_id TEXT CHECK (barber_id IN ('barber-1', 'barber-2') OR barber_id IS NULL),
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  iterations INTEGER NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('staff', 'admin')) DEFAULT 'staff',
  status TEXT NOT NULL CHECK (status IN ('active', 'disabled')) DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_staff_users_status ON staff_users (status);
