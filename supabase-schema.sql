-- supabase-schema.sql
-- Use este arquivo no SQL Editor do Supabase para criar as tabelas do app.

-- Habilita o tipo citext para usernames case-insensitive.
create extension if not exists citext;

create table if not exists gestor_users (
  id uuid primary key default gen_random_uuid(),
  username citext not null unique,
  shop_name text not null,
  password_hash text not null,
  email citext,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table gestor_users enable row level security;

create policy "Allow anon insert on gestor_users"
  on gestor_users
  for insert
  with check (auth.role() = 'anon');

create policy "Allow anon select on gestor_users"
  on gestor_users
  for select
  using (auth.role() = 'anon');

create table if not exists gestor_inventory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references gestor_users(id) on delete cascade,
  product text not null,
  details text,
  purchase_location text not null,
  size text,
  quantity integer not null default 0,
  total numeric(12,2) not null default 0,
  cost_price numeric(12,2) not null default 0,
  profit_margin numeric(5,2) not null default 0,
  selling_price numeric(12,2) not null default 0,
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gestor_clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references gestor_users(id) on delete cascade,
  name text not null,
  source text,
  type text not null check (type in ('pf', 'pj')),
  cpf text,
  cnpj text,
  razao text,
  phone text,
  address text,
  birthday date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gestor_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references gestor_users(id) on delete cascade,
  code text not null unique,
  date date,
  client_name text,
  product_name text,
  product_size text,
  batch text,
  batch_inventory_index integer,
  quantity integer not null default 0,
  discount numeric(12,2) not null default 0,
  freight numeric(12,2) not null default 0,
  fees numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  payment_condition text,
  signal_amount numeric(12,2) not null default 0,
  signal_date date,
  installments_qty integer,
  installment_value numeric(12,2),
  paid boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists gestor_investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references gestor_users(id) on delete cascade,
  amount numeric(12,2) not null default 0,
  description text,
  date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists gestor_agenda (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references gestor_users(id) on delete cascade,
  event_date date not null,
  note text,
  created_at timestamptz not null default now()
);

alter table gestor_inventory enable row level security;
create policy "Allow anon select on gestor_inventory" on gestor_inventory for select using (auth.role() = 'anon');
create policy "Allow anon insert on gestor_inventory" on gestor_inventory for insert with check (auth.role() = 'anon');
create policy "Allow anon update on gestor_inventory" on gestor_inventory for update with check (auth.role() = 'anon');
create policy "Allow anon delete on gestor_inventory" on gestor_inventory for delete using (auth.role() = 'anon');

alter table gestor_clients enable row level security;
create policy "Allow anon select on gestor_clients" on gestor_clients for select using (auth.role() = 'anon');
create policy "Allow anon insert on gestor_clients" on gestor_clients for insert with check (auth.role() = 'anon');
create policy "Allow anon update on gestor_clients" on gestor_clients for update with check (auth.role() = 'anon');
create policy "Allow anon delete on gestor_clients" on gestor_clients for delete using (auth.role() = 'anon');

alter table gestor_orders enable row level security;
create policy "Allow anon select on gestor_orders" on gestor_orders for select using (auth.role() = 'anon');
create policy "Allow anon insert on gestor_orders" on gestor_orders for insert with check (auth.role() = 'anon');
create policy "Allow anon update on gestor_orders" on gestor_orders for update with check (auth.role() = 'anon');
create policy "Allow anon delete on gestor_orders" on gestor_orders for delete using (auth.role() = 'anon');

alter table gestor_investments enable row level security;
create policy "Allow anon select on gestor_investments" on gestor_investments for select using (auth.role() = 'anon');
create policy "Allow anon insert on gestor_investments" on gestor_investments for insert with check (auth.role() = 'anon');
create policy "Allow anon update on gestor_investments" on gestor_investments for update with check (auth.role() = 'anon');
create policy "Allow anon delete on gestor_investments" on gestor_investments for delete using (auth.role() = 'anon');

alter table gestor_agenda enable row level security;
create policy "Allow anon select on gestor_agenda" on gestor_agenda for select using (auth.role() = 'anon');
create policy "Allow anon insert on gestor_agenda" on gestor_agenda for insert with check (auth.role() = 'anon');
create policy "Allow anon update on gestor_agenda" on gestor_agenda for update with check (auth.role() = 'anon');
create policy "Allow anon delete on gestor_agenda" on gestor_agenda for delete using (auth.role() = 'anon');

create index if not exists idx_gestor_inventory_user on gestor_inventory(user_id);
create index if not exists idx_gestor_clients_user on gestor_clients(user_id);
create index if not exists idx_gestor_orders_user on gestor_orders(user_id);
create index if not exists idx_gestor_orders_code on gestor_orders(code);
create index if not exists idx_gestor_investments_user on gestor_investments(user_id);
create index if not exists idx_gestor_agenda_user on gestor_agenda(user_id);
create index if not exists idx_gestor_agenda_date on gestor_agenda(event_date);

-- Pol�ticas b�sicas recomendadas:
-- 1) Ative Row Level Security (RLS) na tabela gestor_users e nas demais tabelas.
-- 2) Defina pol�ticas que permitam inserir e selecionar apenas quando o user_id correto estiver definido.
-- 3) Se voc� usar Supabase Auth, armazene o auth.uid no user_id e libere o acesso apenas para o usu�rio logado.
-- Exemplo m�nimo:
-- alter table gestor_users enable row level security;
-- create policy "Allow select for anon" on gestor_users for select using (true);
-- create policy "Allow insert for anon" on gestor_users for insert with check (true);

-- Observa��o:
-- Este schema assume um modelo customizado de usu�rios. Para maior seguran�a, prefira usar Supabase Auth e unir as tabelas de perfil a um user_id autenticado.
