-- Run this in Supabase → SQL Editor (once)

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text not null default '',
  description text not null default '',
  photo_paths text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.memories enable row level security;

drop policy if exists "Public read memories" on public.memories;
drop policy if exists "Public insert memories" on public.memories;
drop policy if exists "Public update memories" on public.memories;
drop policy if exists "Public delete memories" on public.memories;

create policy "Public read memories"
  on public.memories for select
  using (true);

create policy "Public insert memories"
  on public.memories for insert
  with check (true);

create policy "Public update memories"
  on public.memories for update
  using (true)
  with check (true);

create policy "Public delete memories"
  on public.memories for delete
  using (true);

-- Storage bucket for photos (public read)
insert into storage.buckets (id, name, public)
values ('memory-photos', 'memory-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read memory photos" on storage.objects;
drop policy if exists "Public upload memory photos" on storage.objects;
drop policy if exists "Public update memory photos" on storage.objects;
drop policy if exists "Public delete memory photos" on storage.objects;

create policy "Public read memory photos"
  on storage.objects for select
  using (bucket_id = 'memory-photos');

create policy "Public upload memory photos"
  on storage.objects for insert
  with check (bucket_id = 'memory-photos');

create policy "Public update memory photos"
  on storage.objects for update
  using (bucket_id = 'memory-photos')
  with check (bucket_id = 'memory-photos');

create policy "Public delete memory photos"
  on storage.objects for delete
  using (bucket_id = 'memory-photos');
