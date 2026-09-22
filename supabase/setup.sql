-- Run this once in the Supabase SQL Editor for the Teach2Learn project.
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to authenticated;

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  role text not null check (char_length(role) between 1 and 160),
  image_url text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.science_fair_boards (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 180),
  destination_url text not null,
  preview_url text not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.team_members enable row level security;
alter table public.science_fair_boards enable row level security;

create policy "Public can view team members"
on public.team_members for select
to anon, authenticated
using (true);

create policy "Admins can manage team members"
on public.team_members for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

create policy "Public can view science fair boards"
on public.science_fair_boards for select
to anon, authenticated
using (true);

create policy "Admins can manage science fair boards"
on public.science_fair_boards for all
to authenticated
using (public.is_site_admin())
with check (public.is_site_admin());

insert into public.team_members (id, name, role, image_url, sort_order) values
  ('7bc5b4e4-4dd8-4f32-91e0-30e20cd8a8f1', 'Iris Shen', 'President', '/iris-shen.png', 0),
  ('a97b770b-e648-4a18-b920-70e4af307b7f', 'Rayhan Papar', 'Vice President', '/rayhan-papar.png', 1),
  ('6a3d932a-4908-4d67-bd75-1a9e0a235f82', 'Sanjan Sarang', 'Mentor & Workshop Development Lead', '/sanjan-sarang.png', 2)
on conflict (id) do nothing;

insert into public.science_fair_boards (id, title, destination_url, preview_url, sort_order) values
  ('6f80ee50-c385-4f5c-85c0-7b16322c23e7', 'Science Fair Board · 2023–24', 'https://www.canva.com/design/DAF9i5gFgUQ/kNrqyRJF2UbsNZ57-NfuTg/view', '/boards/board-01.png', 0),
  ('3268d702-f104-4293-af7a-02df23e0d3be', 'Science Fair Board · 2022–23', 'https://www.canva.com/design/DAF9i7jEHo8/qeyn0WoxZuBnFoAsRhDoig/view', '/boards/board-02.png', 1),
  ('399b2480-f2bc-4b12-a41e-83f113f48d80', 'ISEF-Qualifying Board · Felix Li', 'https://www.canva.com/design/DAF9TjvfhJk/hgb0vtw7CVM4gRv-CrXgiw/view', '/boards/board-03.png', 2),
  ('95c3b4ce-63f9-48ef-9e4a-af74a5bb8e5a', 'Jose Barrios & William Li', 'https://www.canva.com/design/DAGcCcz8qd0/-ijGHT3rXj1vcB8AAVYbqQ/view', '/boards/board-04.png', 3),
  ('c686e32a-a91f-4f14-96a5-f43aec62219f', 'Krushal & William', 'https://www.canva.com/design/DAF416k09Hk/T5ZnZKx6SOvY0eb5kYzerQ/view', '/boards/board-05.png', 4),
  ('fd893d50-cdfd-4499-beb2-5a894d498d59', 'Science Fair Board Example', 'https://www.canva.com/design/DAF9i6RGr9g/esANlhOIMy3SaBqqFAneYQ/view', '/boards/board-06.png', 5),
  ('28b93e4b-b8b1-461c-a10e-6a53d7647e2e', 'Science Fair Board · 2023–24', 'https://www.canva.com/design/DAF9i1UWv-E/4ucZIuaLk5jPESDJrb3Ccg/view', '/boards/board-07.png', 6),
  ('6e1d67a3-5250-415c-8da0-e1e68759bec6', 'Science Fair Board · 2024–25', 'https://www.canva.com/design/DAGchcT1gPA/xmbdGDpsP-nBG4MBfjp12g/view', '/boards/board-08.png', 7)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-images', 'site-images', true, 8388608, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public = true;

create policy "Public can view site images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'site-images');

create policy "Admins can upload site images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'site-images' and public.is_site_admin());

create policy "Admins can update site images"
on storage.objects for update
to authenticated
using (bucket_id = 'site-images' and public.is_site_admin())
with check (bucket_id = 'site-images' and public.is_site_admin());

create policy "Admins can delete site images"
on storage.objects for delete
to authenticated
using (bucket_id = 'site-images' and public.is_site_admin());

-- After creating your admin account in Authentication > Users, run:
-- insert into public.admin_users (user_id) values ('PASTE_THE_USER_UUID_HERE');
