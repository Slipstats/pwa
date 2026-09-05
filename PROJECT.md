# Project: Slipstats PWA Transformation

## Architecture

Slipstats is a court-grade Child Expense Tracker & Till Slip Allocation Progressive Web App (PWA) built on Next.js 15 App Router, React 19, TypeScript, and Tailwind CSS (Google Material 3 Expressive tokens). It is tailored for South African mothers tracking child maintenance, out-of-pocket medical aid shortfall recovery, and compiling court-ready Form 4A (Maintenance Act 99 of 1998) & Rule 43 certified exhibit bundles.

### High-Level Topology
```
                  +──────────────────────────────────────+
                  |         Public Marketing Landing     |
                  |                Route: /              |
                  +──────────────────────────────────────+
                                     │ (Get Started / Demo)
                                     ▼
                  +──────────────────────────────────────+
                  |         Authenticated PWA Hub        |
                  |            Route: /dashboard         |
                  +──────────────────────────────────────+
                   │             │           │          │
                   ▼             ▼           ▼          ▼
             /expenses/new     /scan      /reports  /children
                   │             │           │          │
                   └─────────────┼───────────┼──────────┘
                                 ▼
                  +──────────────────────────────────────+
                  |          Reactive LedgerContext      |
                  |       (State & Event Bus Provider)   |
                  +──────────────────────────────────────+
                                 │
                                 ▼
                  +──────────────────────────────────────+
                  |          IDataRepository             |
                  |  (LocalFirst / IndexedDB / Supabase) |
                  +──────────────────────────────────────+
```

---

## Feature Inventory

