-- Supabase schema for ReRead
-- Copy/paste this into Supabase SQL editor (run in "public" schema).

-- Extensions
create extension if not exists "pgcrypto";

-- USERS
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  uid uuid unique, -- should match auth.users.id
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

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

-- BOOKS
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text not null,
  image text,
  description text,
  category text check (
    category in (
      'Fiksi','Non-Fiksi','Pendidikan','Komik','Sastra',
      'Biografi','Teknologi','Seni','Agama','Hobi'
    )
  ),
  condition text check (condition in ('Baru','Baik','Bekas')),
  owner_id uuid references public.users(id) on delete cascade,
  price numeric,
  exchange_methods text[], -- e.g. {"Nego","Barter"}
  location_label text,
  distance_km numeric,
  coordinates jsonb, -- { lat, lng }
  is_trending boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_books_updated_at on public.books;
create trigger trg_books_updated_at
before update on public.books
for each row execute function public.set_updated_at();

create index if not exists idx_books_owner on public.books(owner_id);
create index if not exists idx_books_category on public.books(category);
create index if not exists idx_books_is_trending on public.books(is_trending);

-- BOOKMARKS
create table if not exists public.bookmarks (
  user_id uuid references public.users(id) on delete cascade,
  book_id uuid references public.books(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, book_id)
);

-- CHAT THREADS
create table if not exists public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  user_a_id uuid references public.users(id) on delete cascade,
  user_b_id uuid references public.users(id) on delete cascade,
  book_id uuid references public.books(id) on delete set null,
  last_message text,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_chat_threads_updated_at on public.chat_threads;
create trigger trg_chat_threads_updated_at
before update on public.chat_threads
for each row execute function public.set_updated_at();

create index if not exists idx_chat_threads_user_a on public.chat_threads(user_a_id);
create index if not exists idx_chat_threads_user_b on public.chat_threads(user_b_id);
create index if not exists idx_chat_threads_book on public.chat_threads(book_id);

-- CHAT MESSAGES
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references public.chat_threads(id) on delete cascade,
  sender_id uuid references public.users(id) on delete cascade,
  book_id uuid references public.books(id) on delete set null,
  text text not null,
  is_read boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_chat_messages_updated_at on public.chat_messages;
create trigger trg_chat_messages_updated_at
before update on public.chat_messages
for each row execute function public.set_updated_at();

create index if not exists idx_chat_messages_chat on public.chat_messages(chat_id);
create index if not exists idx_chat_messages_sender on public.chat_messages(sender_id);

-- EXCHANGE HISTORY
create table if not exists public.exchange_history (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references public.chat_threads(id) on delete set null,
  book_id uuid references public.books(id) on delete set null,
  buyer_id uuid references public.users(id) on delete set null,
  seller_id uuid references public.users(id) on delete set null,
  type text check (type in ('Beli','Barter')),
  price numeric,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists idx_exchange_history_book on public.exchange_history(book_id);
create index if not exists idx_exchange_history_buyer on public.exchange_history(buyer_id);
create index if not exists idx_exchange_history_seller on public.exchange_history(seller_id);

-- RLS POLICIES
alter table public.users enable row level security;
alter table public.books enable row level security;
alter table public.bookmarks enable row level security;
alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;
alter table public.exchange_history enable row level security;

-- USERS policies: readable by all, self-manage via auth.uid()
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'users' and policyname = 'Users select'
  ) then
    create policy "Users select"
      on public.users for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'users' and policyname = 'Users insert self'
  ) then
    create policy "Users insert self"
      on public.users for insert
      with check (auth.uid() = uid);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'users' and policyname = 'Users update self'
  ) then
    create policy "Users update self"
      on public.users for update
      using (auth.uid() = uid)
      with check (auth.uid() = uid);
  end if;
end $$;

