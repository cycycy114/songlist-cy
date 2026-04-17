create extension if not exists pgcrypto;

create table if not exists public.songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null,
  language text not null,
  status text not null check (status in ('ready', 'learning', 'resting')),
  tags text[] not null default '{}',
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  song_title text not null,
  artist text not null default '',
  message text not null,
  requester_name text,
  status text not null default 'pending' check (status in ('pending', 'reviewing', 'planned', 'declined')),
  matched_song_id uuid references public.songs (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.songs enable row level security;
alter table public.requests enable row level security;

drop policy if exists "public songs are readable" on public.songs;
create policy "public songs are readable"
  on public.songs
  for select
  using (is_public = true);

drop policy if exists "authenticated users can manage songs" on public.songs;
create policy "authenticated users can manage songs"
  on public.songs
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "public can create requests" on public.requests;
create policy "public can create requests"
  on public.requests
  for insert
  with check (true);

drop policy if exists "authenticated users can read requests" on public.requests;
create policy "authenticated users can read requests"
  on public.requests
  for select
  using (auth.role() = 'authenticated');

drop policy if exists "authenticated users can update requests" on public.requests;
create policy "authenticated users can update requests"
  on public.requests
  for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