Every feature identified in the Survey phase is mapped to an implementation milestone below:

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Medical Aid Gap Calculation | `Math.max(0, gross - medical_aid)` pure calculation with rounding | M1 | Survey (Schema & DevOps) |
| 2 | Co-Parent Apportionment Math | `(net_claimable * split_ratio) / 100` supporting 50%, 60%, 70%, 100% and category rules | M1 | Survey (Schema & DevOps) |
| 3 | Till Slip Allocation Math | `line_total * child_allocation_ratio` (1.0, 0.7, 0.5, 0.0) & slip audit aggregates | M1 | Survey (Schema & DevOps) |
| 4 | Cryptographic SHA-256 Hashing | Web Crypto API SHA-256 digest calculation of receipt binary/buffer | M1 | Survey (Schema & DevOps) |
| 5 | Automated Test Harness (`npm test`) | Vitest / non-interactive test runner configured in `package.json` | M1 | Survey (DevOps & Testing) |
| 6 | Service Worker Dev Safeguard | Guard service worker registration on `localhost:3000` to prevent dev cache poisoning | M1 | Survey (DevOps) |
| 7 | Abstracted Data Repository | `IDataRepository` interface matching `supabase/schema.sql` 6 tables 1:1 | M2 | Survey (Schema & Spec) |
| 8 | LocalStorage / Offline Persistence | Offline store persisting expenses, children, and agreements across page refreshes | M2 | Survey (Schema & Spec) |
| 9 | Reactive State & Event Dispatch | `LedgerContext` listening to `slipstats:data-changed` custom event for instant UI reaction | M2 | Survey (Schema & Frontend) |
| 10 | Demo Mode Toggle & Clean Slate | Switch between realistic seed data (Sarah Jenkins, Liam & Maya) and clean slate | M2 | Survey (Frontend & Schema) |
| 11 | Routing Inversion (`/` vs `/dashboard`) | Move active ledger to `/dashboard`, convert `/` into public marketing landing page | M3 | Survey (Frontend) |
| 12 | App Shell Decoupling | Conditionally hide `AppHeader` and `BottomNav` on `/` and `/login` | M3 | Survey (Frontend) |
| 13 | Public Marketing Landing Page | High-converting landing page with Form 4A/Rule 43 messaging, till slip audit visuals, and CTAs | M3 | Survey (Frontend) |
| 14 | Navigation Realignment | Update all internal links (`BottomNav`, `AppHeader`, redirects) to point to `/dashboard` | M3 | Survey (Frontend & DevOps) |
| 15 | Form Sanitization (`/expenses/new`) | Replace hardcoded mock inputs with clean empty states, smart defaults, dynamic children | M4 | Survey (Frontend) |
| 16 | Till Slip Audit UX Sanitization (`/scan`) | Clean empty uploader, optional sample slip loader, reactive item inclusion toggling | M4 | Survey (Frontend) |
| 17 | Children & Profile UX Sanitization | Remove hardcoded mock inputs from `AddChildModal` and dynamic child dropdown in header | M4 | Survey (Frontend) |
| 18 | PWA Offline Indicator & Manifest Update | Add `OfflineIndicator` banner, update `start_url` to `/dashboard`, cache app shell | M4 | Survey (Frontend & DevOps) |
| 19 | E2E Test Suite (Tiers 1-4) | Comprehensive requirement-driven opaque-box test suite verifying R1 to R5 | E2E Track | ORIGINAL_REQUEST |
| 20 | Final E2E Pass & Adversarial Hardening | 100% test pass + Tier 5 coverage audit + Forensic Integrity Audit | M5 | ORIGINAL_REQUEST |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Core Calculations & Test Harness | Extract pure math into `src/lib/calculations.ts`, configure `npm test` with Vitest, unit tests for calculations & SHA-256, guard SW registration in dev | none | DONE |
| M2 | Hybrid Data Persistence & Demo Mode | Implement `IDataRepository`, `localRepository.ts`, `LedgerContext`, and Demo Mode / Clean Slate toggle | M1 | PLANNED |
| M3 | Routing Restructuring & Marketing Landing Page | Relocate ledger to `/dashboard`, build high-converting marketing landing page on `/`, decouple `RootLayout` shell | M2 | PLANNED |
| M4 | User Flows, Form Sanitization & Pristine UX | Clean empty states in `/expenses/new`, `/scan`, and `AddChildModal`, dynamic child selectors, offline indicator, PWA update | M2, M3 | PLANNED |
| M5 | Final Milestone: E2E Test Pass & Hardening | Pass 100% E2E tests (Tiers 1-4), adversarial test hardening (Tier 5), forensic integrity verification | M1, M2, M3, M4, E2E Track | PLANNED |

---

## Interface Contracts

### 1. `src/lib/calculations.ts`
```typescript
export interface LineItemAuditInput {
  line_total: number;
  is_included: boolean;
  child_allocation_ratio?: number; // 1.0, 0.7, 0.5
}

export interface ReceiptAuditSummary {
  gross_slip_total: number;
  child_qualifying_total: number;
  excluded_personal_total: number;
  co_parent_share: number;
  included_count: number;
  excluded_count: number;
}

export function calculateMedicalAidGap(grossAmount: number, medicalAidCovered: number): number;
export function calculateCoParentShare(netClaimable: number, splitPercentage: number): number;
export function calculateLineItemPortion(item: LineItemAuditInput): number;
export function calculateReceiptAudit(items: LineItemAuditInput[], splitPercentage?: number): ReceiptAuditSummary;
export function calculateOutstandingArrears(totalOwed: number, totalSettled: number): number;
```

