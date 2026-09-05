import {
  Profile,
  Child,
  SettlementAgreement,
  Expense,
  ReceiptLineItem,
  CourtBundle,
  IDataRepository,
} from "./types";
import { getSupabaseClient } from "@/lib/supabase/client";
import {
  MOCK_PROFILE,
  MOCK_CHILDREN,
  MOCK_AGREEMENT,
  MOCK_EXPENSES,
  MOCK_SLIP_ITEMS,
  MOCK_COURT_BUNDLE,
} from "@/lib/data/mockData";

export class SupabaseRepository implements IDataRepository {
  private async getActiveUserId(): Promise<string> {
    try {
      const supabase = getSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) return user.id;
    } catch {
      // ignore
    }
    return MOCK_PROFILE.id;
  }

  // Profile methods
  async getProfile(): Promise<Profile> {
    const supabase = getSupabaseClient();
    const userId = await this.getActiveUserId();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (data && !error) return data as Profile;

    const { data: firstProfile } = await supabase
      .from("profiles")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (firstProfile) return firstProfile as Profile;
    return MOCK_PROFILE;
  }

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    const supabase = getSupabaseClient();
    const current = await this.getProfile();
    const updated: Profile = {
      ...current,
      ...data,
      updated_at: new Date().toISOString(),
    };

    const { data: result, error } = await supabase
      .from("profiles")
      .upsert(updated)
      .select()
      .single();

    if (error || !result) {
      throw error || new Error("Failed to update profile in Supabase");
    }
    return result as Profile;
  }

  // Children methods
  async getChildren(): Promise<Child[]> {
    const supabase = getSupabaseClient();
    const userId = await this.getActiveUserId();

    const { data, error } = await supabase
      .from("children")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error || !data) return [];
    return data as Child[];
  }

  async addChild(child: Omit<Child, "id" | "created_at">): Promise<Child> {
    const supabase = getSupabaseClient();
    const userId = await this.getActiveUserId();

    const payload = {
      ...child,
      user_id: child.user_id || userId,
    };

    const { data, error } = await supabase
      .from("children")
      .insert(payload)
      .select()
      .single();

    if (error || !data) {
      throw error || new Error("Failed to add child to Supabase");
    }
    return data as Child;
  }

  async deleteChild(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("children").delete().eq("id", id);
    return !error;
  }

  // Settlement Agreement methods
  async getAgreement(): Promise<SettlementAgreement> {
    const supabase = getSupabaseClient();
    const userId = await this.getActiveUserId();

    const { data, error } = await supabase
      .from("settlement_agreements")
      .select("*")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    if (data && !error) return data as SettlementAgreement;
    return MOCK_AGREEMENT;
  }

  async saveAgreement(agreement: Partial<SettlementAgreement>): Promise<SettlementAgreement> {
    const supabase = getSupabaseClient();
    const current = await this.getAgreement();
    const updated: SettlementAgreement = {
      ...current,
      ...agreement,
    };

    const { data, error } = await supabase
      .from("settlement_agreements")
      .upsert(updated)
      .select()
      .single();

    if (error || !data) {
      throw error || new Error("Failed to save agreement in Supabase");
    }
    return data as SettlementAgreement;
  }

  // Expenses methods
  async getExpenses(childId?: string, category?: string): Promise<Expense[]> {
    const supabase = getSupabaseClient();
    const userId = await this.getActiveUserId();

    let query = supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("expense_date", { ascending: false });

    if (childId) {
      query = query.eq("child_id", childId);
    }
    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as Expense[];
  }

  async createExpense(
    expense: Omit<Expense, "id" | "created_at" | "updated_at">,
    lineItems?: Omit<ReceiptLineItem, "id" | "expense_id" | "created_at">[]
  ): Promise<Expense> {
    const supabase = getSupabaseClient();
    const userId = await this.getActiveUserId();

    const payload = {
      ...expense,
      user_id: expense.user_id || userId,
    };

    const { data, error } = await supabase
      .from("expenses")
      .insert(payload)
      .select()
      .single();

    if (error || !data) {
      throw error || new Error("Failed to create expense in Supabase");
    }
    const createdExpense = data as Expense;

    if (lineItems && lineItems.length > 0) {
      const linePayloads = lineItems.map((item) => ({
        ...item,
        expense_id: createdExpense.id,
      }));
      await supabase.from("receipt_line_items").insert(linePayloads);
    }

    return createdExpense;
  }

  async updateExpenseStatus(id: string, status: Expense["status"]): Promise<Expense> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("expenses")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      throw error || new Error(`Failed to update expense status in Supabase for ${id}`);
    }
    return data as Expense;
  }

  async deleteExpense(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    return !error;
  }

  // Line items
  async getLineItems(expenseId: string): Promise<ReceiptLineItem[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("receipt_line_items")
      .select("*")
      .eq("expense_id", expenseId);

    if (error || !data) return [];
    return data as ReceiptLineItem[];
  }

  // Court bundles
  async getCourtBundle(period: string, preset: string): Promise<CourtBundle> {
    const supabase = getSupabaseClient();
    const userId = await this.getActiveUserId();

    const { data, error } = await supabase
      .from("court_bundles")
      .select("*")
      .eq("user_id", userId)
      .eq("preset_type", preset)
      .order("certified_timestamp", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data && !error) return data as CourtBundle;

    // Dynamically calculate from live expenses
    const expenses = await this.getExpenses();
    const profile = await this.getProfile();
    const totalTracked = expenses.reduce((sum, e) => sum + (e.net_claimable_amount || 0), 0);
    const totalCoParent = expenses.reduce((sum, e) => sum + (e.co_parent_share_amount || 0), 0);
    const totalSettled = expenses
      .filter((e) => e.status === "reimbursed")
      .reduce((sum, e) => sum + (e.co_parent_share_amount || 0), 0);
    const arrears = Math.max(0, totalCoParent - totalSettled);

    const validPreset = (
      ["form_4a", "rule_43", "arrears_statement", "full_ledger"].includes(preset)
        ? preset
        : "form_4a"
    ) as CourtBundle["preset_type"];

    const bundle: CourtBundle = {
      id: `bundle-${Date.now()}`,
      user_id: profile.id,
      bundle_title: `${preset.toUpperCase()} Maintenance Exhibit Bundle (${period || "Current"})`,
      preset_type: validPreset,
      period_start: new Date().toISOString().slice(0, 10),
      period_end: new Date().toISOString().slice(0, 10),
      total_expenses_tracked: totalTracked,
      total_coparent_share: totalCoParent,
      total_settled: totalSettled,
      total_arrears: arrears,
      verified_slip_count: expenses.length,
      cryptographic_bundle_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      pdf_storage_path: null,
      certified_timestamp: new Date().toISOString(),
      notes: "Generated via Slipstats Supabase persistence layer.",
    };

    return bundle;
  }

  // Demo mode controls
  isDemoMode(): boolean {
    return false;
  }

  async setDemoMode(_enabled: boolean): Promise<void> {
    // Supabase repository is live, demo mode is a local-only feature
  }

  async resetToSeedData(): Promise<void> {
    const supabase = getSupabaseClient();
    const userId = await this.getActiveUserId();

    // Insert mock children if not present
    for (const child of MOCK_CHILDREN) {
      await supabase.from("children").upsert({ ...child, user_id: userId });
    }
    // Insert mock expenses if not present
    for (const exp of MOCK_EXPENSES) {
      await supabase.from("expenses").upsert({ ...exp, user_id: userId });
    }
  }

  async clearToCleanSlate(): Promise<void> {
    const supabase = getSupabaseClient();
    const userId = await this.getActiveUserId();
    await supabase.from("expenses").delete().eq("user_id", userId);
    await supabase.from("children").delete().eq("user_id", userId);
  }
}

export const supabaseRepository = new SupabaseRepository();
