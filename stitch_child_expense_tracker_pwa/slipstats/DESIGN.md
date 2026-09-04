---
name: Slipstats
colors:
  surface: '#f6fafb'
  surface-dim: '#d6dbdc'
  surface-bright: '#f6fafb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f4f5'
  surface-container: '#eaefef'
  surface-container-high: '#e5e9ea'
  surface-container-highest: '#dfe3e4'
  on-surface: '#171c1d'
  on-surface-variant: '#404849'
  inverse-surface: '#2c3132'
  inverse-on-surface: '#edf1f2'
  outline: '#70797a'
  outline-variant: '#c0c8c9'
  surface-tint: '#36656c'
  primary: '#0a4146'
  on-primary: '#ffffff'
  primary-container: '#28585e'
  on-primary-container: '#9dcdd3'
  inverse-primary: '#9fcfd6'
  secondary: '#426655'
  on-secondary: '#ffffff'
  secondary-container: '#c4ecd6'
  on-secondary-container: '#486c5a'
  tertiary: '#572c44'
  on-tertiary: '#ffffff'
  tertiary-container: '#71435c'
  on-tertiary-container: '#efb3d1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#baebf2'
  primary-fixed-dim: '#9fcfd6'
  on-primary-fixed: '#001f23'
  on-primary-fixed-variant: '#1c4d53'
  secondary-fixed: '#c4ecd6'
  secondary-fixed-dim: '#a9cfba'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#2b4e3e'
  tertiary-fixed: '#ffd8e9'
  tertiary-fixed-dim: '#f2b5d3'
  on-tertiary-fixed: '#330e24'
  on-tertiary-fixed-variant: '#653951'
  background: '#f6fafb'
  on-background: '#171c1d'
  surface-variant: '#dfe3e4'
typography:
  display-lg:
    fontFamily: plusJakartaSans
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: plusJakartaSans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: plusJakartaSans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: plusJakartaSans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  title-md:
    fontFamily: plusJakartaSans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-md:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.015em
  body-sm:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-lg:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  currency-lg:
    fontFamily: inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  currency-md:
    fontFamily: inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.25rem
  space-xl: 1.5rem
  space-2xl: 2rem
  space-3xl: 2.5rem
  pwa-nav-height: 4.5rem
  pwa-fab-size: 3.5rem
  screen-edge-padding: 1rem
---

## Brand & Style

This design system delivers an empathetic, legally robust experience tailored for mothers navigating child-related expense tracking, reimbursement requests, and court disclosures during or after a divorce. The interface balances tender emotional reassurance with uncompromising financial and legal authority. It must feel like an organized, calm paralegal combined with a secure vault—dissolving the acute anxiety of co-parenting transactions into serene, systematic clarity.

The aesthetic fuses **Material 3 Expressive** with clinical financial restraint:
- **Tonal Reassurance:** Generous use of tinted surface tiers (`surface`, `surface-container-low`, `surface-container-high`) replaces clinical stark white, reducing visual strain during stressful late-night logging.
- **Auditable Precision:** Crisp alignment, tabular numerical clarity, clear visual paper trails, and unassailable categorization give every logged receipt immediate legal credibility.
- **Protective Softness:** Deep, calm mineral tones paired with sweeping curves (`rounded-2xl` to `rounded-3xl`) soften the friction of hostile communication without sacrificing the gravity required for courtroom exhibits.

## Colors

The palette establishes a restorative, focused atmosphere using deep oceanic slate teal alongside grounding botanical sage and guarded rose-mauve accents.

### Palette Roles & M3 Mappings

- **Primary (`#28585E` - Deep Slate Teal):** Serves as the anchor of trust, utilized for primary calls-to-action, active bottom bar items, major category headers, and export actions. Evokes stability, privacy, and permanence.
  - *On-Primary:* `#FFFFFF`
  - *Primary Container:* `#CBECEF`
  - *On-Primary Container:* `#06373C`
- **Secondary (`#567A68` - Reassuring Sage):** Conveys shared custody harmony, cleared receipts, resolved requests, and positive financial balance.
  - *On-Secondary:* `#FFFFFF`
  - *Secondary Container:* `#D9E6DD`
  - *On-Secondary Container:* `#143525`
- **Tertiary (`#905E78` - Muted Rose Gold / Heather Mauve):** Identifies child-specific milestones, extracurricular tracking, and non-mandatory or disputed items. Separates personal discretionary notes from core legally mandated child support.
  - *On-Tertiary:* `#FFFFFF`
  - *Tertiary Container:* `#FCDAE8`
  - *On-Tertiary Container:* `#3B1B2B`
