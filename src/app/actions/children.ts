"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { Child } from "@/types/database.types";
import { MOCK_CHILDREN } from "@/lib/data/mockData";
import { revalidatePath } from "next/cache";

export async function getChildrenAction(): Promise<Child[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_CHILDREN;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase.from("children").select("*").order("created_at", { ascending: true });
    if (user?.id) {
      query = query.eq("user_id", user.id);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return MOCK_CHILDREN;
    }
    return data as Child[];
  } catch (e) {
    console.error("Error fetching children", e);
    return MOCK_CHILDREN;
  }
}

export interface AddChildPayload {
  first_name: string;
  last_name?: string;
  date_of_birth?: string;
  age_display: string;
  school_name?: string;
  medical_aid_number?: string;
  default_split_ratio: number;
  notes?: string;
}

export async function addChildAction(payload: AddChildPayload): Promise<{
  success: boolean;
  child?: Child;
  error?: string;
}> {
  if (!isSupabaseConfigured()) {
    const newChild: Child = {
      id: `child-${Date.now()}`,
      user_id: "user-mother-01",
      first_name: payload.first_name,
      last_name: payload.last_name || null,
      date_of_birth: payload.date_of_birth || null,
      age_display: payload.age_display,
      school_name: payload.school_name || null,
      medical_aid_number: payload.medical_aid_number || null,
      avatar_url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDV4Z1uMBbUw8xJc-Gnuy9IP1DrvyQRRLkN43RMhpnp6M7iIpg6UvYMzc-0sQ6albpPdQYsGpGrKJydKbd1bcv_eOmyhWc1221BvrlOAMhhxWyuYyF51Gndbnmzmv2Xu8V-h8N4kkKLse95GST3V0hK_yBHbS9NubuB9XdnIWtx1ncd_yB6oaIXXQ5vufSxekKEPwY26Agh50vJuyO5fdOHQ0KhtJAGKossL-pgfobaUTxJ-ia7hOhNxw",
      default_split_ratio: payload.default_split_ratio,
      notes: payload.notes || null,
      created_at: new Date().toISOString(),
    };
    revalidatePath("/children");
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true, child: newChild };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id || "user-mother-01";

    const { data, error } = await supabase
      .from("children")
      .insert({
        user_id: userId,
        first_name: payload.first_name,
        last_name: payload.last_name || null,
        date_of_birth: payload.date_of_birth || null,
        age_display: payload.age_display,
        school_name: payload.school_name || null,
        medical_aid_number: payload.medical_aid_number || null,
        default_split_ratio: payload.default_split_ratio,
        notes: payload.notes || null,
      })
      .select("*")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/children");
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true, child: data as Child };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to add child" };
  }
}
