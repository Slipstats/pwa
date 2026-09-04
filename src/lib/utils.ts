import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "ZAR"): string {
  const prefix = currency === "ZAR" ? "R" : "$";
  const formatted = new Intl.NumberFormat("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${prefix}${formatted}`;
}

export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Calculates an immutable SHA-256 cryptographic hash using the browser's native Web Crypto API.
 * 100% free, zero external API fees, runs entirely locally on-device in ~2 milliseconds.
 */
export async function generateSHA256Hash(data: File | Blob | string): Promise<string> {
  let buffer: BufferSource;

  if (typeof data === "string") {
    buffer = new TextEncoder().encode(data);
  } else {
    buffer = await data.arrayBuffer();
  }

  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

