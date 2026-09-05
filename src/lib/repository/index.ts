import { IDataRepository } from "./types";
import { localRepository, LocalRepository } from "./localRepository";
import { supabaseRepository, SupabaseRepository } from "./supabaseRepository";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export * from "./types";
export { LocalRepository, localRepository } from "./localRepository";
export { SupabaseRepository, supabaseRepository } from "./supabaseRepository";

let repoInstance: IDataRepository | null = null;

export function getRepository(): IDataRepository {
  if (repoInstance) return repoInstance;

  if (isSupabaseConfigured()) {
    repoInstance = supabaseRepository;
  } else {
    repoInstance = localRepository;
  }

  return repoInstance;
}

// Helper to reset repository instance (useful for testing)
export function setRepositoryInstance(repo: IDataRepository | null): void {
  repoInstance = repo;
}
