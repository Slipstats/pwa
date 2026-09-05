# Slipstats PWA — Test Infrastructure & 4-Tier Verification Matrix

## 1. Overview & Architecture

Slipstats is a court-grade Child Expense Tracker & Forensic Till Slip Allocation Progressive Web App (PWA) designed for South African mothers compiling certified exhibits under the **Maintenance Act 99 of 1998 (Form 4A)** and **High Court Rule 43**. 

This document defines the authoritative test infrastructure, test runner conventions, and the exhaustive 4-Tier test matrix enforcing financial accuracy, forensic audit integrity, and regulatory compliance.

### Test Runner Architecture
- **Framework**: Vitest / Node.js standard runner (`npm test`)
- **Execution Mode**: 100% non-interactive, zero-network local execution, hermetic in-memory fixtures.
- **Root Directories**:
  - `tests/unit/`: Component & pure calculation unit tests.
  - `tests/e2e/`: Requirement-driven integration and end-to-end user journey test suites (`e2e_flows.test.ts`).

---

## 2. The 4-Tier Testing Methodology

```
+───────────────────────────────────────────────────────────────────+
| Tier 4: Real-World Court Scenarios (Randburg, JHB, PTA, CPT)      |
+───────────────────────────────────────────────────────────────────+
                                  ▲
+───────────────────────────────────────────────────────────────────+
| Tier 3: Cross-Feature Combinations (Exclusion x Medical x Arrears) |
+───────────────────────────────────────────────────────────────────+
                                  ▲
+───────────────────────────────────────────────────────────────────+
| Tier 2: Boundary & Corner Cases (R0, Negatives, Clamps, Rounding) |
+───────────────────────────────────────────────────────────────────+
                                  ▲
+───────────────────────────────────────────────────────────────────+
| Tier 1: Core Feature Coverage in Isolation (R1 to R5 >= 5 tests)   |
+───────────────────────────────────────────────────────────────────+
```

---

## 3. Tier 1: Feature Coverage (Isolation)

Each user requirement (R1 to R5) defined in `ORIGINAL_REQUEST.md` is tested with a minimum of 5 distinct, isolated tests:

### R1. Public Marketing Landing Page & Routing Restructuring
1. **T1.R1.1**: Root route (`/`) structural layout contract exposes primary value propositions: till slip forensic itemization, medical aid shortfall recovery, and Form 4A court exhibit generation.
2. **T1.R1.2**: Conversion CTAs exist on landing page with explicit target routes (`/login`, `/dashboard`).
3. **T1.R1.3**: Authenticated PWA ledger resides at `/dashboard` with internal navigation linking `/expenses`, `/scan`, `/reports`, `/children`.
4. **T1.R1.4**: Public layout decoupling verifies `AppHeader` and `BottomNav` are suppressed on public routes (`/`, `/login`) to maintain conversion focus.
5. **T1.R1.5**: Deep-link route contracts verify that legacy root ledger redirects or isolates to `/dashboard` without state corruption.

### R2. Real-World User Flows & Pristine UX
1. **T1.R2.1**: User profile registration initializes Mother profile with court case jurisdiction and case number.
2. **T1.R2.2**: Child onboarding flow allows adding multiple children (e.g. Liam, Maya) with individual dates of birth and custom default split ratios.
3. **T1.R2.3**: Input form state sanitization verifies manual expense form (`/expenses/new`) initializes with clean empty vendor, smart default date (today), and zero amounts.
4. **T1.R2.4**: Form submission validation enforces mandatory fields (vendor, child selection, category, gross amount > 0) with clear error messaging.
5. **T1.R2.5**: Demo mode toggle enables immediate seeding of realistic trial data (Sarah Jenkins, Liam & Maya) and clean slate resets back to zero state.

