-- Client IP on live holds, so one client can't hold many slots at once.
ALTER TABLE appointments ADD COLUMN hold_ip text;
CREATE INDEX appointments_hold_ip_idx ON appointments (hold_ip) WHERE status = 'held';
