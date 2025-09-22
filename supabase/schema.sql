-- Table storing normalized listings imported from Autovit
create table if not exists public.autovit_listings (
    id uuid primary key default gen_random_uuid(),
    autovit_id text not null unique,
    slug text,
    status text,
    title text not null,
    subtitle text,
    price_value numeric not null,
    price_currency text not null default 'EUR',
    price_old_value numeric,
    price_negotiable boolean,
    price_labels text[],
    mileage_km integer,
    year integer,
    engine_capacity_cc integer,
    engine_power_hp integer,
    fuel_type text,
    gearbox text,
    transmission text,
    body_type text,
    color text,
    emission_class text,
    co2_emissions text,
    consumption jsonb,
    vin text,
    first_registration text,
    technical_inspection text,
    last_service text,
    main_features jsonb,
    badges jsonb,
    highlight_tags text[],
    images jsonb,
    main_image text,
    location_label text,
    description text,
    details jsonb,
    feature_groups jsonb,
    technical_specs jsonb,
    seller jsonb,
    financing_options jsonb,
    created_at timestamptz default timezone('utc'::text, now()) not null,
    updated_at timestamptz default timezone('utc'::text, now()) not null,
    payload jsonb
);

-- Simple updated_at trigger
create extension if not exists pgcrypto;
create or replace function public.autovit_listings_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists autovit_listings_touch_updated_at on public.autovit_listings;
create trigger autovit_listings_touch_updated_at
before update on public.autovit_listings
for each row execute function public.autovit_listings_touch_updated_at();

-- Public view used by the frontend
create or replace view public.listings_view as
select
    id,
    autovit_id,
    slug,
    status,
    title,
    subtitle,
    price_value,
    price_currency,
    price_old_value,
    price_negotiable,
    price_labels,
    mileage_km,
    year,
    engine_capacity_cc,
    engine_power_hp,
    fuel_type,
    gearbox,
    transmission,
    body_type,
    color,
    emission_class,
    co2_emissions,
    consumption,
    vin,
    first_registration,
    technical_inspection,
    last_service,
    main_features,
    badges,
    highlight_tags,
    images,
    main_image,
    location_label,
    description,
    details,
    feature_groups,
    technical_specs,
    seller,
    financing_options,
    created_at,
    updated_at
from public.autovit_listings
where coalesce(status, 'ACTIVE') = 'ACTIVE';

alter view public.listings_view set (security_invoker = true);

-- RLS configuration
alter table public.autovit_listings enable row level security;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users on delete cascade,
  role text not null default 'admin',
  created_at timestamptz not null default timezone('utc'::text, now())
);

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.admin_users au where au.user_id = uid
  );
$$;

do
$$
begin
  if not exists (
    select 1 from pg_policies where policyname = 'allow_public_select_autovit_listings'
  ) then
    create policy allow_public_select_autovit_listings
      on public.autovit_listings
      for select
      using (true);
  end if;

  if not exists (
    select 1 from pg_policies where policyname = 'allow_admin_manage_autovit_listings'
  ) then
    create policy allow_admin_manage_autovit_listings
      on public.autovit_listings
      for all
      to authenticated
      using (public.is_admin(auth.uid()))
      with check (public.is_admin(auth.uid()));
  end if;

  if not exists (
    select 1 from pg_policies where policyname = 'allow_service_role_write_autovit_listings'
  ) then
    create policy allow_service_role_write_autovit_listings
      on public.autovit_listings
      for all
      to service_role
      using (true)
      with check (true);
  end if;
end;
$$;

-- Helpful indexes
create index if not exists autovit_listings_autovit_id_idx on public.autovit_listings (autovit_id);
create index if not exists autovit_listings_created_at_idx on public.autovit_listings (created_at desc);
create index if not exists autovit_listings_price_idx on public.autovit_listings (price_value);
create index if not exists autovit_listings_status_idx on public.autovit_listings (status);
create index if not exists autovit_listings_year_idx on public.autovit_listings (year);
create index if not exists autovit_listings_payload_gin_idx on public.autovit_listings using gin (payload);
