"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { SettlementAgreement } from "@/types/database.types";
import { MOCK_AGREEMENT } from "@/lib/data/mockData";
import { revalidatePath } from "next/cache";

export async function getAgreementAction(): Promise<SettlementAgreement> {
  if (!isSupabaseConfigured()) {
    return MOCK_AGREEMENT;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase.from("settlement_agreements").select("*").limit(1);
    if (user?.id) {
      query = query.eq("user_id", user.id);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return MOCK_AGREEMENT;
    }
    return data[0] as SettlementAgreement;
  } catch {
    return MOCK_AGREEMENT;
  }
}

export async function saveAgreementAction(payload: Partial<SettlementAgreement>): Promise<{
  success: boolean;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    revalidatePath("/children");
    return { success: true };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || "user-mother-01";

    const { error } = await supabase
      .from("settlement_agreements")
      .upsert({
        id: payload.id || undefined,
        user_id: userId,
        case_number: payload.case_number || null,
        court_order_date: payload.court_order_date || null,
        co_parent_full_name: payload.co_parent_full_name || "Mark Jenkins",
        co_parent_email: payload.co_parent_email || null,
        co_parent_phone: payload.co_parent_phone || null,
        category_split_rules: payload.category_split_rules || {},
        payment_due_day: payload.payment_due_day || 1,
        is_active: true,
      });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/children");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save agreement" };
  }
}
