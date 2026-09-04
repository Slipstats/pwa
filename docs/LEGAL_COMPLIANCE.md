# ⚖️ Family Court & Maintenance Act Compliance Guide

## 1. Statutory Context
In South African family law (and common-law jurisdictions globally), child maintenance claims are governed by:
* **Maintenance Act 99 of 1998**: Sections 6 (Application for maintenance order) and 7 (Investigation into maintenance).
* **Uniform Rules of Court — Rule 43 (High Court) & Rule 58 (Magistrates Court)**: Applications for interim maintenance pending divorce.
* **Family Court Form 4A**: Standardized schedule of income and expenditure for maintenance claims.

---

## 2. Overcoming Traditional Evidentiary Pitfalls
Mothers frequently face hostility and dismissed claims in maintenance court due to three common administrative errors:

| Common Evidentiary Pitfall | How Slipstats Solves It |
| :--- | :--- |
| **"Crumpled Shoebox" Syndrome**: Submitting faded, unindexed grocery till slips that maintenance officers refuse to tally. | Slipstats produces an **indexed, numbered Exhibit Schedule** (e.g. Exhibit 01, Exhibit 02) with clear dates, itemized descriptions, and totals. |
| **The "Groceries vs Child" Dispute**: Co-parent claims that supermarket receipts contain personal luxuries for the mother. | Slipstats’ **AI Slip Itemizer** enables excluding personal items (e.g. coffee, personal cosmetics), producing a certified net child amount with transparent math. |
| **The "Double-Recovery" Accusation**: Claiming 50% of a doctor's bill from the father after Medical Aid has already paid. | Dedicated **Medical Aid Gap Reconciliation** records the gross bill, subtracts the medical aid reimbursement, and claims strictly the net shortfall. |

---

## 3. Cryptographic Receipt Integrity (SHA-256)
To prevent allegations of digital alteration or forged invoices:
1. Every receipt uploaded generates a unique **SHA-256 cryptographic checksum** (e.g., `9f83a73c9e1b2f0a...`).
2. The hash is printed directly on the Court Exhibit Schedule alongside the statutory timestamp.
3. In court, any attorney or magistrate can verify that the digital image presented has not been modified since the date of recording.

---

## 4. Standard Form 4A & Rule 43 Export
The `/reports` screen generates a court-ready document with:
* Full applicant and respondent case details.
* Prescribed categories matching Form 4A:
  * Housing & Accommodation
  * Groceries & Hygiene
  * Schooling, Books & Uniforms
  * Medical, Dental & Pharmacy
  * Extramural Activities & Sports
* Statutory certification and affidavit signature block.
