-- ==============================================================================
-- SLIPSTATS: COURT-GRADE CHILD EXPENSE TRACKER SCHEMA
-- Designed for Family Court Admissibility (Maintenance Act Form 4A & Rule 43)
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
  court_jurisdiction text, -- e.g. "Randburg Magistrate Court - Family Division"
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
  age_display text, -- e.g. "Age 7 • Grade 2"
  school_name text,
  medical_aid_number text,
  avatar_url text,
  default_split_ratio numeric(5,2) not null default 50.00, -- Default 50% co-parent share
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
  -- JSONB split ratios per category matching court order clauses:
  -- e.g. {"medical": 60, "schooling": 50, "extramural": 50, "housing": 0}
  category_split_rules jsonb default '{"medical": 50, "education": 50, "extramural": 50, "hygiene": 50, "transport": 50}'::jsonb not null,
  payment_due_day integer default 1 check (payment_due_day between 1 and 31),
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Master Expenses & Slips Ledger
create table if not exists public.expenses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  child_id uuid references public.children(id) on delete set null, -- Nullable if split across multiple children
  
  -- Basic Expense Metadata
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
  
  -- Financial Breakdown (Accounting for Medical Aid Gap)
  gross_slip_amount numeric(12,2) not null check (gross_slip_amount >= 0),
  medical_aid_covered numeric(12,2) default 0.00 check (medical_aid_covered >= 0),
  net_claimable_amount numeric(12,2) not null check (net_claimable_amount >= 0),
  co_parent_percentage numeric(5,2) not null default 50.00 check (co_parent_percentage between 0 and 100),
  co_parent_share_amount numeric(12,2) not null check (co_parent_share_amount >= 0),
  
  -- Legal Court Exhibit Proofs & Hashes
  receipt_image_url text,
  receipt_sha256_hash text, -- Cryptographic integrity hash for court admissibility
  receipt_id_tag text, -- e.g. "#SL-8841"
  exhibit_label text, -- e.g. "Exhibit A", "Exhibit 04"
  legal_court_notes text, -- e.g. "Section 6.2 adherence. Emergency prescription."
  
  -- Status & OCR Verification
  status text not null default 'pending' check (status in (
    'draft',
    'pending',
    'reimbursed',
    'contested',
    'partially_settled'
  )),
  ocr_score numeric(5,2), -- e.g. 99.40 (%)
  ocr_raw_text text,
  is_recurring boolean not null default false,
  recurring_period text check (recurring_period in ('monthly', 'termly', 'annual')),
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Itemized Slip Line Items (AI Extraction & Personal Exclusion)
create table if not exists public.receipt_line_items (
  id uuid primary key default uuid_generate_v4(),
  expense_id uuid not null references public.expenses(id) on delete cascade,
  child_id uuid references public.children(id) on delete set null,
  
  item_name text not null,
  quantity numeric(8,2) default 1.00 not null,
  unit_price numeric(12,2),
  line_total numeric(12,2) not null,
  
  -- Crucial for mothers: Exclude non-child personal grocery items
  is_included boolean not null default true,
  exclusion_reason text, -- e.g. "Personal non-qualifying beverage"
  
  -- Allocation ratio: 1.00 = 100% child, 0.50 = 50/50 shared, 0.70 = 70/30 household
  child_allocation_ratio numeric(5,2) not null default 1.00,
  child_portion_amount numeric(12,2) not null,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Court Bundles & Maintenance PDF Statements
create table if not exists public.court_bundles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  
  bundle_title text not null, -- e.g. "October 2024 Maintenance Court Exhibit Bundle"
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
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures each mother has exclusive, private access to her financial records
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.children enable row level security;
alter table public.settlement_agreements enable row level security;
alter table public.expenses enable row level security;
alter table public.receipt_line_items enable row level security;
alter table public.court_bundles enable row level security;

-- Profiles Policy
create policy "Users can view and edit own profile"
  on public.profiles for all
  using (auth.uid() = id);

-- Children Policy
create policy "Users can manage own children records"
  on public.children for all
  using (auth.uid() = user_id);

-- Agreements Policy
create policy "Users can manage own settlement agreements"
  on public.settlement_agreements for all
  using (auth.uid() = user_id);

-- Expenses Policy
create policy "Users can manage own expenses"
  on public.expenses for all
  using (auth.uid() = user_id);

-- Line Items Policy
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
create policy "Users can manage own court bundles"
  on public.court_bundles for all
  using (auth.uid() = user_id);

-- ==============================================================================
-- INDEXES FOR INSTANT FILTERING & FAST AUDITING
-- ==============================================================================

create index if not exists idx_expenses_user_date on public.expenses(user_id, expense_date desc);
create index if not exists idx_expenses_category on public.expenses(category);
create index if not exists idx_expenses_status on public.expenses(status);
create index if not exists idx_line_items_expense on public.receipt_line_items(expense_id);
create index if not exists idx_children_user on public.children(user_id);
