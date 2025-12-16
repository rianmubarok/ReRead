-- BAGIAN 1: SETUP USER & STORAGE AVATAR
-- Jalankan kode ini pertama kali di SQL Editor Supabase.

-- 1. Mengaktifkan ekstensi untuk UUID
create extension if not exists "pgcrypto";

-- 2. Membuat tabel USERS
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  uid uuid unique, -- Akan cocok dengan auth.users.id dari Supabase Auth
  name text not null,
  email text,
  avatar text,
  address jsonb, -- Format: { province, regency, district, village }
  coordinates jsonb, -- Format: { lat, lng }
  location_label text,
  is_verified boolean default false,
  join_date date,
  bio text,
  onboarding_completed boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Fungsi otomatis update kolom updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger untuk tabel users
drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

-- 4. Keamanan (RLS) untuk Tabel Users
alter table public.users enable row level security;

-- Policy: Semua orang bisa melihat profil user (public)
create policy "Users select"
  on public.users for select
  using (true);

-- Policy: User bisa membuat profilnya sendiri saat register
create policy "Users insert self"
  on public.users for insert
  with check (auth.uid() = uid);

-- Policy: User hanya bisa mengedit profilnya sendiri
create policy "Users update self"
  on public.users for update
  using (auth.uid() = uid)
  with check (auth.uid() = uid);

-- 5. SETUP STORAGE (BUCKET AVATARS)
-- Mencoba membuat bucket 'avatars' jika belum ada
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Policy Storage: Semua orang bisa melihat (download) avatar
create policy "Public Avatar Access"
  on storage.objects for select
  using ( bucket_id = 'avatars' );

-- Policy Storage: User yang login bisa upload avatar
create policy "User Avatar Upload"
  on storage.objects for insert
  with check ( bucket_id = 'avatars' and auth.role() = 'authenticated' );

-- Policy Storage: User bisa update/delete file mereka sendiri (Opsional, untuk fitur ganti foto)
create policy "User Avatar Update"
  on storage.objects for update
  using ( bucket_id = 'avatars' and auth.uid() = owner )
  with check ( bucket_id = 'avatars' and auth.uid() = owner );
