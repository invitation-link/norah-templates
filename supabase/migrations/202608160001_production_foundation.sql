begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), new.phone)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  template_id text,
  slug text unique,
  plan_id text not null default 'FREE_AD_SUPPORTED',
  status text not null default 'DRAFT',
  content jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.invitations add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.invitations add column if not exists template_id text;
alter table public.invitations add column if not exists slug text;
alter table public.invitations add column if not exists plan_id text not null default 'FREE_AD_SUPPORTED';
alter table public.invitations add column if not exists status text not null default 'DRAFT';
alter table public.invitations add column if not exists content jsonb not null default '{}'::jsonb;
alter table public.invitations add column if not exists published_at timestamptz;
alter table public.invitations add column if not exists archived_at timestamptz;
alter table public.invitations add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='invitations' and column_name='title') then
    alter table public.invitations alter column title drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='invitations' and column_name='event_name') then
    alter table public.invitations alter column event_name drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='invitations' and column_name='event_date') then
    alter table public.invitations alter column event_date drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='invitations' and column_name='event_time') then
    alter table public.invitations alter column event_time drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='invitations' and column_name='venue') then
    alter table public.invitations alter column venue drop not null;
  end if;
end $$;

create unique index if not exists invitations_slug_unique on public.invitations(slug) where slug is not null;
create index if not exists invitations_owner_updated on public.invitations(user_id, updated_at desc);
create index if not exists invitations_public_slug on public.invitations(slug) where status = 'PUBLISHED';

alter table public.invitations drop constraint if exists invitations_plan_id_check;
alter table public.invitations add constraint invitations_plan_id_check check (plan_id in ('FREE_AD_SUPPORTED','ESSENTIAL','PREMIUM')) not valid;
alter table public.invitations drop constraint if exists invitations_status_check;
alter table public.invitations add constraint invitations_status_check check (status in ('DRAFT','PAYMENT_PENDING','PUBLISHED','ARCHIVED')) not valid;

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_name text not null,
  guest_phone text,
  guest_email text,
  attending boolean not null,
  guests_count integer not null default 1 check (guests_count between 0 and 20),
  message text,
  created_at timestamptz not null default now()
);
create index if not exists rsvps_invitation_created on public.rsvps(invitation_id, created_at desc);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  plan_id text not null check (plan_id in ('ESSENTIAL','PREMIUM')),
  amount_paise integer not null check (amount_paise > 0),
  currency text not null default 'INR',
  provider text not null default 'razorpay',
  provider_order_id text not null unique,
  provider_payment_id text unique,
  status text not null default 'CREATED' check (status in ('CREATED','PAID','FAILED','REFUNDED')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);
create index if not exists payments_owner_created on public.payments(user_id, created_at desc);

create table if not exists public.invitation_events (
  id bigint generated by default as identity primary key,
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  event_type text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists invitation_events_rollup on public.invitation_events(invitation_id, event_type, created_at desc);

create table if not exists public.bespoke_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  phone text not null,
  occasion text not null,
  event_date text,
  brief text not null,
  status text not null default 'NEW',
  created_at timestamptz not null default now()
);

create table if not exists public.rate_limits (
  key text not null,
  scope text not null,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 1,
  primary key (key, scope)
);

create or replace function public.check_rate_limit(p_key text, p_scope text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare allowed boolean;
begin
  insert into public.rate_limits as rl (key, scope, window_started_at, request_count)
  values (p_key, p_scope, now(), 1)
  on conflict (key, scope) do update set
    window_started_at = case when rl.window_started_at < now() - make_interval(secs => p_window_seconds) then now() else rl.window_started_at end,
    request_count = case when rl.window_started_at < now() - make_interval(secs => p_window_seconds) then 1 else rl.request_count + 1 end
  returning request_count <= p_limit into allowed;
  return allowed;
end;
$$;

alter table public.profiles enable row level security;
alter table public.invitations enable row level security;
alter table public.rsvps enable row level security;
alter table public.payments enable row level security;
alter table public.invitation_events enable row level security;
alter table public.bespoke_requests enable row level security;
alter table public.rate_limits enable row level security;

do $$
declare p record;
begin
  for p in
    select tablename, policyname from pg_policies
    where schemaname = 'public'
      and tablename in ('profiles','invitations','rsvps','payments','invitation_events','bespoke_requests','rate_limits')
  loop
    execute format('drop policy %I on public.%I', p.policyname, p.tablename);
  end loop;
end $$;

create policy "profiles_self_select" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_self_update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "invitations_owner_all" on public.invitations for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "rsvps_owner_select" on public.rsvps for select to authenticated using (exists (select 1 from public.invitations i where i.id = invitation_id and i.user_id = auth.uid()));
create policy "payments_owner_select" on public.payments for select to authenticated using (auth.uid() = user_id);
create policy "events_owner_select" on public.invitation_events for select to authenticated using (exists (select 1 from public.invitations i where i.id = invitation_id and i.user_id = auth.uid()));
create policy "bespoke_owner_select" on public.bespoke_requests for select to authenticated using (auth.uid() = user_id);

revoke all on public.profiles, public.invitations, public.rsvps, public.payments, public.invitation_events, public.bespoke_requests, public.rate_limits from anon;
grant select, insert, update, delete on public.profiles, public.invitations, public.rsvps, public.payments, public.invitation_events, public.bespoke_requests to authenticated;
revoke all on function public.check_rate_limit(text,text,integer,integer) from public, anon, authenticated;
grant execute on function public.check_rate_limit(text,text,integer,integer) to service_role;

alter table public.tiranga_contacts enable row level security;
alter table public.tiranga_participants enable row level security;
alter table public.tiranga_shares enable row level security;
revoke all on public.tiranga_contacts, public.tiranga_participants, public.tiranga_shares from anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('invitations', 'invitations', false, 5242880, array['image/jpeg','image/png','image/webp','audio/mpeg','audio/mp4'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

do $$
declare p record;
begin
  for p in select policyname from pg_policies where schemaname = 'storage' and tablename = 'objects' and (coalesce(qual,'') ilike '%invitations%' or coalesce(with_check,'') ilike '%invitations%')
  loop execute format('drop policy %I on storage.objects', p.policyname); end loop;
end $$;

commit;
