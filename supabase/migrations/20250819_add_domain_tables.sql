begin;

create table if not exists public.integration_configs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id),
  service text not null,
  category text,
  auth_type text,
  credentials text,
  config jsonb,
  status text,
  last_sync timestamptz,
  sync_frequency interval,
  error_log jsonb,
  created_at timestamptz default now()
);

create table if not exists public.fashion_inventory (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id),
  sku text not null,
  product_name text,
  category text,
  size text,
  color text,
  current_stock integer,
  reserved_stock integer,
  reorder_point integer,
  lead_time_days integer,
  cost numeric(10,2),
  retail_price numeric(10,2),
  location jsonb,
  updated_at timestamptz default now()
);

create table if not exists public.fashion_orders (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id),
  order_number text unique,
  customer_id text,
  channel text,
  items jsonb,
  subtotal numeric(10,2),
  tax numeric(10,2),
  shipping numeric(10,2),
  total numeric(10,2),
  status text,
  created_at timestamptz,
  fulfilled_at timestamptz
);

create table if not exists public.creative_content (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id),
  content_type text,
  title text not null,
  release_date date,
  platforms jsonb,
  metadata jsonb,
  rights jsonb,
  created_at timestamptz default now()
);

create table if not exists public.creative_analytics (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references public.creative_content(id),
  platform text,
  date date,
  plays bigint,
  likes integer,
  shares integer,
  comments integer,
  revenue numeric(10,2),
  demographics jsonb,
  created_at timestamptz default now()
);

create table if not exists public.tours_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id),
  event_type text,
  name text,
  venue jsonb,
  date timestamptz,
  capacity integer,
  tickets_sold integer,
  gross_revenue numeric(10,2),
  expenses jsonb,
  status text,
  created_at timestamptz default now()
);

create table if not exists public.workflow_automations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id),
  name text,
  trigger_type text,
  trigger_config jsonb,
  actions jsonb,
  enabled boolean default true,
  last_run timestamptz,
  created_at timestamptz default now()
);

alter table public.integration_configs enable row level security;
alter table public.fashion_inventory enable row level security;
alter table public.fashion_orders enable row level security;
alter table public.creative_content enable row level security;
alter table public.creative_analytics enable row level security;
alter table public.tours_events enable row level security;
alter table public.workflow_automations enable row level security;

commit;