### 2. `src/lib/repository/types.ts`
```typescript
import type { Profile, Child, SettlementAgreement, Expense, ReceiptLineItem, CourtBundle } from "@/types/database.types";

export interface IDataRepository {
  getProfile(): Promise<Profile>;
  updateProfile(data: Partial<Profile>): Promise<Profile>;
  getChildren(): Promise<Child[]>;
  addChild(child: Omit<Child, "id" | "created_at">): Promise<Child>;
  deleteChild(id: string): Promise<boolean>;
  getAgreement(): Promise<SettlementAgreement>;
  saveAgreement(agreement: Partial<SettlementAgreement>): Promise<SettlementAgreement>;
  getExpenses(childId?: string, category?: string): Promise<Expense[]>;
  createExpense(expense: Omit<Expense, "id" | "created_at" | "updated_at">, lineItems?: Omit<ReceiptLineItem, "id" | "expense_id" | "created_at">[]): Promise<Expense>;
  updateExpenseStatus(id: string, status: Expense["status"]): Promise<Expense>;
  deleteExpense(id: string): Promise<boolean>;
  getLineItems(expenseId: string): Promise<ReceiptLineItem[]>;
  getCourtBundle(period: string, preset: string): Promise<CourtBundle>;
  isDemoMode(): boolean;
  setDemoMode(enabled: boolean): Promise<void>;
  resetToSeedData(): Promise<void>;
  clearToCleanSlate(): Promise<void>;
}
```

### 3. Reactive Event Bus
```typescript
// Dispatched on window whenever data mutations occur in localRepository
window.dispatchEvent(new CustomEvent("slipstats:data-changed", { detail: { entity: string } }));
```

---

## Code Layout

```
src/
├── app/
│   ├── page.tsx                  # Public marketing landing page (M3)
│   ├── dashboard/page.tsx        # Authenticated financial ledger hub (M3)
│   ├── expenses/
│   │   ├── page.tsx              # Re-exports /dashboard or redirects (M3)
│   │   └── new/page.tsx          # Sanitized manual expense entry form (M4)
│   ├── scan/page.tsx             # Sanitized till slip uploader & audit interface (M4)
│   ├── reports/page.tsx          # Form 4A & Rule 43 court bundles (M2/M4)
│   ├── children/page.tsx         # Children list & settlement agreement ratios (M4)
│   ├── login/page.tsx            # Login & onboarding flows (M3/M4)
│   ├── layout.tsx                # App shell, PWA registration (M1/M3)
│   └── globals.css
├── components/
│   ├── landing/                  # Marketing landing page components (M3)
│   │   ├── MarketingNav.tsx
│   │   ├── HeroSection.tsx
│   │   ├── TillSlipVisual.tsx
│   │   ├── ShortfallVisual.tsx
│   │   ├── CourtComplianceSection.tsx
│   │   ├── InteractiveCalculator.tsx
│   │   ├── FaqSection.tsx
│   │   └── MarketingFooter.tsx
│   ├── dashboard/
│   │   ├── HeroBalanceCard.tsx
│   │   ├── ChildSpendCard.tsx
│   │   ├── CategoryChart.tsx
│   │   └── ExpenseList.tsx
│   ├── layout/
│   │   ├── AppHeader.tsx
│   │   ├── BottomNav.tsx
│   │   └── DemoModeBanner.tsx    # Demo mode / Clean slate switcher (M2)
│   └── shared/
│       ├── OfflineIndicator.tsx  # PWA offline pill banner (M4)
│       └── ReceiptUploader.tsx
├── context/
│   ├── AuthContext.tsx
│   └── LedgerContext.tsx         # Reactive client ledger store (M2)
├── lib/
│   ├── calculations.ts           # Pure financial & forensic calculation formulas (M1)
│   ├── repository/               # Local-first repository pattern (M2)
│   │   ├── types.ts
│   │   ├── localRepository.ts
│   │   ├── supabaseRepository.ts
│   │   └── index.ts
│   ├── data/mockData.ts
│   ├── supabase/
│   └── utils.ts
└── types/
    └── database.types.ts
tests/
├── unit/
│   ├── calculations.test.ts      # Unit tests for R4 calculations (M1)
│   └── hashing.test.ts           # Unit tests for SHA-256 Web Crypto (M1)
└── e2e/
    └── e2e_flows.test.ts         # Requirement-driven E2E tests (E2E Track)
```
