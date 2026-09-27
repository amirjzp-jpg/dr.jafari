-- Initial schema. See BUILD-SPEC.md section 7 and docs/decisions.md.

CREATE TYPE appointment_status AS ENUM ('held', 'confirmed', 'cancelled', 'completed', 'no_show');
CREATE TYPE appointment_source AS ENUM ('web', 'staff', 'block');
CREATE TYPE visit_reason AS ENUM ('composite', 'veneer', 'other');

-- Patient bookings, holds, staff bookings and blocked time all live here, so
-- a single constraint protects every path against double-booking.
CREATE TABLE appointments (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_at         timestamptz NOT NULL,
  end_at           timestamptz NOT NULL,
  status           appointment_status NOT NULL,
  source           appointment_source NOT NULL,
  hold_expires_at  timestamptz,
  session_id       text,
  phone            text,
  name             text,
  reason           visit_reason,
  note             text,
  label            text,          -- for blocks, e.g. «تعطیلی رسمی»
  cancel_reason    text,          -- hold_expired | hold_released | clinic | replaced
  created_by       text,          -- staff phone for staff bookings and blocks
  confirmed_at     timestamptz,
  reminder_sent_at timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT end_after_start CHECK (end_at > start_at),
  CONSTRAINT held_has_expiry CHECK (status <> 'held' OR hold_expires_at IS NOT NULL),
  CONSTRAINT booking_has_patient CHECK (
    source = 'block' OR status = 'held' OR status = 'cancelled' OR (phone IS NOT NULL AND name IS NOT NULL)
  ),
  CONSTRAINT phone_format CHECK (phone IS NULL OR phone ~ '^09[0-9]{9}$'),

  -- The double-booking guarantee: no two active rows may overlap in time.
  -- Expired holds are cancelled inside the same transaction that takes a slot.
  CONSTRAINT no_overlapping_appointments
    EXCLUDE USING gist (tstzrange(start_at, end_at, '[)') WITH &&)
    WHERE (status IN ('held', 'confirmed'))
);

CREATE INDEX appointments_start_idx ON appointments (start_at);
CREATE INDEX appointments_phone_idx ON appointments (phone) WHERE phone IS NOT NULL;
CREATE INDEX appointments_session_held_idx ON appointments (session_id) WHERE status = 'held';

CREATE TABLE otp_codes (
  id          bigserial PRIMARY KEY,
  phone       text NOT NULL,
  purpose     text NOT NULL,       -- booking | admin
  code_hash   text NOT NULL,       -- HMAC-SHA256, never the code itself
  expires_at  timestamptz NOT NULL,
  attempts    int NOT NULL DEFAULT 0,
  consumed_at timestamptz,
  ip          text,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX otp_codes_phone_idx ON otp_codes (phone, purpose, created_at DESC);

-- A patient who verified their phone can skip OTP for 30 days on that device.
CREATE TABLE verified_devices (
  token_hash text PRIMARY KEY,
  phone      text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE admin_sessions (
  token_hash text PRIMARY KEY,
  phone      text NOT NULL,
  expires_at timestamptz NOT NULL,
  ip         text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE rate_events (
  key        text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX rate_events_key_idx ON rate_events (key, created_at);

CREATE TABLE settings (
  id         int PRIMARY KEY CHECK (id = 1),
  data       jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_log (
  id             bigserial PRIMARY KEY,
  at             timestamptz NOT NULL DEFAULT now(),
  actor          text NOT NULL,     -- staff phone, 'patient' or 'system'
  action         text NOT NULL,
  appointment_id uuid REFERENCES appointments (id) ON DELETE SET NULL,
  details        jsonb
);
CREATE INDEX audit_log_at_idx ON audit_log (at DESC);

CREATE TABLE sms_log (
  id         bigserial PRIMARY KEY,
  phone      text NOT NULL,
  template   text NOT NULL,
  ok         boolean NOT NULL,
  provider   text NOT NULL,
  detail     text,
  created_at timestamptz NOT NULL DEFAULT now()
);
