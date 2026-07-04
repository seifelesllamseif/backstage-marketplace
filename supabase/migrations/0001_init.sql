-- backstage-marketplace: plugin catalog + GitHub-auth votes.
-- Tables are mp_-prefixed because they currently live on a shared
-- Supabase project; move to a dedicated project by running this file.
create table if not exists public.mp_plugins (
  id text primary key check (id ~ '^[a-z][a-z0-9-]{1,30}$'),
  name text not null check (char_length(name) between 1 and 60),
  description text not null check (char_length(description) between 1 and 200),
  version text not null check (char_length(version) <= 20),
  author text not null check (char_length(author) <= 60),
  "group" text not null check (char_length("group") <= 30),
  repo_url text not null,
  screenshots jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.mp_votes (
  plugin_id text not null references public.mp_plugins (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  primary key (plugin_id, user_id)
);

alter table public.mp_plugins enable row level security;
alter table public.mp_votes enable row level security;

create policy "mp_plugins_read" on public.mp_plugins for select using (true);
create policy "mp_votes_read" on public.mp_votes for select using (true);
create policy "mp_votes_insert_own" on public.mp_votes
  for insert with check (auth.uid() = user_id);
create policy "mp_votes_update_own" on public.mp_votes
  for update using (auth.uid() = user_id);
create policy "mp_votes_delete_own" on public.mp_votes
  for delete using (auth.uid() = user_id);
