export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ExpenseCategory =
  | "School & Education"
  | "Medical Aid / Doctor"
  | "Rent / Child Room"
  | "Fuel / Transport"
  | "Extramural / Sports"
  | "Clothing & Essentials"
  | "Nutrition & Hygiene"
  | "Other";

export type ExpenseStatus =
  | "draft"
  | "pending"
  | "reimbursed"
  | "contested"
  | "partially_settled";

export interface Profile {
  id: string;
  full_name: string;
  role: "mother" | "co_parent" | "legal_counsel";
  email: string | null;
  phone: string | null;
  default_currency: string;
  court_case_number: string | null;
  court_jurisdiction: string | null;
  created_at: string;
  updated_at: string;
}

export interface Child {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string | null;
  date_of_birth: string | null;
  age_display: string;
  school_name: string | null;
  medical_aid_number: string | null;
  avatar_url: string | null;
  default_split_ratio: number;
  notes: string | null;
  created_at: string;
}

export interface SettlementAgreement {
  id: string;
  user_id: string;
  case_number: string | null;
  court_order_date: string | null;
  co_parent_full_name: string;
  co_parent_email: string | null;
  co_parent_phone: string | null;
  category_split_rules: Record<string, number>;
  payment_due_day: number;
  is_active: boolean;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  child_id: string | null;
  child_name?: string;
  vendor: string;
  description: string | null;
  category: ExpenseCategory;
  subcategory: string | null;
  expense_date: string;
  
  gross_slip_amount: number;
  medical_aid_covered: number;
  net_claimable_amount: number;
  co_parent_percentage: number;
  co_parent_share_amount: number;
  
  receipt_image_url: string | null;
  receipt_sha256_hash: string | null;
  receipt_id_tag: string | null;
  exhibit_label: string | null;
  legal_court_notes: string | null;
  
  status: ExpenseStatus;
  ocr_score: number | null;
  ocr_raw_text: string | null;
  is_recurring: boolean;
  recurring_period: "monthly" | "termly" | "annual" | null;
  
  created_at: string;
  updated_at: string;
}

export interface ReceiptLineItem {
  id: string;
  expense_id: string;
  child_id: string | null;
  item_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  is_included: boolean;
  exclusion_reason?: string | null;
  child_allocation_ratio: number;
  child_portion_amount: number;
  child_name?: string;
  created_at: string;
}

export interface CourtBundle {
  id: string;
  user_id: string;
  bundle_title: string;
  preset_type: "form_4a" | "rule_43" | "arrears_statement" | "full_ledger";
  period_start: string;
  period_end: string;
  total_expenses_tracked: number;
  total_coparent_share: number;
  total_settled: number;
  total_arrears: number;
  verified_slip_count: number;
  cryptographic_bundle_hash: string;
  pdf_storage_path: string | null;
  certified_timestamp: string;
  notes: string | null;
}