-- EXCHANGE HISTORY policies: participants only
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'exchange_history' and policyname = 'Exchange history select participants'
  ) then
    create policy "Exchange history select participants"
      on public.exchange_history for select
      using (
        exists (
          select 1
          from public.users u
          where u.uid = auth.uid()
            and (u.id = buyer_id or u.id = seller_id)
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'exchange_history' and policyname = 'Exchange history insert participants'
  ) then
    create policy "Exchange history insert participants"
      on public.exchange_history for insert
      with check (
        exists (
          select 1
          from public.users u
          where u.uid = auth.uid()
            and (u.id = buyer_id or u.id = seller_id)
        )
      );
  end if;
end $$;

-- BOOKS policies: anyone can read, owners manage their books
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'books' and policyname = 'Books select'
  ) then
    create policy "Books select"
      on public.books for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'books' and policyname = 'Books insert owner'
  ) then
    create policy "Books insert owner"
      on public.books for insert
      with check (
        exists (
          select 1 from public.users u
          where u.id = owner_id and u.uid = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'books' and policyname = 'Books update owner'
  ) then
    create policy "Books update owner"
      on public.books for update
      using (
        exists (
          select 1 from public.users u
          where u.id = owner_id and u.uid = auth.uid()
        )
      )
      with check (
        exists (
          select 1 from public.users u
          where u.id = owner_id and u.uid = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'books' and policyname = 'Books delete owner'
  ) then
    create policy "Books delete owner"
      on public.books for delete
      using (
        exists (
          select 1 from public.users u
          where u.id = owner_id and u.uid = auth.uid()
        )
      );
  end if;
end $$;

-- BOOKMARKS policies: owner only, readable by owner
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'bookmarks' and policyname = 'Bookmarks select self'
  ) then
    create policy "Bookmarks select self"
      on public.bookmarks for select
      using (
        exists (
          select 1 from public.users u
          where u.id = user_id and u.uid = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'bookmarks' and policyname = 'Bookmarks insert self'
  ) then
    create policy "Bookmarks insert self"
      on public.bookmarks for insert
      with check (
        exists (
          select 1 from public.users u
          where u.id = user_id and u.uid = auth.uid()
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'bookmarks' and policyname = 'Bookmarks delete self'
  ) then
    create policy "Bookmarks delete self"
      on public.bookmarks for delete
      using (
        exists (
          select 1 from public.users u
          where u.id = user_id and u.uid = auth.uid()
        )
      );
  end if;
end $$;

-- CHAT THREADS policies: participants only
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'chat_threads' and policyname = 'Chat threads select participants'
  ) then
    create policy "Chat threads select participants"
      on public.chat_threads for select
      using (
        exists (
          select 1 from public.users u
          where u.uid = auth.uid()
            and (u.id = user_a_id or u.id = user_b_id)
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'chat_threads' and policyname = 'Chat threads insert participants'
  ) then
    create policy "Chat threads insert participants"
      on public.chat_threads for insert
      with check (
        exists (
          select 1 from public.users u
          where u.uid = auth.uid()
            and (u.id = user_a_id or u.id = user_b_id)
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'chat_threads' and policyname = 'Chat threads update participants'
  ) then
    create policy "Chat threads update participants"
      on public.chat_threads for update
      using (
        exists (
          select 1 from public.users u
          where u.uid = auth.uid()
            and (u.id = user_a_id or u.id = user_b_id)
        )
      )
      with check (
        exists (
          select 1 from public.users u
          where u.uid = auth.uid()
            and (u.id = user_a_id or u.id = user_b_id)
        )
      );
  end if;
end $$;

-- CHAT MESSAGES policies: participants only
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'chat_messages' and policyname = 'Chat messages select participants'
  ) then
    create policy "Chat messages select participants"
      on public.chat_messages for select
      using (
        exists (
          select 1
          from public.chat_threads t
          join public.users u on u.uid = auth.uid()
          where t.id = chat_id and (u.id = t.user_a_id or u.id = t.user_b_id)
        )
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'chat_messages' and policyname = 'Chat messages insert participants'
  ) then
    create policy "Chat messages insert participants"
      on public.chat_messages for insert
      with check (
        exists (
          select 1
          from public.chat_threads t
          join public.users u on u.uid = auth.uid()
          where t.id = chat_id and u.id = sender_id
        )
      );
  end if;
end $$;

-- Helpful view to list threads with "other user" for a given auth.uid()
create or replace view public.chat_threads_with_other as
select
  t.*,
  case
    when ua.uid = auth.uid() then t.user_b_id
    else t.user_a_id
  end as other_user_id
from public.chat_threads t
join public.users ua on ua.id = t.user_a_id
join public.users ub on ub.id = t.user_b_id;


