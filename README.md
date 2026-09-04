# 🛡️ Slipstats — Court-Ready Child Expense Tracker & AI Slip Allocation PWA

**Slipstats** is an empathetic, legally robust Progressive Web App (PWA) engineered specifically for mothers navigating child-related expense tracking, reimbursement claims, and family court disclosures (such as Maintenance Court Form 4A and Rule 43 applications).

It turns chaotic, fading till slips and medical receipts into an **unassailable, court-grade financial audit ledger**, dissolving co-parenting financial friction into serene, factual clarity.

---

## 🚀 Key Highlights & Capabilities

* **Till Slip Line-Item Allocation (Groceries vs Child Items)**: When buying groceries at Checkers, Pick n Pay, or Woolworths, mothers can itemize the till slip with OCR and exclude personal items (e.g. espresso beans, sparkling water) with a single tap, claiming strictly what is legally apportioned for the children.
* **Medical Aid Gap Reconciliation**: Seamlessly accounts for medical aid/insurance payouts (e.g., Discovery Health, Bonitas) to ensure only legitimate out-of-pocket patient shortfalls are claimed, preventing accusations of "double recovery" in court.
* **Maintenance Court Form 4A & Rule 43 Compliance**: Pre-formatted court exhibit exports with certified SHA-256 cryptographic integrity hashes, exhibit schedules (Exhibit 01, Exhibit 02), and formal affidavits.
* **Category-Specific Court Splits**: Automatic application of settlement agreement clauses (e.g. 50/50 schooling, 60/40 medical, custom extramural ratios).
* **PWA & Offline Resilience**: Installable on iOS and Android home screens with offline receipt capture, fast loading, and native mobile-first touch ergonomics.

---

## 🛠️ Technology Stack

* **Framework**: Next.js 15 (App Router, React 19, TypeScript)
* **Styling**: Tailwind CSS (Material 3 Expressive color palette, mineral slate teal `#28585E`, sage `#567A68`, and tabular typography)
* **Database & Auth**: Supabase (Self-contained PostgreSQL schema with Row-Level Security, audit indexes, and SSR client helpers)
* **PWA**: Web App Manifest (`manifest.json`), custom Service Worker (`sw.js`), mobile safe-area insets
* **Deployment**: Node.js / Vercel / Docker

---

## 📂 Project Structure

```
slipstats/
├── public/
│   ├── manifest.json              # PWA Web App Manifest
│   ├── sw.js                      # PWA Service Worker (offline cache)
│   ├── images/                    # Brand assets & avatars
│   └── icons/                     # PWA app icons
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with PWA metadata, fonts & safe insets
│   │   ├── page.tsx               # Expenses Dashboard (Hero ledger, children cards, feed)
│   │   ├── expenses/
│   │   │   ├── page.tsx           # Expenses route
│   │   │   └── new/page.tsx       # Manual Expense Entry & Medical Aid Gap calculator
│   │   ├── scan/
│   │   │   └── page.tsx           # AI Slip Allocation & line item personal exclusion
│   │   ├── reports/
│   │   │   └── page.tsx           # Court-Ready PDF Statement & Exhibit Generator
│   │   ├── children/
│   │   │   └── page.tsx           # Children profiles & Category Split Rules
│   │   └── globals.css            # Tailwind, Material Symbols, tabular numbers
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppHeader.tsx      # Top bar with logo, child selector, notifications
│   │   │   └── BottomNav.tsx      # M3 persistent mobile bottom navigation bar
│   │   └── dashboard/
│   │       ├── HeroBalanceCard.tsx # Shared Ledger Balance & co-parent split
│   │       ├── ChildSpendCard.tsx  # Liam & Maya individual spend cards
│   │       ├── CategoryChart.tsx   # Category proportion visualizer
│   │       └── ExpenseList.tsx     # Filterable recent expenses feed
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts          # Browser Supabase client
│   │   │   └── server.ts          # Server-side Supabase SSR client
│   │   ├── data/
│   │   │   └── mockData.ts        # High-fidelity realistic mock data
│   │   └── utils.ts               # Currency formatting (ZAR 'R') & date helpers
│   └── types/
│       └── database.types.ts      # TypeScript interfaces for Supabase schema
├── supabase/
│   └── schema.sql                 # Production-ready PostgreSQL schema with RLS & indexes
├── docs/
│   ├── ARCHITECTURE.md            # Detailed system architecture & component hierarchy
│   ├── SUPABASE_SETUP.md          # Guide to deploy schema, configure Auth & Storage
│   ├── PWA_SPEC.md                # PWA manifest, service worker caching, install guide
│   └── LEGAL_COMPLIANCE.md        # Maintenance Court Form 4A & Rule 43 compliance guide
├── .env.example                   # Environment variable template
├── .env.local                     # Local development environment configuration
├── tailwind.config.ts             # Complete M3 theme tokens & spacing
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # Strict TypeScript configuration
└── package.json                   # Dependencies and scripts
```

---

## ⚡ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
# When ready to link your live Supabase project:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_DEFAULT_CURRENCY=ZAR
```
*(Note: Slipstats runs out-of-the-box in local development with rich interactive mock data even before connecting live Supabase keys!)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Verify Code Quality (Lightweight)
```bash
# TypeScript verification
npm run typecheck

# Code formatting & linting
npm run lint
```

---

## 📱 Progressive Web App (PWA) Installation

* **iOS (Safari)**: Tap the Share button (`Share`) ➔ tap **"Add to Home Screen"**.
* **Android (Chrome)**: Tap the menu (three dots) ➔ tap **"Install App"** or tap the install prompt banner.
* **Desktop (Chrome/Edge)**: Click the Install icon in the browser address bar.

---

## ⚖️ Legal & Court Admissibility Notes

Slipstats is structured to satisfy statutory requirements under the **South African Maintenance Act 99 of 1998 (Sections 6 & 7)**, **Uniform Rules of Court (Rule 43 & Rule 58)**, and international Family Court financial disclosure rules:
* All uploaded receipts are permanently fingerprinted with **SHA-256 cryptographic hashes**.
* Medical Aid payouts are explicitly subtracted from gross receipts to prove net out-of-pocket necessity.
* The Print / PDF exporter generates a clean, formal document suitable for service by sheriff or presentation at maintenance mediation.

---

## 📄 License
Proprietary — All Rights Reserved. Built for mothers everywhere.