- **Neutral & Surface Tonal Architecture:**
  - *Surface Base:* `#F6F9F9` (Subtly tinted cold-porcelain white to reduce screen glare)
  - *Surface Dim:* `#EAEFEF`
  - *Surface Container Low:* `#F0F4F4` (Base card backgrounds)
  - *Surface Container:* `#E7ECEC` (Grouped modules and list wrappers)
  - *Surface Container High:* `#DFE4E4` (Active filters, search bars)
  - *Surface Container Highest:* `#D6DBDB` (Divider lines, unselected pill chips)
  - *On-Surface:* `#161D1E` (High-contrast slate for uncompromised readability)
  - *On-Surface Variant:* `#404849` (Labels, metadata, timestamps)
  - *Outline / Ghost Border:* `#707879` at 20% opacity (`rgba(112, 120, 121, 0.2)`)

### Semantic Indicators
- **Success (`#1B6D4F` / Mint Green):** Reimbursed, approved by other parent, reconciled.
- **Warning (`#9C6000` / Honey Amber):** Payment overdue, missing split ratio, unassigned receipt.
- **Pending (`#6F5299` / Iris Purple):** Awaiting parent review, mediation queue, pending bank sync.
- **Destructive (`#BA1A1A` / Crimson):** Disputed expense, deleted line item, legal flag.

## Typography

The type scale combines **Plus Jakarta Sans** for titles and structural sectioning with **Inter** for dense tabular ledgers, dates, and microcopy.

### Tabular & Numerical Standards
- All expense entries, ledger sums, currency tickers, and date columns must strictly enable `font-feature-settings: "tnum" 1, "cv05" 1`. This prevents column jiggle during scrolling and facilitates seamless vertical comparison across ledger items.
- Line items are set with clear optical tracking: labels use `0.02em` to `0.04em` letter-spacing to ensure small-text legibility under stressful, fast-scanning environments.

### Hierarchy Guidelines
- `display-lg` is restricted to high-level monthly aggregate totals and account balance summaries on primary dashboards.
- `headline-lg` / `headline-md` establish clear boundaries between expense segments (e.g., "Medical & Healthcare", "Tuition & Schooling", "Unreimbursed Shared Arrears").
- `label-sm` is rendered in uppercase with deliberate tracking (`tracking-wider`) for court-exhibit tags (e.g., `EXHIBIT B`, `REIMBURSED 50%`, `INCURRED`).

## Layout & Spacing

The layout is built mobile-first, targeting the standard modern smartphone viewport width (390px–428px) with strict safe-area insets (`env(safe-area-inset-bottom)`).

### Grid & Density Rules
- **Viewport Boundaries:** Fixed `16px` (`space-md`) horizontal gutters on phone screens up to 480px.
- **Card Spacing:** `12px` (`space-sm`) gaps between list records; `16px` to `20px` internal padding inside composite cards.
- **Touch Targets:** Absolute minimum touch area is `48px × 48px` on all tap targets (interactive badges, icon triggers, checkboxes, quick-edit dots), matching Android M3 and iOS HIG accessibility baselines.
- **Bottom Navigation Clearance:** Main content containers must maintain a persistent bottom padding of `calc(4.5rem + env(safe-area-inset-bottom) + 1rem)` to ensure that the persistent floating action button and bottom navigation bar never obscure actionable data or confirmation actions.
- **Desktop/Tablet Reflow:** For tablet and desktop screens (such as attorney review portals or desktop exports), the content transitions into a centered 768px single column or a 12-column split-pane layout (left: chronological audit stream; right: live PDF document inspector).

## Elevation & Depth

This system avoids heavy drop shadows, instead using Material Design 3's tonal surface hierarchy, ambient color diffusion, and ghost borders to denote stack order.

### Tonal Tiers
1. **Level 0 (App Canvas):** `surface` (`#F6F9F9`). Flat canvas ground, no shadow.
2. **Level 1 (Feed & Ledger Cards):** `surface-container-low` (`#F0F4F4`) paired with an ambient tinted shadow:
   - `box-shadow: 0 1px 3px 0 rgba(40, 88, 94, 0.04), 0 1px 2px -1px rgba(40, 88, 94, 0.02)`
   - Border: `1px solid rgba(112, 120, 121, 0.12)`
3. **Level 2 (Active/Pressed Cards, Bottom Sheets):** `surface-container` (`#E7ECEC`):
   - `box-shadow: 0 4px 12px -2px rgba(40, 88, 94, 0.08), 0 2px 6px -2px rgba(40, 88, 94, 0.04)`
4. **Level 3 (Floating Action Button & Dropdown Menus):** `primary-container` (`#CBECEF`):
   - `box-shadow: 0 8px 24px -4px rgba(6, 55, 60, 0.16), 0 4px 8px -2px rgba(6, 55, 60, 0.08)`
5. **Level 4 (Modals & Full-Screen Receipt Zoom):** Backed by scrim `rgba(22, 29, 30, 0.48)` with `backdrop-filter: blur(8px)`.

### Tactile Feedback
Interactive cards employ a subtle translation scale on touch: `transform: scale(0.99)` with `transition: transform 120ms cubic-bezier(0.2, 0, 0, 1)`.

