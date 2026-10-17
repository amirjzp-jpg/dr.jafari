-- First-party, cookieless traffic log (no IP stored; sid is a daily-rotating hash) and SEO audit runs.
CREATE TABLE analytics_hits (
  id         bigserial PRIMARY KEY,
  at         timestamptz NOT NULL DEFAULT now(),
  kind       text NOT NULL CHECK (kind IN ('view', 'bot')),
  path       text NOT NULL,
  lang       text NOT NULL DEFAULT 'fa',
  ref_host   text,
  ref_kind   text,
  utm_source text,
  device     text,
  browser    text,
  os         text,
  bot_name   text,
  bot_kind   text,
  sid        text
);
CREATE INDEX analytics_hits_at_idx ON analytics_hits (at DESC);
CREATE INDEX analytics_hits_kind_at_idx ON analytics_hits (kind, at DESC);

CREATE TABLE analytics_audits (
  id      bigserial PRIMARY KEY,
  at      timestamptz NOT NULL DEFAULT now(),
  actor   text NOT NULL,
  results jsonb NOT NULL
);
