/**
 * Core Forensic & Child Maintenance Financial Calculations
 * Slipstats PWA — South African Maintenance Act 99 of 1998 & Rule 43 Compliance
 *
 * Pure, side-effect-free calculation engine for:
 * 1. Medical Aid shortfall / gap calculations
 * 2. Statutory / settlement co-parent apportionment shares
 * 3. Itemized till slip forensic child allocation
 * 4. Receipt audit aggregation
 * 5. Maintenance arrears reconciliation
 */

export interface LineItemAuditInput {
  line_total: number;
  is_included: boolean;
  child_allocation_ratio?: number; // 1.0 (100% child), 0.7 (70% shared), 0.5 (50% shared)
}

export interface ReceiptAuditSummary {
  gross_slip_total: number;
  child_qualifying_total: number;
  excluded_personal_total: number;
  co_parent_share: number;
  included_count: number;
  excluded_count: number;
}

/**
 * Utility helper to round numbers safely to 2 decimal places, avoiding
 * IEEE-754 floating-point drift (e.g., 54.49000000000001 -> 54.49).
 */
export function roundToTwo(num: number): number {
  if (typeof num !== "number" || isNaN(num) || !isFinite(num)) return 0;
  const sign = num < 0 ? -1 : 1;
  const abs = Math.abs(num);
  return sign * (Math.round((abs + Number.EPSILON) * 100) / 100);
}

/**
 * R4.1 Medical Aid Gap / Out-of-Pocket Shortfall Calculation
 * Formula: Math.max(0, gross - medicalAidCovered), rounded to 2 decimal places.
 * 
 * Used for doctors, paediatricians, prescription medications, and dental claims.
 * If medical aid fully covers the expense or exceeds it, the shortfall is R0.00.
 */
export function calculateMedicalAidGap(grossAmount: number, medicalAidCovered: number): number {
  const gross = Number(grossAmount) || 0;
  const covered = Number(medicalAidCovered) || 0;
  const shortfall = gross - covered;
  return roundToTwo(Math.max(0, shortfall));
}

/**
 * R4.2 Statutory & Settlement Co-Parent Share Calculation
 * Formula: (netClaimable * splitPercentage) / 100, rounded to 2 decimal places.
 * Supports standard SA settlement split ratios (50%, 60%, 70%, 100%) and any valid percentage.
 * 
 * If netClaimable or splitPercentage is negative or zero, returns R0.00.
 */
export function calculateCoParentShare(netClaimable: number, splitPercentage: number): number {
  const claimable = Number(netClaimable) || 0;
  const percentage = Number(splitPercentage) || 0;
  if (claimable <= 0 || percentage <= 0) return 0;
  return roundToTwo((claimable * percentage) / 100);
}

/**
 * R4.3 Till Slip Line Item Allocation Portion
 * Formula: if included: line_total * (child_allocation_ratio ?? 1.0) else 0.00
 * 
 * Excluded personal grocery items (e.g. coffee beans, alcohol, luxury items) return 0.00.
 */
export function calculateLineItemPortion(item: LineItemAuditInput): number {
  if (!item || !item.is_included) return 0;
  const total = Number(item.line_total) || 0;
  if (total <= 0) return 0;
  const ratio = typeof item.child_allocation_ratio === "number" ? item.child_allocation_ratio : 1.0;
  if (ratio <= 0) return 0;
  return roundToTwo(total * ratio);
}

/**
 * R4.4 Comprehensive Receipt Audit Summary
 * Aggregates all line items on a till slip, separating qualifying child expenses
 * from excluded personal items, and calculating the co-parent's apportioned share.
 */
export function calculateReceiptAudit(
  items: LineItemAuditInput[],
  splitPercentage = 50
): ReceiptAuditSummary {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      gross_slip_total: 0,
      child_qualifying_total: 0,
      excluded_personal_total: 0,
      co_parent_share: 0,
      included_count: 0,
      excluded_count: 0,
    };
  }

  let gross_slip_total = 0;
  let child_qualifying_total = 0;
  let included_count = 0;
  let excluded_count = 0;

  for (const item of items) {
    const lineTotal = Number(item.line_total) || 0;
    gross_slip_total += lineTotal;

    if (item.is_included) {
      included_count++;
      child_qualifying_total += calculateLineItemPortion(item);
    } else {
      excluded_count++;
    }
  }

  const roundedGross = roundToTwo(gross_slip_total);
  const roundedChild = roundToTwo(child_qualifying_total);
  const excluded_personal_total = roundToTwo(Math.max(0, roundedGross - roundedChild));
  const co_parent_share = calculateCoParentShare(roundedChild, splitPercentage);

  return {
    gross_slip_total: roundedGross,
    child_qualifying_total: roundedChild,
    excluded_personal_total,
    co_parent_share,
    included_count,
    excluded_count,
  };
}

/**
 * R4.5 Outstanding Maintenance Arrears Calculation
 * Formula: Math.max(0, totalOwed - totalSettled), rounded to 2 decimal places.
 * 
 * Reconciles co-parent debt against recorded payments/settlements.
 */
export function calculateOutstandingArrears(totalOwed: number, totalSettled: number): number {
  const owed = Number(totalOwed) || 0;
  const settled = Number(totalSettled) || 0;
  return roundToTwo(Math.max(0, owed - settled));
}
