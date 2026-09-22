-- Run once in the Supabase SQL Editor for an existing Teach2Learn project.
alter table public.team_members
add column if not exists linkedin_url text;
