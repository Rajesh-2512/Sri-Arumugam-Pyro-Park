create table if not exists public.walk_in_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(12, 2) not null default 0 check (price >= 0),
  category_id uuid references public.categories(id) on delete set null,
  image_url jsonb,
  stock integer not null default 0 check (stock >= 0),
  discount numeric(5, 2) not null default 0 check (discount >= 0 and discount <= 100),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.walk_in_products add column if not exists category_id uuid references public.categories(id) on delete set null;
alter table public.walk_in_products add column if not exists image_url jsonb;
alter table public.walk_in_products add column if not exists discount numeric(5, 2) not null default 0 check (discount >= 0 and discount <= 100);

alter table public.walk_in_products enable row level security;

revoke all on public.walk_in_products from anon, authenticated;

drop policy if exists "Admins can manage walk-in products" on public.walk_in_products;

-- POS reads and writes use the server-side service-role client.
-- Do not add an anon policy: walk-in prices are private counter pricing.

grant all on public.walk_in_products to service_role;

create index if not exists walk_in_products_active_name_idx
  on public.walk_in_products (is_active, name);
