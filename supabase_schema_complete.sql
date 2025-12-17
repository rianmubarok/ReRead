-- =====================================================================================
-- SUPABASE SCHEMA COMPLETE (Users, Books, Bookmarks, Chats, Storage & Functions)
-- =====================================================================================
-- Note: Skema ini menggunakan pendekatan RLS yang PERMISIF (Public Access Allowed)
-- untuk mengakomodasi Hybrid Auth (Firebase Frontend + Supabase DB) tanpa sinkronisasi token.
-- Untuk production, harap perketat RLS dan gunakan mekanisme auth yang sesuai.
-- =====================================================================================

-- 1. UTILITIES & EXTENSIONS
-- =====================================================================================
create extension if not exists "pgcrypto";

-- Function to auto-update 'updated_at' column
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;


-- 2. USERS MANAGEMENT
-- =====================================================================================
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  uid text unique, -- Changed from uuid to text to support Firebase UID format
  name text not null,
  email text,
  avatar text,
  address jsonb, -- { province, regency, district, village }
  coordinates jsonb, -- { lat, lng }
  location_label text,
  is_verified boolean default false,
  join_date date,
  bio text,
  onboarding_completed boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger Users
drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

-- RLS Users (Permissive)
alter table public.users enable row level security;
create policy "Enable access for all users" on public.users for all using (true) with check (true);


-- 3. USERS STORAGE (Avatars)
-- =====================================================================================
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Public Avatar Access" on storage.objects for select using ( bucket_id = 'avatars' );
create policy "Public Avatar Upload" on storage.objects for insert with check ( bucket_id = 'avatars' );
create policy "Public Avatar Update" on storage.objects for update using ( bucket_id = 'avatars' );


-- 4. BOOKS MANAGEMENT
-- =====================================================================================
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  image text, 
  description text,
  category text, 
  condition text check (condition in ('Baru','Baik','Bekas')),
  owner_id uuid references public.users(id) on delete cascade,
  exchange_methods text[], 
  status text not null default 'Available',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Status Constraint
ALTER TABLE public.books DROP CONSTRAINT IF EXISTS books_status_check;
ALTER TABLE public.books ADD CONSTRAINT books_status_check CHECK (status IN ('Available', 'Archived'));

-- Indexes
create index if not exists idx_books_owner on public.books(owner_id);
create index if not exists idx_books_category on public.books(category);

-- Trigger Books
drop trigger if exists trg_books_updated_at on public.books;
create trigger trg_books_updated_at
before update on public.books
for each row execute function public.set_updated_at();

-- RLS Books
alter table public.books enable row level security;
create policy "Books all public" on public.books for all using (true) with check (true);


-- 5. BOOKS STORAGE (Covers)
-- =====================================================================================
insert into storage.buckets (id, name, public) values ('book-covers', 'book-covers', true)
on conflict (id) do nothing;

create policy "Public Access Book Covers" on storage.objects for select using ( bucket_id = 'book-covers' );
create policy "Public Upload Book Covers" on storage.objects for insert with check ( bucket_id = 'book-covers' );
create policy "Public Update Book Covers" on storage.objects for update using ( bucket_id = 'book-covers' );
create policy "Public Delete Book Covers" on storage.objects for delete using ( bucket_id = 'book-covers' );


-- 6. BOOKMARKS MANAGEMENT
-- =====================================================================================
create table if not exists public.bookmarks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL REFERENCES public.users(uid) ON DELETE CASCADE,
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, book_id)
);

-- RLS Bookmarks
alter table public.bookmarks enable row level security;
create policy "Bookmarks all public" on public.bookmarks for all using (true) with check (true);


-- 7. CHATS MANAGEMENT (Threads & Messages)
-- =====================================================================================

-- Tabel Chat Threads (Percakapan)
CREATE TABLE IF NOT EXISTS public.chat_threads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_a text NOT NULL REFERENCES public.users(uid) ON DELETE CASCADE,
  user_b text NOT NULL REFERENCES public.users(uid) ON DELETE CASCADE,
  last_message text,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Fix Foreign Key Constraints for PostgREST Join (PENTING)
-- Kita memastikan nama constraint manual agar konsisten
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'chat_threads_user_a_fkey') THEN
    ALTER TABLE public.chat_threads DROP CONSTRAINT chat_threads_user_a_fkey;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'chat_threads_user_b_fkey') THEN
    ALTER TABLE public.chat_threads DROP CONSTRAINT chat_threads_user_b_fkey;
  END IF;
END $$;

ALTER TABLE public.chat_threads
  ADD CONSTRAINT chat_threads_user_a_fkey FOREIGN KEY (user_a) REFERENCES public.users(uid) ON DELETE CASCADE,
  ADD CONSTRAINT chat_threads_user_b_fkey FOREIGN KEY (user_b) REFERENCES public.users(uid) ON DELETE CASCADE;

-- Index Unique Pair
CREATE UNIQUE INDEX IF NOT EXISTS idx_chat_unique_pair 
ON public.chat_threads (LEAST(user_a, user_b), GREATEST(user_a, user_b));

-- Trigger Chat Thread Update
drop trigger if exists trg_chat_threads_updated_at on public.chat_threads;
create trigger trg_chat_threads_updated_at
before update on public.chat_threads
for each row execute function public.set_updated_at();

-- Tabel Chat Messages (Pesan)
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id uuid NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  sender_id text NOT NULL REFERENCES public.users(uid),
  text text NOT NULL,
  book_id uuid REFERENCES public.books(id), 
  message_type text DEFAULT 'text', 
  metadata jsonb DEFAULT '{}'::jsonb,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.chat_messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.chat_messages(created_at);

-- RLS Chats
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Chat Threads" ON public.chat_threads FOR ALL USING (true);
CREATE POLICY "Public Chat Messages" ON public.chat_messages FOR ALL USING (true);


-- 8. FUNCTIONS (RPC)
-- =====================================================================================

-- Get or Create Chat Thread (Atomic Anti-Race Condition)
CREATE OR REPLACE FUNCTION get_or_create_chat_thread(
  current_user_id text,
  target_user_id text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_thread record;
BEGIN
  -- 1. Attempt to find existing thread first
  SELECT * INTO v_thread
  FROM public.chat_threads
  WHERE (user_a = current_user_id AND user_b = target_user_id)
     OR (user_a = target_user_id AND user_b = current_user_id)
  LIMIT 1;

  IF FOUND THEN
    RETURN row_to_json(v_thread);
  END IF;

  -- 2. If not found, attempt to insert
  BEGIN
    INSERT INTO public.chat_threads (user_a, user_b, last_message)
    VALUES (current_user_id, target_user_id, '')
    RETURNING * INTO v_thread;
    
    RETURN row_to_json(v_thread);
  EXCEPTION WHEN unique_violation THEN
    -- 3. If insert failed due to unique violation (race condition), fetch the existing one
    SELECT * INTO v_thread
    FROM public.chat_threads
    WHERE (user_a = current_user_id AND user_b = target_user_id)
       OR (user_a = target_user_id AND user_b = current_user_id)
    LIMIT 1;
    
    RETURN row_to_json(v_thread);
  END;
END;
$$;

-- 9. RELOAD SCHEMA CACHE
-- =====================================================================================
NOTIFY pgrst, 'reload schema';

-- END OF SCHEMA
