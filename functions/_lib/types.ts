import type { D1Database } from "@cloudflare/workers-types";

export type CloudflareEnv = {
  DB: D1Database;
  STAFF_SESSION_SECRET?: string;
  STAFF_PIN_BARBER_1?: string;
  STAFF_PIN_BARBER_2?: string;
  STAFF_PIN_BARBER_3?: string;
  STAFF_PIN_BARBER_4?: string;
  STAFF_PIN_BARBER_5?: string;
  [key: `STAFF_PIN_BARBER_${string}`]: string | undefined;
};

export type BookingRow = {
  booking_id: string;
  submission_id: string;
  slot_key: string;
  barber_id: string;
  barber_name: string;
  service_name: string;
  service_duration_minutes: number;
  service_price: number;
  currency: string;
  local_date: string;
  local_time: string;
  end_local_time: string;
  start_utc: string;
  end_utc: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string;
  timezone: string;
  status: "confirmed" | "deleted";
  created_at: string;
  deleted_at: string | null;
  cancellation_token: string | null;
};
