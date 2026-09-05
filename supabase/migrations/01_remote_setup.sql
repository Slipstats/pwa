-- ==============================================================================
-- SLIPSTATS: REMOTE SUPABASE MASTER MIGRATION SCRIPT
-- Copy & Paste into the Supabase SQL Editor of your Remote Project
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. User Profiles & Court Jurisdiction Settings
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null default 'mother' check (role in ('mother', 'co_parent', 'legal_counsel')),
  email text,
  phone text,
  default_currency text not null default 'ZAR',
  court_case_number text,
  court_jurisdiction text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Children / Beneficiaries
create table if not exists public.children (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  first_name text not null,
  last_name text,
  date_of_birth date,
  age_display text,
  school_name text,
  medical_aid_number text,
  avatar_url text,
  default_split_ratio numeric(5,2) not null default 50.00,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Maintenance Settlement Agreements & Category Split Rules
create table if not exists public.settlement_agreements (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  case_number text,
  court_order_date date,
  co_parent_full_name text not null,
  co_parent_email text,
  co_parent_phone text,
  category_split_rules jsonb default '{"medical": 50, "education": 50, "extramural": 50, "hygiene": 50, "transport": 50}'::jsonb not null,
  payment_due_day integer default 1 check (payment_due_day between 1 and 31),
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Master Expenses & Slips Ledger
create table if not exists public.expenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  child_id uuid references public.children(id) on delete set null,
  
  vendor text not null,
  description text,
  category text not null check (category in (
    'School & Education',
    'Medical Aid / Doctor',
    'Rent / Child Room',
    'Fuel / Transport',
    'Extramural / Sports',
    'Clothing & Essentials',
    'Nutrition & Hygiene',
    'Other'
  )),
  subcategory text,
  expense_date date not null default current_date,
  
  gross_slip_amount numeric(12,2) not null check (gross_slip_amount >= 0),
  medical_aid_covered numeric(12,2) default 0.00 check (medical_aid_covered >= 0),
  net_claimable_amount numeric(12,2) not null check (net_claimable_amount >= 0),
  co_parent_percentage numeric(5,2) not null default 50.00 check (co_parent_percentage between 0 and 100),
  co_parent_share_amount numeric(12,2) not null check (co_parent_share_amount >= 0),
  
  receipt_image_url text,
  receipt_sha256_hash text,
  receipt_id_tag text,
  exhibit_label text,
  legal_court_notes text,
  
  status text not null default 'pending' check (status in (
    'draft',
    'pending',
    'reimbursed',
    'contested',
    'partially_settled'
  )),
  ocr_score numeric(5,2),
  ocr_raw_text text,
  is_recurring boolean not null default false,
  recurring_period text check (recurring_period in ('monthly', 'termly', 'annual')),
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Itemized Slip Line Items
create table if not exists public.receipt_line_items (
  id uuid primary key default uuid_generate_v4(),
  expense_id uuid not null references public.expenses(id) on delete cascade,
  child_id uuid references public.children(id) on delete set null,
  
  item_name text not null,
  quantity numeric(8,2) default 1.00 not null,
  unit_price numeric(12,2),
  line_total numeric(12,2) not null,
  
  is_included boolean not null default true,
  exclusion_reason text,
  child_allocation_ratio numeric(5,2) not null default 1.00,
  child_portion_amount numeric(12,2) not null,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Court Bundles
create table if not exists public.court_bundles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  
  bundle_title text not null,
  preset_type text not null check (preset_type in ('form_4a', 'rule_43', 'arrears_statement', 'full_ledger')),
  period_start date not null,
  period_end date not null,
  
  total_expenses_tracked numeric(12,2) not null,
  total_coparent_share numeric(12,2) not null,
  total_settled numeric(12,2) default 0.00 not null,
  total_arrears numeric(12,2) not null,
  
  verified_slip_count integer not null default 0,
  cryptographic_bundle_hash text not null,
  pdf_storage_path text,
  certified_timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  notes text
);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    full_name,
    email,
    role,
    court_case_number,
    court_jurisdiction,
    default_currency
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Mother'),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'mother'),
    new.raw_user_meta_data->>'court_case_number',
    new.raw_user_meta_data->>'court_jurisdiction',
    'ZAR'
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.children enable row level security;
alter table public.settlement_agreements enable row level security;
alter table public.expenses enable row level security;
alter table public.receipt_line_items enable row level security;
alter table public.court_bundles enable row level security;

-- Profiles Policy
drop policy if exists "Users can view and edit own profile" on public.profiles;
create policy "Users can view and edit own profile"
  on public.profiles for all
  using (auth.uid() = id);

-- Children Policy
drop policy if exists "Users can manage own children records" on public.children;
create policy "Users can manage own children records"
  on public.children for all
  using (auth.uid() = user_id);

-- Agreements Policy
drop policy if exists "Users can manage own settlement agreements" on public.settlement_agreements;
create policy "Users can manage own settlement agreements"
  on public.settlement_agreements for all
  using (auth.uid() = user_id);

-- Expenses Policy
drop policy if exists "Users can manage own expenses" on public.expenses;
create policy "Users can manage own expenses"
  on public.expenses for all
  using (auth.uid() = user_id);

-- Line Items Policy
drop policy if exists "Users can manage own receipt line items" on public.receipt_line_items;
create policy "Users can manage own receipt line items"
  on public.receipt_line_items for all
  using (
    exists (
      select 1 from public.expenses
      where expenses.id = receipt_line_items.expense_id
      and expenses.user_id = auth.uid()
    )
  );

-- Court Bundles Policy
drop policy if exists "Users can manage own court bundles" on public.court_bundles;
create policy "Users can manage own court bundles"
  on public.court_bundles for all
  using (auth.uid() = user_id);

-- ==============================================================================
-- INDEXES
-- ==============================================================================

create index if not exists idx_expenses_user_date on public.expenses(user_id, expense_date desc);
create index if not exists idx_expenses_category on public.expenses(category);
create index if not exists idx_expenses_status on public.expenses(status);
create index if not exists idx_line_items_expense on public.receipt_line_items(expense_id);
create index if not exists idx_children_user on public.children(user_id);

-- ==============================================================================
-- STORAGE BUCKET CONFIGURATION FOR RECEIPTS
-- ==============================================================================

insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', true)
on conflict (id) do nothing;

drop policy if exists "Authenticated users can upload receipts" on storage.objects;
create policy "Authenticated users can upload receipts"
  on storage.objects for insert
  with check (bucket_id = 'receipts' and auth.role() = 'authenticated');

drop policy if exists "Anyone can view receipt photos" on storage.objects;
create policy "Anyone can view receipt photos"
  on storage.objects for select
  using (bucket_id = 'receipts');
