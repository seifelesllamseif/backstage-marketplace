-- Optional square logo per catalog entry. Installs render it on the
-- marketplace card and fall back to the text-only layout when null, so this
-- is safe to apply before any row has one.
alter table public.mp_plugins
  add column if not exists icon_url text;