## Shapes

The design system uses deliberate, generous curvature based on Material 3 Expressive standards to communicate protection, care, and accessibility.

- **Primary Cards & Containers:** `rounded-2xl` (16px) to `rounded-3xl` (24px). Primary expense tiles and ledger groups feature smooth 20px corners, softening financial data presentation.
- **Pills & Chips:** Fully rounded `rounded-full` (9999px) for search filters, category tags (e.g., "Pediatrician", "Daycare", "Soccer"), split calculation tags (50/50, 70/30), and status indicators.
- **Buttons:**
  - Full-width CTA buttons: `rounded-full` for welcoming softness.
  - Floating Action Button (FAB): `rounded-2xl` (16px) conforming to M3 Expressive squircle geometry.
- **Bottom Navigation Surface:** Top corners are rounded at `rounded-t-3xl` (24px), subtly lifting the navigation bar over the scroll area.
- **Inputs & Fields:** `rounded-xl` (12px) interior curvature with clear `2px` focus rings in `#28585E`.

## Components

### 1. Buttons
- **Primary Filled Button:** Background `#28585E`, text `#FFFFFF`, height `48px`, `rounded-full`, typography `label-lg`. Padding: `0 24px`. Hover/pressed state: overlays 8% white ripple.
- **Tonal Button (Secondary Action):** Background `#D9E6DD`, text `#143525`, height `44px`, `rounded-full`, typography `label-md`. Used for "Add Split", "Upload Another Receipt", "Save Draft".
- **Floating Action Button (M3 FAB):** Fixed lower-right (`bottom: calc(5rem + env(safe-area-inset-bottom))`, `right: 1.25rem`). Size `56px × 56px`, `rounded-2xl`, background `#CBECEF`, icon `#06373C` (24px plus-camera glyph). Triggers instant expense capture.

### 2. Expense Ledger Cards
- **Structure:** Encased in `surface-container-low` (`#F0F4F4`), `rounded-2xl`, padding `16px`.
- **Top Row:** Left: Category pill chip (`rounded-full`, 8px height padding, micro-icon + text). Right: Expense date in `body-sm` (`#404849`).
- **Middle Row:** Left: Merchant/Title in `headline-sm` with subtext child name ("For: Maya"). Right: Total amount in `currency-md` tabular text.
- **Bottom Status Rail:** Visual progress indicator showing "Split: 50% You ($42.50) / 50% Co-Parent ($42.50)", terminated with an M3 semantic status pill (e.g., `Paid`, `Awaiting Receipt Confirmation`, `Court Exhibit Attached`).

### 3. Pill Chips & Status Badges
- **Category Filter Chips:** Horizontal scrolling carousel. Inactive: `surface-container-high` background, `body-sm` text. Active: `primary` background (`#28585E`), white text, leading checkmark.
- **Status Badges:** `rounded-full`, uppercase `label-sm`, padding `4px 10px`:
  - *Pending Reimbursal:* `#F3EBF9` bg, `#6F5299` text.
  - *Settled:* `#E6F5EC` bg, `#1B6D4F` text.
  - *Contested:* `#FDE8E8` bg, `#BA1A1A` text.

### 4. Input Fields
- Form inputs follow M3 filled or outlined container specs with persistent floating labels.
- Background `surface-container-highest` at 40% opacity, border `1px solid rgba(112, 120, 121, 0.3)`. Active focus transition activates a `2px solid #28585E` outline.
- Currency inputs automatically render prefix (`$`) locked in place with tabular font alignment for rapid single-handed thumb typing.

### 5. Checkboxes & Selection Controls
- Checkbox size `22px × 22px` with `rounded-md` (6px) corners.
- Unchecked: `2px solid #707879`. Checked: filled with `#28585E`, white checkmark vector.
- Used prominently in the "Batch Export for Legal Counsel" view to assemble court-ready PDFs.

### 6. M3 Bottom Navigation Bar
- Height `72px` + safe-area inset. Background `#F0F4F4` with a subtle top border `1px solid rgba(112, 120, 121, 0.12)`.
- 4 Destinations:
  1. **Ledger** (Receipt list icon)
  2. **Balances** (Split balance scale icon)
  3. **Export/Reports** (Folder with legal gavel / stamp icon)
  4. **Settings/Custody Split** (Shield icon)
- Active indicator: Tonal pill backdrop (`#CBECEF`, `rounded-full`, `64px × 32px`) enclosing the active teal icon, paired with `label-sm` in bold slate.

### 7. Specialized Domain Component: "Court-Ready Exhibit Generator" Card
- High-trust utility component. Visualizes instant PDF export parameters: includes certified timestamp, cryptographic hash of uploaded receipts, co-parent notification status, and unreimbursed statutory totals. Styled with a crisp `#28585E` dashed-accent border and a tertiary button for legal review.