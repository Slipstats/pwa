"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { Profile } from "@/types/database.types";
import { MOCK_PROFILE } from "@/lib/data/mockData";
import { revalidatePath } from "next/cache";

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email?: string;
    full_name?: string;
  };
  isDemo?: boolean;
}

export async function loginAction(formData: FormData): Promise<AuthResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required" };
  }

  // Fallback demo mode if Supabase keys are not set up yet
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      isDemo: true,
      user: {
        id: MOCK_PROFILE.id,
        email: email || MOCK_PROFILE.email || "demo@slipstats.app",
        full_name: MOCK_PROFILE.full_name,
      },
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/", "layout");
    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to sign in" };
  }
}

export async function signupAction(formData: FormData): Promise<AuthResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const role = (formData.get("role") as string) || "mother";
  const courtCaseNumber = formData.get("courtCaseNumber") as string;
  const courtJurisdiction = formData.get("courtJurisdiction") as string;

  if (!email || !password || !fullName) {
    return { success: false, error: "Full Name, Email, and Password are required." };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      isDemo: true,
      user: {
        id: "user-registered-demo",
        email,
        full_name: fullName,
      },
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          court_case_number: courtCaseNumber || null,
          court_jurisdiction: courtJurisdiction || null,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Insert or update profile directly in public.profiles table
    if (data.user?.id) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: fullName,
        role: role as any,
        email,
        court_case_number: courtCaseNumber || null,
        court_jurisdiction: courtJurisdiction || null,
        default_currency: "ZAR",
      });
    }

    revalidatePath("/", "layout");
    return {
      success: true,
      user: {
        id: data.user?.id || "",
        email: data.user?.email,
        full_name: fullName,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to register" };
  }
}

export async function logoutAction(): Promise<{ success: boolean }> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Sign out error", e);
    }
  }
  revalidatePath("/", "layout");
  return { success: true };
}

export async function getCurrentUserAction(): Promise<{
  user: { id: string; email?: string; full_name?: string } | null;
  profile: Profile | null;
  isConfigured: boolean;
}> {
  const isConfigured = isSupabaseConfigured();

  if (!isConfigured) {
    return {
      user: {
        id: MOCK_PROFILE.id,
        email: MOCK_PROFILE.email || undefined,
        full_name: MOCK_PROFILE.full_name,
      },
      profile: MOCK_PROFILE,
      isConfigured: false,
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { user: null, profile: null, isConfigured: true };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: profile?.full_name || user.user_metadata?.full_name || "Mother",
      },
      profile: profile || null,
      isConfigured: true,
    };
  } catch {
    return {
      user: null,
      profile: null,
      isConfigured: true,
    };
  }
}
