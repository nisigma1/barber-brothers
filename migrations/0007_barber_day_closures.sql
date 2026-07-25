CREATE TABLE IF NOT EXISTS barber_day_closures (
  barber_id TEXT NOT NULL,
  local_date TEXT NOT NULL,
  reason TEXT NOT NULL CHECK (reason IN ('time-off', 'medical-leave')),
  created_at TEXT NOT NULL,
  PRIMARY KEY (barber_id, local_date)
);

CREATE INDEX IF NOT EXISTS idx_barber_day_closures_date
  ON barber_day_closures (barber_id, local_date);
