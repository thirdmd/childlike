-- USER CARTS TABLE
-- Stores persisted shopping carts per authenticated user
-- Used for cart carry-over across login/logout sessions

create table if not exists public.user_carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  items jsonb not null default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint user_carts_user_id_key unique (user_id)
);

create index if not exists user_carts_user_id_idx on public.user_carts(user_id);

-- RLS policies
alter table public.user_carts enable row level security;

drop policy if exists "Users can view own cart" on public.user_carts;
create policy "Users can view own cart"
  on public.user_carts for select
  using (auth.uid() = user_id);

drop policy if exists "Users can update own cart" on public.user_carts;
create policy "Users can update own cart"
  on public.user_carts for update
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own cart" on public.user_carts;
create policy "Users can insert own cart"
  on public.user_carts for insert
  with check (auth.uid() = user_id);

-- Auto-update timestamp trigger
drop trigger if exists user_carts_updated_at on public.user_carts;
create trigger user_carts_updated_at
  before update on public.user_carts
  for each row
  execute function public.handle_updated_at();