### R3. Hybrid Local-to-Supabase Data Persistence Layer
1. **T1.R3.1**: Schema compliance verifies in-memory / local storage data models mirror PostgreSQL `supabase/schema.sql` 6 tables 1:1.
2. **T1.R3.2**: Offline persistence contract ensures added expenses and children persist across simulated session reloads.
3. **T1.R3.3**: Event bus emission (`slipstats:data-changed`) triggers on every expense mutation (create, status update, delete).
4. **T1.R3.4**: Hero ledger balance dynamically reflects the sum of all pending/unsettled child expenses.
5. **T1.R3.5**: Child spend breakdown aggregates expenses grouped strictly by `child_id`.

### R4. Automated Financial & Forensic Calculation Formulas
1. **T1.R4.1**: Medical aid shortfall formula: `net_claimable = Math.max(0, gross_amount - medical_aid_covered)` rounded to 2 decimal places.
2. **T1.R4.2**: Co-parent apportionment ratio calculation: `(net_claimable * split_ratio) / 100` across standard ratios (50%, 60%, 70%, 100%).
3. **T1.R4.3**: Till slip item portion formula: `line_total * child_allocation_ratio` when included, exactly 0.00 when marked excluded.
4. **T1.R4.4**: Receipt aggregate audit computes gross slip total, child qualifying total, excluded personal total, and co-parent share.
5. **T1.R4.5**: Cryptographic SHA-256 calculation produces standard 64-character hex hash matching NIST test vectors for receipt tamper-evidence.

### R5. Local DevOps & Operational Safeguards
1. **T1.R5.1**: Service worker registration is conditionally disabled in development (`process.env.NODE_ENV !== 'production'`) to prevent dev cache poisoning.
2. **T1.R5.2**: Test suite executes 100% non-interactively without requiring browser UI or network calls.
3. **T1.R5.3**: Memory footprint safeguard verifies tests complete without memory leaks or unbounded worker threads.
4. **T1.R5.4**: Zero remote mutation check verifies repository operations execute on local store without calling remote Supabase endpoints.
5. **T1.R5.5**: Financial currency formatting adheres to South African standard format (`R1 250.00` or `R1,250.00`).

---

## 4. Tier 2: Boundary, Edge & Corner Cases

>=5 boundary tests per domain to safeguard against unexpected inputs and numerical drift:

### B1. Financial Zero, Negative & Overflow Limits
1. **T2.B1.1**: Gross amount of `R0.00` yields `net_claimable = 0.00` and `co_parent_share = 0.00`.
2. **T2.B1.2**: Negative gross amount input is clamped to `0.00` (no negative maintenance claims).
3. **T2.B1.3**: Split percentage of `0%` yields `co_parent_share = 0.00`.
4. **T2.B1.4**: Split percentage of `100%` yields `co_parent_share = net_claimable`.
5. **T2.B1.5**: Extreme financial value (e.g. `R1,000,000.00` school building levy) maintains cent-level precision without overflow.

### B2. Medical Aid Shortfall Boundary & Clamping
1. **T2.B2.1**: Medical aid covers 100% of expense (`gross == covered`) -> `net_claimable = 0.00`, `co_parent_share = 0.00`.
2. **T2.B2.2**: Medical aid covers 0% (`covered = 0.00`) -> `net_claimable = gross_amount`.
3. **T2.B2.3**: Over-coverage anomaly (`covered > gross` due to wellness bonus/scheme rebate) is strictly clamped to `0.00` (never negative).
4. **T2.B2.4**: Medical aid covered with fractional cents (e.g., `gross: 450.00, covered: 133.333`) rounds to exact two decimal places (`316.67`).
5. **T2.B2.5**: Both gross and medical covered zero -> yields `0.00`.

### B3. Till Slip Forensic Itemization Boundaries
1. **T2.B3.1**: Empty receipt (0 line items) returns gross `0.00`, qualifying `0.00`, excluded `0.00`, count 0.
2. **T2.B3.2**: 100% excluded receipt (all items personal luxury/alcohol) -> qualifying `0.00`, co-parent share `0.00`, excluded == gross.
3. **T2.B3.3**: 100% included receipt (all items child essentials) -> excluded `0.00`, qualifying == gross, co-parent share proportional.
4. **T2.B3.4**: Line item with `child_allocation_ratio = 0.0` explicitly results in `child_portion = 0.00`.
5. **T2.B3.5**: Line item with unassigned allocation ratio defaults gracefully to `1.0` (100% qualifying).

