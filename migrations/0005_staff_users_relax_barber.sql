-- Relax staff_users.barber_id CHECK constraint so the table accepts any
-- active barber id from the central config (barber-3, barber-4, barber-5 ...)
-- SQLite does not support ALTER COLUMN, so recreate the table.

CREATE TABLE IF NOT EXISTS staff_users_new (
  email TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  barber_id TEXT,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  iterations INTEGER NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('staff', 'admin')) DEFAULT 'staff',
  status TEXT NOT NULL CHECK (status IN ('active', 'disabled')) DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT INTO staff_users_new (
  email, display_name, barber_id, password_hash, password_salt,
  iterations, role, status, created_at, updated_at
)
SELECT email, display_name, barber_id, password_hash, password_salt,
       iterations, role, status, created_at, updated_at
FROM staff_users;

DROP TABLE staff_users;
ALTER TABLE staff_users_new RENAME TO staff_users;

CREATE INDEX IF NOT EXISTS idx_staff_users_status ON staff_users (status);
