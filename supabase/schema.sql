-- THRESHER MANAGER DATABASE
-- Run this whole file in Supabase SQL Editor.

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- PROFILES
-- Links business profile information to Supabase Auth users.
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- WORKERS
-- Master list. A worker can be active/inactive.
-- ------------------------------------------------------------
create table if not exists public.workers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_te text,
  name_kn text,
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.workers
  add column if not exists name_te text,
  add column if not exists name_kn text;

create index if not exists workers_name_idx on public.workers(name);
create index if not exists workers_active_idx on public.workers(active);

-- ------------------------------------------------------------
-- SETTLEMENTS
-- One row = one day's thresher work settlement.
-- ------------------------------------------------------------
create table if not exists public.settlements (
  id uuid primary key default gen_random_uuid(),
  work_date date not null,
  total_income numeric(12,2) not null check (total_income >= 0),
  diesel_expense numeric(12,2) not null default 0 check (diesel_expense >= 0),
  net_amount numeric(12,2) not null,
  owner_share numeric(12,2) not null,
  workers_share numeric(12,2) not null,
  worker_count integer not null check (worker_count > 0),
  notes text,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  check (diesel_expense <= total_income),
  check (net_amount = round(total_income - diesel_expense, 2)),
  check (owner_share = round(net_amount / 2, 2)),
  check (workers_share = round(net_amount / 2, 2))
);

create index if not exists settlements_work_date_idx
  on public.settlements(work_date desc);

-- ------------------------------------------------------------
-- SETTLEMENT WORKERS
-- Snapshot of who worked that day + their wage.
-- worker_name is intentionally stored as a snapshot so old
-- records do not change if the master worker name changes.
-- ------------------------------------------------------------
create table if not exists public.settlement_workers (
  id uuid primary key default gen_random_uuid(),
  settlement_id uuid not null references public.settlements(id) on delete cascade,
  worker_id uuid references public.workers(id) on delete set null,
  worker_name text not null,
  worker_name_te text,
  worker_name_kn text,
  wage_amount numeric(12,2) not null check (wage_amount >= 0),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid')),
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  unique (settlement_id, worker_id)
);

alter table public.settlement_workers
  add column if not exists worker_name_te text,
  add column if not exists worker_name_kn text;

create index if not exists settlement_workers_settlement_idx
  on public.settlement_workers(settlement_id);

create index if not exists settlement_workers_worker_idx
  on public.settlement_workers(worker_id);

-- ------------------------------------------------------------
-- AUTO PROFILE CREATION
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- CREATE SETTLEMENT RPC
-- The server/database recalculates the financial split.
-- The browser cannot override owner_share/wages.
-- ------------------------------------------------------------
create or replace function public.create_settlement(
  p_work_date date,
  p_total_income numeric,
  p_diesel_expense numeric,
  p_worker_ids uuid[],
  p_notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_settlement_id uuid;
  v_worker_count integer;
  v_net numeric(12,2);
  v_owner numeric(12,2);
  v_workers numeric(12,2);
  v_per_worker numeric(12,2);
  v_worker record;
begin
  if v_user is null then
    raise exception 'Authentication required';
  end if;

  if p_total_income is null or p_total_income <= 0 then
    raise exception 'Total income must be greater than zero';
  end if;

  if p_diesel_expense is null or p_diesel_expense < 0 then
    raise exception 'Diesel expense cannot be negative';
  end if;

  if p_diesel_expense > p_total_income then
    raise exception 'Diesel expense cannot be greater than income';
  end if;

  v_worker_count := coalesce(array_length(p_worker_ids, 1), 0);

  if v_worker_count < 1 then
    raise exception 'At least one worker is required';
  end if;

  -- Only active workers can be selected.
  if (
    select count(*)
    from public.workers
    where id = any(p_worker_ids)
      and active = true
  ) <> v_worker_count then
    raise exception 'One or more selected workers are invalid or inactive';
  end if;

  v_net := round(p_total_income - p_diesel_expense, 2);
  v_owner := round(v_net / 2, 2);
  v_workers := round(v_net / 2, 2);
  v_per_worker := round(v_workers / v_worker_count, 2);

  insert into public.settlements (
    work_date,
    total_income,
    diesel_expense,
    net_amount,
    owner_share,
    workers_share,
    worker_count,
    notes,
    created_by
  )
  values (
    p_work_date,
    round(p_total_income, 2),
    round(p_diesel_expense, 2),
    v_net,
    v_owner,
    v_workers,
    v_worker_count,
    p_notes,
    v_user
  )
  returning id into v_settlement_id;

  for v_worker in
    select id, name, name_te, name_kn
    from public.workers
    where id = any(p_worker_ids)
      and active = true
    order by name
  loop
    insert into public.settlement_workers (
      settlement_id,
      worker_id,
      worker_name,
      worker_name_te,
      worker_name_kn,
      wage_amount
    )
    values (
      v_settlement_id,
      v_worker.id,
      v_worker.name,
      v_worker.name_te,
      v_worker.name_kn,
      v_per_worker
    );
  end loop;

  return v_settlement_id;
end;
$$;

-- ------------------------------------------------------------
-- RLS
-- Only authenticated users can access business data.
-- For a single-admin app, only create your admin auth user.
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.workers enable row level security;
alter table public.settlements enable row level security;
alter table public.settlement_workers enable row level security;

drop policy if exists "authenticated profiles read" on public.profiles;
create policy "authenticated profiles read"
on public.profiles for select
to authenticated
using (true);

drop policy if exists "authenticated workers read" on public.workers;
create policy "authenticated workers read"
on public.workers for select
to authenticated
using (true);

drop policy if exists "authenticated workers insert" on public.workers;
create policy "authenticated workers insert"
on public.workers for insert
to authenticated
with check (true);

drop policy if exists "authenticated workers update" on public.workers;
create policy "authenticated workers update"
on public.workers for update
to authenticated
using (true)
with check (true);

drop policy if exists "authenticated workers delete" on public.workers;
create policy "authenticated workers delete"
on public.workers for delete
to authenticated
using (true);

drop policy if exists "authenticated settlements read" on public.settlements;
create policy "authenticated settlements read"
on public.settlements for select
to authenticated
using (true);

drop policy if exists "authenticated settlements delete" on public.settlements;
create policy "authenticated settlements delete"
on public.settlements for delete
to authenticated
using (true);

drop policy if exists "authenticated settlement workers read" on public.settlement_workers;
create policy "authenticated settlement workers read"
on public.settlement_workers for select
to authenticated
using (true);

drop policy if exists "authenticated settlement workers update" on public.settlement_workers;
create policy "authenticated settlement workers update"
on public.settlement_workers for update
to authenticated
using (true)
with check (true);

-- RPC is executed as the function owner and checks auth.uid() itself.
revoke all on function public.create_settlement(date, numeric, numeric, uuid[], text)
from public;
grant execute on function public.create_settlement(date, numeric, numeric, uuid[], text)
to authenticated;

-- Optional starter workers:
-- Uncomment and edit these if you want to insert your initial worker list.
--
-- insert into public.workers (name) values
-- ('Worker 01'), ('Worker 02'), ('Worker 03'), ('Worker 04'),
-- ('Worker 05'), ('Worker 06'), ('Worker 07'), ('Worker 08'),
-- ('Worker 09'), ('Worker 10'), ('Worker 11'), ('Worker 12'),
-- ('Worker 13'), ('Worker 14'), ('Worker 15'), ('Worker 16'),
-- ('Worker 17'), ('Worker 18'), ('Worker 19'), ('Worker 20');