### B4. Cent Rounding & Currency Precision
1. **T2.B4.1**: Banker's rounding / half-up verification: `R333.33` split `50%` = `R166.67` (not `R166.665`).
2. **T2.B4.2**: Three-way split: `R100.00` split across 3 line items (`33.33 + 33.33 + 33.34 = 100.00`).
3. **T2.B4.3**: Repeated fractional splits aggregate without cumulative floating point drift (IEEE 754 epsilon guard).
4. **T2.B4.4**: Arrears balance calculation: `totalOwed = 1500.50, totalSettled = 1500.50` -> arrears `0.00`.
5. **T2.B4.5**: Overpayment clamp: `totalSettled > totalOwed` clamps arrears to `0.00` (does not register negative debt).

### B5. Empty Strings, Null Safety & Cryptographic NIST Standards
1. **T2.B5.1**: Empty string SHA-256 hash strictly matches NIST standard vector `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
2. **T2.B5.2**: Unicode & Afrikaans special characters in vendor/item names (e.g. `Hoërskool Randburg`, `Melk & Kaas`) hash consistently across platforms.
3. **T2.B5.3**: Missing optional notes, null school name, and null court case number handle gracefully without throwing `TypeError`.
4. **T2.B5.4**: Multi-byte binary image buffer hashes identically to string representations.
5. **T2.B5.5**: Malformed date strings fall back cleanly to original string in `formatDate` without throwing unhandled exceptions.

---

## 5. Tier 3: Cross-Feature Combinations (Pairwise & Multi-Way)

1. **T3.C1: Multi-Item Till Slip with Category Split Rules**:
   - Till slip contains School Stationery (70% co-parent split) and Groceries (50% co-parent split) on the same invoice.
   - Verifies item-level categorization flows through to accurate co-parent apportionment.
2. **T3.C2: Till Slip Exclusion + Child Multi-Allocation (50% shared vs 100% dedicated)**:
   - Basket has shared family groceries (50% child allocation) + child medicine (100% child allocation) + parent wine (excluded 0%).
   - Verifies compound child qualifying total and co-parent liability.
3. **T3.C3: Medical Consultation + Medical Aid Shortfall + Co-parent Apportionment**:
   - Specialist fee R1,850.00; Discovery Health covered R1,120.00; net gap R730.00; co-parent medical agreement 60% = R438.00.
4. **T3.C4: Multi-Expense Ingestion + Partial Payment Settlement + Arrears Schedule**:
   - 3 expenses logged across Education, Medical, and Nutrition totalling R6,400.00 owed.
   - Co-parent pays R4,000.00 direct EFT.
   - Ledger updates active arrears to R2,400.00 with verified payment status.
5. **T3.C5: Offline Ingestion + Event Bus Dispatch + Repository Hydration**:
   - New expense added via repository -> `slipstats:data-changed` fired -> Ledger balance recalculates reactively without page refresh.
6. **T3.C6: Clean Slate Mutation Isolation vs Demo Mode Reset**:
   - Seed data loaded (R8,450.00 owed) -> Cleared to Clean Slate (0 expenses, 0 balance) -> Custom child & expense added -> Reset to Seed Data restores initial baseline cleanly.

---

## 6. Tier 4: Real-World South African Maintenance Court Scenarios

High-fidelity test cases modeling realistic South African maintenance court disputes:

### Scenario 1: Randburg Magistrate Court Case MC-2024/7821 (Checkers Sandton Grocery Audit)
- **Litigants**: Sarah Jenkins (Applicant) vs David Jenkins (Respondent).
- **Facts**: Applicant submits Checkers Hyper Sandton till slip for R1,748.80.
- **Forensic Audit**:
  - Item 1: Pampers Premium Care Nappies R349.99 (100% Liam, Included)
  - Item 2: Similac Infant Formula R289.99 (100% Liam, Included)
  - Item 3: Woolworths Full Cream Milk 2L x 2 R79.98 (Shared family 50%, Included)
  - Item 4: Nespresso Master Origin Espresso Pods R145.00 (**Excluded**: Parent personal luxury)
  - Item 5: Simonsig Kaapse Vonkel Brut Sparkling Wine R189.90 (**Excluded**: Adult alcohol)
  - Item 6: Fresh Fruit & Vegetables Assorted R244.00 (Shared family 50%, Included)
  - Item 7: Centrum Kids Chewable Multivitamins R199.95 (100% Maya, Included)
  - Item 8: Lindt Dark Chocolate Slab R69.99 (**Excluded**: Personal confectionery)
  - Item 9: Colgate Kids Toothpaste & Toothbrush R89.99 (100% Liam, Included)
  - Item 10: Woolies Free Range Chicken Breasts R100.00 (Shared family 50%, Included)
- **Court Formula Verification**:
  - Total Excluded Personal Items: R145.00 + R189.90 + R69.99 = R404.89
  - Qualifying Child Pool: R1,343.91 (after 50% family sharing: R349.99 + R289.99 + R39.99 + R122.00 + R199.95 + R89.99 + R50.00 = R1,141.91)
  - Co-parent Settlement Agreement (50% share): R570.96
  - Cryptographic Receipt Hash matches image evidence digest.

### Scenario 2: Johannesburg Family Court Case JHB-FC-2024/3109 (Sandton Mediclinic Pediatric Emergency)
- **Litigants**: Bronwyn Nel (Applicant) vs Craig Nel (Respondent).
- **Facts**: Emergency pediatric admission for acute bronchitis at Sandton Mediclinic.
- **Expenses**:
  1. Sandton Mediclinic ER Facility Fee: Gross R4,500.00 | Discovery Health paid: R3,200.00 | Shortfall: R1,300.00
  2. Dr. K. Mistry (Specialist Pediatrician): Gross R2,400.00 | Discovery Health paid: R1,450.00 | Shortfall: R950.00
  3. Dis-Chem Sandton City (Nebuliser & Antibiotics): Gross R1,180.50 | Discovery Health paid: R450.00 | Shortfall: R730.50
- **Court Formula Verification**:
  - Total Gross Invoiced: R8,080.50
  - Total Medical Scheme Paid: R5,100.00
  - Net Out-of-Pocket Claimable Shortfall: R2,980.50
  - Agreement Section 4.2 Medical Shortfall Split (Respondent: 60%): R1,788.30
  - Applicant Out-of-Pocket Share (40%): R1,192.20

### Scenario 3: Pretoria Magistrate Court Case PTA-2024/9942 (Form 4A Certified Bundle Generation)
- **Litigants**: Lerato Khumalo (Applicant) vs Sipho Khumalo (Respondent).
- **Facts**: Application for Maintenance Order under Section 6 of Maintenance Act 99 of 1998.
- **Bundle Generation**:
  - Period: 2024-01-01 to 2024-03-31 (Q1 Audit)
  - 14 audited receipts across Education, Extramural, Medical, and Living Essentials.
  - Total gross expenditure: R34,850.00
  - Net claimable co-parent share: R19,420.00
  - Total settled by Respondent: R12,000.00
  - Total Certified Arrears Claim: R7,420.00
  - Cryptographic Bundle Hash computed over serialised court schedule for tamper-evidence.

### Scenario 4: Cape Town High Court Rule 43 Urgent Financial Disclosure
- **Litigants**: Chloe Van Der Merwe (Applicant) vs Jacques Van Der Merwe (Respondent).
- **Facts**: Urgent interim maintenance application pendente lite.
- **Requirements**: Strict compartmentalization of child costs vs spouse costs, verified child allocation ratios, zero inclusion of personal expenditures, and cryptographic hash verification for court registrar admissibility.

---

## 7. Test Execution & Verification Guide

### Running All Tests
```bash
npm test
```

### Running E2E Test Suite Only
```bash
npx vitest run tests/e2e/e2e_flows.test.ts
```

### Continuous Integration (CI/CD) Headless Flags
```bash
npm test -- --reporter=verbose --run
```
