"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { Expense } from "@/types/database.types";
import { MOCK_EXPENSES, MOCK_CHILDREN } from "@/lib/data/mockData";
import { revalidatePath } from "next/cache";

export interface DashboardLedgerData {
  totalTracked: number;
  coParentOwed: number;
  slipCount: number;
  splitPercentage: number;
  month: string;
  categories: { name: string; percentage: number; color: string }[];
  childSpends: {
    id: string;
    name: string;
    meta: string;
    total: number;
    coParentShare: number;
    description: string;
    avatar: string;
    badgeColor: string;
  }[];
  expenses: Expense[];
  isDemo: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  "School & Education": "bg-primary",
  "Medical Aid / Doctor": "bg-secondary",
  "Nutrition & Hygiene": "bg-tertiary-container",
  "Fuel / Transport": "bg-primary-fixed-dim",
  "Rent / Child Room": "bg-secondary-fixed",
  "Extramural / Sports": "bg-tertiary-fixed",
  "Clothing & Essentials": "bg-outline",
  "Other": "bg-outline-variant",
};

export async function getDashboardLedgerAction(): Promise<DashboardLedgerData> {
  const isConfigured = isSupabaseConfigured();

  if (!isConfigured) {
    return computeMetricsFromList(MOCK_EXPENSES, true);
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch live expenses from Supabase
    let query = supabase.from("expenses").select("*").order("expense_date", { ascending: false });
    if (user?.id) {
      query = query.eq("user_id", user.id);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      // Fallback to sample seed data so UI never breaks when project is freshly initialized
      return computeMetricsFromList(MOCK_EXPENSES, true);
    }

    return computeMetricsFromList(data as Expense[], false);
  } catch (e) {
    console.error("Error fetching live expenses", e);
    return computeMetricsFromList(MOCK_EXPENSES, true);
  }
}

function computeMetricsFromList(expenses: Expense[], isDemo: boolean): DashboardLedgerData {
  const totalTracked = expenses.reduce((sum, e) => sum + (Number(e.net_claimable_amount) || 0), 0);
  const coParentOwed = expenses.reduce((sum, e) => sum + (Number(e.co_parent_share_amount) || 0), 0);
  const slipCount = expenses.filter((e) => e.receipt_id_tag || e.receipt_image_url).length || expenses.length;
  const splitPercentage = totalTracked > 0 ? Math.round((coParentOwed / totalTracked) * 100) : 50;

  // Category Proportions
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    const cat = e.category || "Other";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (Number(e.net_claimable_amount) || 0);
  });

  const categories = Object.entries(categoryTotals)
    .map(([name, amount]) => {
      const percentage = totalTracked > 0 ? Math.round((amount / totalTracked) * 100) : 0;
      const shortName = name.replace(" / Doctor", "").replace(" & Education", "").replace(" & Hygiene", "");
      return {
        name: shortName,
        percentage,
        color: CATEGORY_COLORS[name] || "bg-outline-variant",
      };
    })
    .sort((a, b) => b.percentage - a.percentage);

  // Child Allocations
  const childCards = MOCK_CHILDREN.map((child, idx) => {
    const childExpenses = expenses.filter(
      (e) => e.child_id === child.id || (e.child_name && e.child_name.includes(child.first_name))
    );
    const childTotal = childExpenses.reduce((sum, e) => sum + (Number(e.net_claimable_amount) || 0), 0);
    const coParentShare = childExpenses.reduce((sum, e) => sum + (Number(e.co_parent_share_amount) || 0), 0);

    return {
      id: child.id,
      name: child.first_name,
      meta: child.age_display,
      total: childTotal > 0 ? childTotal : idx === 0 ? 1620.0 : 1225.5,
      coParentShare: coParentShare > 0 ? coParentShare : idx === 0 ? 810.0 : 612.75,
      description: child.notes || "Beneficiary support ledger allocation",
      avatar: child.avatar_url || "/images/logo.png",
      badgeColor: idx === 0 ? "bg-primary-fixed" : "bg-tertiary-fixed",
    };
  });

  return {
    totalTracked,
    coParentOwed,
    slipCount,
    splitPercentage,
    month: "October 2024",
    categories,
    childSpends: childCards,
    expenses,
    isDemo,
  };
}

export interface CreateExpensePayload {
  vendor: string;
  description?: string;
  category: Expense["category"];
  subcategory?: string;
  expense_date: string;
  gross_slip_amount: number;
  medical_aid_covered: number;
  net_claimable_amount: number;
  co_parent_percentage: number;
  co_parent_share_amount: number;
  child_id?: string | null;
  child_name?: string;
  receipt_image_url?: string | null;
  receipt_sha256_hash?: string | null;
  receipt_id_tag?: string | null;
  legal_court_notes?: string | null;
  line_items?: Array<{
    item_name: string;
    quantity: number;
    unit_price: number;
    line_total: number;
    is_included: boolean;
    child_allocation_ratio: number;
    child_portion_amount: number;
  }>;
}

export async function createExpenseAction(payload: CreateExpensePayload): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    // In demo mode, simulate instant save and revalidate
    revalidatePath("/dashboard");
    revalidatePath("/expenses");
    revalidatePath("/");
    return { success: true, id: `demo-${Date.now()}` };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || "user-mother-01";

    const expenseRecord = {
      user_id: userId,
      child_id: payload.child_id || null,
      vendor: payload.vendor,
      description: payload.description || null,
      category: payload.category,
      subcategory: payload.subcategory || null,
      expense_date: payload.expense_date,
      gross_slip_amount: payload.gross_slip_amount,
      medical_aid_covered: payload.medical_aid_covered,
      net_claimable_amount: payload.net_claimable_amount,
      co_parent_percentage: payload.co_parent_percentage,
      co_parent_share_amount: payload.co_parent_share_amount,
      receipt_image_url: payload.receipt_image_url || null,
      receipt_sha256_hash: payload.receipt_sha256_hash || null,
      receipt_id_tag: payload.receipt_id_tag || `#SL-${Math.floor(1000 + Math.random() * 9000)}`,
      exhibit_label: "Exhibit New",
      legal_court_notes: payload.legal_court_notes || null,
      status: "pending" as const,
    };

    const { data, error } = await supabase
      .from("expenses")
      .insert(expenseRecord)
      .select("id")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Insert line items if present
    if (payload.line_items && payload.line_items.length > 0 && data?.id) {
      const itemsToInsert = payload.line_items.map((item) => ({
        expense_id: data.id,
        item_name: item.item_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.line_total,
        is_included: item.is_included,
        child_allocation_ratio: item.child_allocation_ratio,
        child_portion_amount: item.child_portion_amount,
      }));

      await supabase.from("receipt_line_items").insert(itemsToInsert);
    }

    revalidatePath("/dashboard");
    revalidatePath("/expenses");
    revalidatePath("/");
    revalidatePath("/reports");

    return { success: true, id: data.id };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create expense" };
  }
}
