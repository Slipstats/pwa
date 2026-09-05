# Slipstats PWA — Feature Inventory, Legal Research & Strategic Architecture

**Document Version**: 2.0  
**Target Market**: South Africa (Maintenance Act 99 of 1998 Form 4A & High Court Rule 43)  
**Primary Users**: Mothers managing child maintenance, out-of-pocket medical aid recovery, and till slip/invoice allocations  
**Platforms**: Mobile-First PWA (iOS Safari & Android Chrome) + Responsive Desktop  

---

## 📑 Table of Contents
1. [Audit of Current Application Features](#1-audit-of-current-application-features)
2. [Research: South African Child Maintenance Expenses & Evidentiary Standards](#2-research-south-african-child-maintenance-expenses--evidentiary-standards)
3. [Algorithmic Harness & Gemini AI API Superpowers](#3-algorithmic-harness--gemini-ai-api-superpowers)
4. [Mobile UX, Temporal Flow & Navigation Architecture](#4-mobile-ux-temporal-flow--navigation-architecture)
5. [Court Bundle Admissibility: The "Invoice + Proof of Payment" Rule](#5-court-bundle-admissibility-the-invoice--proof-of-payment-rule)
6. [Actionable Implementation Roadmap](#6-actionable-implementation-roadmap)

---

## 1. Audit of Current Application Features

The following features are currently implemented in the Slipstats codebase:

### 1.1 Routing & App Shell
* **Public Marketing Landing Page (`/`)**: Form 4A & Rule 43 value propositions, interactive till slip exclusion visualizer, medical shortfall visualizer, interactive split calculator, FAQ, and conversion CTAs.
* **Authenticated Ledger Hub (`/dashboard`)**: Primary dashboard displaying hero financial metrics, child spend breakdown, category proportion visualizer, and recent expense feed.
* **App Shell Decoupling (`src/components/layout/AppShell.tsx`)**: Conditionally renders `AppHeader` and `BottomNav` on authenticated routes, suppressing them on public landing (`/`) and authentication (`/login`).
* **PWA Service Worker Guard**: Prevents dev cache poisoning on `localhost:3000` while caching assets in production. PWA manifest configured with `start_url: "/dashboard"`.

### 1.2 Data Persistence & State Management
* **`IDataRepository` Pattern**: Clean abstraction layer mirroring the 6 PostgreSQL tables from `supabase/schema.sql` 1:1 (`profiles`, `children`, `settlement_agreements`, `expenses`, `receipt_line_items`, `court_bundles`).
* **`LocalRepository`**: Offline client-side persistence using `localStorage` with reactive custom event dispatch (`slipstats:data-changed`).
* **`LedgerContext`**: Central state provider calculating real-time aggregates (`totalTracked`, `coParentOwed`, `childSpends`, `categories`, `arrears`, and active child filtering).
* **Demo Mode & Clean Slate**: Toggle allowing instant seeding with realistic trial data (Sarah Jenkins, Liam & Maya) or resetting to a clean slate.

### 1.3 Financial Calculation Engine (`src/lib/calculations.ts`)
* **Medical Aid Gap Recovery**: Computes `Math.max(0, gross - medical_covered)` with half-up cent rounding.
* **Co-Parent Apportionment Math**: Calculates share based on agreed split ratios (50%, 60%, 70%, 100%).
* **Till Slip Line-Item Apportionment**: Calculates line totals based on child allocation ratios (`1.0`, `0.7`, `0.5`, `0.0`) and exclusions, strictly preserving gross sum conservation (`gross === child_qualifying + excluded_personal`).
* **Outstanding Arrears & Clamping**: Computes arrears with a zero-clamp floor (no negative arrears).
* **Cryptographic SHA-256 Hashing**: Web Crypto API receipt image/string hashing for court chain-of-custody.

### 1.4 Screen Flows & UX
* **Expense Manual Entry (`/expenses/new`)**: Sanitized inputs, current date default, dynamic child selection dropdown, category selector, and live split preview.
* **Till Slip Audit Interface (`/scan`)**: Clean empty uploader state, sample slip loader, item-by-item inclusion/exclusion toggling, child allocation ratio cycling, and manual line-item addition.
* **Children & Settlement Splits (`/children`)**: Registered child list, `AddChildModal` for dynamic child registration, court case details, and real-time category split sliders (School 70%, Medical 60%, etc.).
* **Court Reports Hub (`/reports`)**: Period selector, preset filter (Form 4A vs Rule 43), claim summary, and PDF court bundle schedule exporter.

### 1.5 Automated Verification Suite
* **136 passing tests** across 6 test suites (`npm test` in 1.06s).
* **60 comprehensive E2E tests** covering Tiers 1 to 4 (isolation, edge cases, multi-feature combinations, and 4 realistic South African court scenarios: Randburg, JHB Family Court, Pretoria, and Cape Town High Court).
* 0 TypeScript compiler errors and 0 ESLint errors.

---

## 2. Research: South African Child Maintenance Expenses & Evidentiary Standards

Under the **Maintenance Act 99 of 1998 (Form 4A)** and **High Court Uniform Rule 43 (Urgent Financial Disclosure)**, maintenance awards are calculated based on:
$$\text{Child Need} \times \frac{\text{Parent Income}}{\text{Total Parental Income}} = \text{Apportioned Maintenance}$$

However, in practice, court disputes revolve around **evidentiary scrutiny**: proving that an expense was **actually incurred**, was **reasonable and necessary**, and was **actually paid**.

### 2.1 The Two Fundamental Expense Archetypes

| Dimension | Archetype 1: Point-of-Sale Till Slips | Archetype 2: Invoices & Periodic Statements |
|:---|:---|:---|
| **Examples** | Pick n Pay, Checkers, Woolworths, Clicks, Dis-Chem, School stationery shop, Sports store (boots/equipment). | School fees, Creche/Daycare, Medical Aid shortfall statements, Doctor/Specialist bills, Rent/Bond, Water & Electricity, Wi-Fi, Extramural coaching. |
| **Document Type** | Cash till slip or POS thermal receipt. | Formal Tax Invoice, Account Statement, or Municipal Utility Bill. |
| **Proof of Payment?** | **YES** — The till slip itself is statutory proof of purchase and settlement at POS. | **NO** — An invoice only proves liability (what is owed). The court demands proof that the mother actually paid it (EFT debit on bank statement or official receipt). |
| **Forensic Risk** | Tainted slips containing personal items (tampons, hair dye, alcohol, personal groceries) mixed with child items. Courts often discard entire slips if personal items are not explicitly itemized and excluded. | Unpaid or disputed invoices. The father's attorney argues: *"She was invoiced R5,000, but did she actually pay it, or is the account in arrears?"* |
| **Slipstats Solution** | **Till Slip Audit Scanner** (`/scan`): Line-item audit, toggle personal items OFF, calculate pure child qualifying portion. | **Evidentiary Document Vault** (`/vault`): Upload invoice/bill + automatically match against uploaded Bank Statement EFT debit to certify liability + settlement. |

### 2.2 Comprehensive South African Child Maintenance Expense Breakdown

#### Category A: Direct Child Expenses (100% Attributable or Specific Split)
1. **School Fees & Tuition**:
   - Billing: Monthly or termly formal invoice from school (Curro, Reddam, Crawford, public quintile 5 schools).
   - Frequency: Monthly (10 or 12 months) or annual upfront with discount.
2. **School Uniforms & Textbooks**:
   - Billing: Mix of till slips (Overwear, Pep, School shop) and termly textbook invoices.
3. **Out-of-Pocket Medical Aid Shortfalls**:
   - South African medical schemes (Discovery Health, Momentum, Bonitas) pay at 100% or 200% of scheme rate, leaving massive shortfalls for pediatric specialists, dentists, orthodontics, speech therapy, and occupational therapy.
   - Billing: Specialist invoice + Medical Aid Claims Summary Statement showing `Amount Claimed - Scheme Paid = Member Shortfall`.
4. **Extramurals & Sports Coaching**:
   - Billing: Private coach/academy monthly invoice (swimming, ballet, karate, tennis, coding club).
5. **Daycare, Creche & Aftercare**:
   - Billing: Monthly statement with late-pickup penalties and holiday care levies.
6. **Transport & School Runs (Travel Allowance)**:
   - Billing: SARS travel logbook rate per kilometre (currently R4.84/km). School shuttles bill monthly invoices; private driving requires distance/logbook records.
7. **Child Groceries, Toiletries & Baby Essentials**:
   - Billing: Point-of-sale till slips (nappies, formula, school lunchbox snacks, toiletries).

#### Category B: Shared Household Common Living Expenses (Apportioned Per Capita)
Under South African maintenance law (Form 4A Section C Part 2), children are entitled to a pro rata share of common household living expenses:
$$\text{Child's Share} = \frac{\text{Total Household Bill}}{\text{Total Household Occupants}}$$
* *Example*: Mother + 2 Children living in a rental home = 3 occupants. Each child is allocated $1/3$ ($33.33\%$) of the household overheads. Together, the children represent $2/3$ ($66.67\%$) of the bill.
* **Shared Overheads Include**:
  1. **Rent / Home Accommodation**: Monthly lease invoice or municipal rates.
  2. **Water, Sanitation & Electricity**: Monthly municipal statement (City of Joburg, City of Cape Town, Tshwane) or prepaid Eskom/meter slips.
  3. **High-Speed Home Fibre / Wi-Fi**: Essential for online schooling, homework, and research.
  4. **Domestic Worker / Child Care**: Domestic cleaning and caregiving (UIF-registered domestic worker wages).
  5. **Home Security / Armed Response**: ADT, Fidelity, Beagle Watch monthly invoice.

---

## 3. Algorithmic Harness & Gemini AI API Superpowers

Slipstats combines a **zero-cost, client-side algorithmic calculation harness** with targeted **Gemini AI API multimodal intelligence** to make tracking frictionless and court bundles bulletproof.

```
+─────────────────────────────────────────────────────────────────────────────+
|                         SLIPSTATS PROCESSING CORE                           |
+─────────────────────────────────────────────────────────────────────────────+
                                       │
        ┌──────────────────────────────┴──────────────────────────────┐
        ▼                                                             ▼
+───────────────────────────────────+       +───────────────────────────────────+
|   CLIENT-SIDE ALGORITHMIC HARNESS |       |      GEMINI AI MULTIMODAL API     |
|   (Zero API Cost, Instant 60fps)  |       |   (Natural Input & Document OCR)  |
+───────────────────────────────────+       +───────────────────────────────────+
| • Half-up cent rounding (ZAR)     |       | • Audio Voice Note Extraction     |
| • Co-parent split math (50/60/70) |       | • Till Slip OCR & Line Extraction |
| • Gross sum conservation formulas |       | • Medical Statement Shortfall OCR |
| • Per capita household split math |       | • SA Bank Statement Line Matcher  |
| • SARS R4.84/km travel math       |       | • Odometer Before/After Mileage   |
| • Web Crypto SHA-256 Hashing      |       | • Semantic Auto-Categorization    |
+───────────────────────────────────+       +───────────────────────────────────+
```

### 3.1 Local Algorithmic Harness (Free, Deterministic, 0 Latency)
All mathematical logic runs in pure TypeScript in the user's browser/device:
1. **SARS Travel Allowance Calculator**:
   $$\text{Travel Claim} = \text{Distance (km)} \times \text{SARS Rate (R4.84)}$$
2. **Household Per Capita Apportionment**:
   $$\text{Child Portion} = \text{Invoice Total} \times \left(\frac{\text{Number of Children}}{\text{Total Household Members}}\right) \times \text{Co-Parent Split Ratio}$$
3. **Receipt Gross Conservation**:
   $$\text{Gross Total} = \text{Qualifying Child Items} + \text{Excluded Personal Items}$$
4. **Court Exhibit Indexing & Forensic Hashing**:
   - Generates SHA-256 cryptographic hashes on-device using the Web Crypto API, embedding immutable timestamps into the export bundle.

### 3.2 Gemini AI API Superpowers (High-Impact UX)

#### 🎙️ Superpower 1: Audio Voice Note Expense Logger
* **The Problem**: A mother driving between school, gym, and doctor appointments cannot stop to fill out a 6-field form on a phone.
* **The Gemini Solution**: Tap a single microphone button in the bottom navigation bar and speak for 5–10 seconds:
  > *"I just dropped Sarah off at ballet at Virgin Active, drove 18 kilometers from school, and then paid R320 for her new ballet shoes."*
* **Gemini Prompt & Extraction**:
  Passes the audio buffer directly to Gemini 2.5/3.8 Flash with a structured schema returning:
  ```json
  {
    "entries": [
      {
        "type": "travel",
        "description": "Ballet drop-off Virgin Active",
        "child_name": "Sarah",
        "distance_km": 18,
        "rate_per_km": 4.84,
        "calculated_amount": 87.12,
        "category": "Fuel / Transport"
      },
      {
        "type": "direct_expense",
        "description": "Ballet shoes",
        "child_name": "Sarah",
        "amount": 320.00,
        "category": "Extramural / Sports"
      }
    ]
  }
  ```
* **UX Result**: A floating confirmation modal appears: *"2 expenses detected from voice note. Tap to confirm."* Logged in 2 seconds without typing.

#### 🚗 Superpower 2: Odometer Mileage Verification
* **The Problem**: Fathers routinely claim travel mileage is exaggerated or fictional.
* **The Gemini Solution**:
  1. Mother snaps photo of car dashboard odometer at departure.
  2. Mother snaps photo of dashboard odometer at arrival.
  3. Gemini Vision extracts the odometer readings (e.g., `Start: 84,210 km`, `End: 84,235 km = 25 km`).
  4. The two photos are watermarked with GPS/timestamp and bound to the expense as **Exhibit Annexure "T" (Verified Mileage)**.

#### 📄 Superpower 3: Bank Statement Reconciliation Engine
* **The Problem**: Proving an invoice was paid requires finding the matching EFT transaction in a 40-page PDF bank statement.
* **The Gemini Solution**:
  1. Mother uploads her monthly South African Bank Statement (PDF or scan from FNB, Standard Bank, Capitec, Nedbank, Absa).
  2. Gemini extracts all debit transactions (Date, Description, Amount, Reference).
  3. Slipstats matches transactions against unpaid invoices in the Document Vault:
     - *Invoice*: "Curro Aurora October School Fees" — **R4,850.00**
     - *Bank Statement Debit*: `2024-10-02 EFT PMT CURRO AURORA REF 84920` — **R4,850.00**
  4. Status changes to: **`VERIFIED PAID`** with the bank transaction reference permanently locked to the exhibit.

---

## 4. Mobile UX, Temporal Flow & Navigation Architecture

### 4.1 Mobile-First Ergonomics (Android Chrome & iOS Safari)
Mothers use their phones one-handed in busy environments (supermarkets, car lines, pharmacies). The layout must respect **thumb zone ergonomics**:

```
+───────────────────────────────────────────────────────────────+
| [Avatar] Sarah Jenkins           All Kids ▾    [🔔 Alerts (2)] |  <- Safe Area Header
+───────────────────────────────────────────────────────────────+
|                                                               |
|  [⚡ QUICK CAPTURE BAR]                                       |
|  [ 🎙️ Voice Note ]  [ 📷 Till Slip ]  [ 📄 Invoice ] [ 🚗 Km ] |  <- 1-Tap Daily Actions
|                                                               |
|  +─────────────────────────────────────────────────────────+  |
|  | HERO SUMMARY: October 2024                              |  |
|  | Owed by Mark: R 14,850.00          Total: R 24,120.00   |  |
|  +─────────────────────────────────────────────────────────+  |
|                                                               |
|  [ ⚠️ 2 Pending Invoices Need Payment Match ]                 |  <- Contextual Prompt
|                                                               |
|  BENEFICIARIES (Tap to filter)                                |
|  [ (👧) Maya - R8,200 ]     [ (👦) Liam - R6,650 ]            |
|                                                               |
|  RECENT ACTIVITY FEED                                         |
|  • Checkers Sandton (Audited Slip)              - R 1,240.50  |
|  • Curro Primary (Invoice • Verified Paid)      - R 4,850.00  |
|  • Dr. Van Der Merwe (Medical Gap 60%)          - R   850.00  |
|                                                               |
+───────────────────────────────────────────────────────────────+
|  [🏠 Hub]   [📁 Vault]   [➕ CAPTURE FAB]   [📊 Reports]   [👨‍👩‍👧 Kids] |  <- Floating Bottom Nav
+───────────────────────────────────────────────────────────────+
```

### 4.2 The 4 Temporal Horizons of Use

| Horizon | Frequency | User Goal | Key Features & Screens |
|:---|:---|:---|:---|
| **1. Daily Quick Capture** | Daily (1–3 times) | Log expenses before slips fade or memory slips. | Floating action button (FAB):<br>• Voice note record button<br>• Instant camera slip capture<br>• 15-second manual entry<br>• Quick travel/mileage logger |
| **2. Weekly Audit** | Weekly / Sunday | Tidy up receipts, exclude personal items. | `/scan` and `/expenses`:<br>• Review un-audited till slips<br>• Toggle personal groceries OFF<br>• Verify child allocations |
| **3. Monthly Reconciliation** | Month-End | Balance accounts and link bank payments. | `/vault`:<br>• Upload monthly school invoice<br>• Upload medical shortfall statement<br>• Upload monthly municipal water/power bill<br>• Upload PDF Bank Statement for auto-matching |
| **4. As-Needed Court Prep** | Quarterly or Court Date | Produce indisputable legal exhibit bundle. | `/reports`:<br>• Export Section 6(1) Form 4A schedule<br>• Export Rule 43 certified PDF bundle with table of contents, cross-referenced bank proofs, and SHA-256 seals |

### 4.3 Profile & Family UI Enhancements
1. **Mother's Profile Picture**:
   - Header profile avatar is interactive. Tapping opens an **Account & Profile Sheet** with an **"Upload Photo"** trigger (stored locally in IndexedDB as Base64/Blob URL, syncing to Supabase Storage when configured).
2. **Child Avatars**:
   - Individual avatar upload for each child.
   - Child cards on `/children` display their custom photo with an edit button.
3. **Child Profile Editing**:
   - Tapping an existing child opens the **Edit Beneficiary Modal** to adjust: First Name, Last Name, Date of Birth, School Name, Grade, Medical Aid Member/Dependent Code, and Default Co-Parent Split Ratio.

---

## 5. Court Bundle Admissibility: The "Invoice + Proof of Payment" Rule

South African Maintenance Courts and High Courts strictly reject unverified invoices. Slipstats enforces a **Two-Tier Verification Matrix**:

```
                       ┌─────────────────────────┐
                       │    EXPENSE RECORDED     │
                       └────────────┬────────────┘
                                    │
           ┌────────────────────────┴────────────────────────┐
           ▼                                                 ▼
+───────────────────────+                         +───────────────────────+
|   TYPE A: TILL SLIP   |                         |    TYPE B: INVOICE    |
+───────────────────────+                         +───────────────────────+
           │                                                 │
           ▼                                                 ▼
[ Verified at POS ]                               [ Liability Established ]
           │                                                 │
           ▼                                                 ▼
[ Audit Exclusions ]                              [ Match Bank Statement ]
           │                                                 │
           ▼                                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     COURT STATUS: ADMISSIBLE EXHIBIT                    │
│ • Certified Date & Timestamp                                            │
│ • Liability Document Attached (Invoice / Till Slip)                     │
│ • Settlement Proof Attached (POS Receipt / Bank Statement Debit Match)  │
│ • SHA-256 Forensic Hash Seal                                            │
└─────────────────────────────────────────────────────────────────────────┘
```

### The 4 Court Status Badges:
1. `ADMISSIBLE (TILL SLIP)`: Valid cash/POS receipt with personal items excluded.
2. `VERIFIED PAID (INVOICE)`: Invoice matched to a verified bank statement debit.
3. `UNVERIFIED INVOICE (PENDING PAYMENT)`: Invoice uploaded, but bank statement proof of payment is not yet matched. Warns mother before court submission.
4. `SHARED HOUSEHOLD (PER CAPITA)`: Municipal or rent bill with certified household member headcount apportionment.

---

## 6. Actionable Implementation Roadmap

To execute this vision seamlessly, the enhancements are structured into 4 sequential phases:

### Phase 1: Terminology & Core UX Polish (Immediate)
- Rename document types: replace generic "Till Slip" with **"Till Slip"** vs. **"School / Medical Invoice"** vs. **"Shared Household Bill"** vs. **"Travel Mileage"**.
- Add interactive Profile Photo upload for the Mother in `AppHeader.tsx`.
- Add Child Photo upload and **Edit Child Modal** in `/children`.
- Update bottom navigation with clear icon labels: `Dashboard`, `Vault`, `Quick Capture (+)`, `Reports`, `Family`.

### Phase 2: The Evidentiary Document Vault (`/vault`)
- Create dedicated Document Vault route (`/vault`) categorizing documents into:
  - School Fee Invoices
  - Medical Aid Shortfall Statements
  - Shared Household Accounts (Rent, Water & Electricity, Wi-Fi)
  - Bank Statements (EFT Proofs)
- Implement per capita household expense apportionment calculator (Rent/Water divided by total residents).

### Phase 3: Gemini AI Multimodal Superpowers
- **Voice Note Expense Capture**: Integrated audio recorder feeding into Gemini Flash API with structured JSON output.
- **Odometer & Mileage Capture**: Start & End odometer photo comparison with automated distance calculation at SARS R4.84/km rate.
- **Bank Statement Reconciliation**: Bank statement line parser matching EFT debits against vault invoices to award the `VERIFIED PAID` court badge.

### Phase 4: Enhanced Court Exhibit Exporter
- Update `/reports` Form 4A & Rule 43 bundle generator to compile:
  - Table of Contents with Annexure lettering (Annexure "A" to "D").
  - Side-by-side pairing of Invoices with Bank Statement Proof of Payment.
  - Per capita household calculation schedules admissible under Section 6(1) Maintenance Act 99 of 1998.
