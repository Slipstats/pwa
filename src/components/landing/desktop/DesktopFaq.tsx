"use client";

import React, { useState } from "react";

export const DesktopFaq: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      question: "Are Slipstats records and PDF bundles admissible in South African Maintenance Courts?",
      answer:
        "Yes. Under Sections 11 and 15 of the Electronic Communications and Transactions (ECT) Act 25 of 2002, electronic data messages and scanned receipts are fully admissible in court. However, under Section 15(3), the court assesses their evidential weight based on reliability, integrity, and presentation. Slipstats formats your data into a court-ready, indexed financial breakdown with client-side SHA-256 cryptographic hashes and standardized Form 4A summaries, structured specifically to assist maintenance officers and magistrates during the Rule 6 financial assessment process under the Maintenance Act 99 of 1998.",
    },
    {
      question: "How does the AI separate child items from my own groceries on a single till slip?",
      answer:
        "Our optical character recognition (OCR) and item classification model scans every line item from South African retailers (Checkers, Woolworths, Pick n Pay, Dis-Chem, Clicks). It flags baby formula, school stationery, pediatric medicines, and nappies as child qualifying, while automatically excluding personal adult groceries (coffee pods, wine, luxury cosmetics). You can adjust any item with a single tap.",
    },
    {
      question: "What happens if my co-parent disputes an expense or refuses to reimburse me?",
      answer:
        "When an expense is contested, Slipstats preserves the dispute log alongside the high-resolution till slip image, tax invoice number, store location, and statutory timestamps. During Rule 6 financial assessment hearings, maintenance officers and magistrates evaluate this chronologically indexed documentary trail rather than unsubstantiated claims.",
    },
    {
      question: "Does Slipstats work if I don't have cellular data or Wi-Fi inside the supermarket?",
      answer:
        "Absolutely. Slipstats is built as an offline-first Progressive Web App (PWA). You can photograph your till slip at the checkout counter and crop it immediately without signal. All data is securely indexed locally on your device and synchronizes to your encrypted cloud vault when you reconnect.",
    },
    {
      question: "How is my children's personal information protected under POPIA?",
      answer:
        "Slipstats enforces strict compliance with the Protection of Personal Information Act 4 of 2013 (POPIA). We apply AES-256 encryption at rest, TLS 1.3 in transit, and do not track minors' locations or sell personal data to marketing bureaus. Your data belongs exclusively to you and can be exported or purged at any time.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-surface border-b border-outline-variant/30">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-fixed/60 text-primary font-label text-xs font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-[16px]">help</span>
            <span>Legal & Practical Clarifications</span>
          </div>
          <h2 className="font-headline font-extrabold text-3xl sm:text-4xl text-on-surface tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-base text-on-surface-variant mt-3 leading-relaxed">
            Everything you need to know about till slip itemization, court admissibility, and settlement split enforcement.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 hover:bg-surface-container/50 transition-colors cursor-pointer"
                >
                  <span className="font-headline font-bold text-sm sm:text-base text-on-surface">
                    {faq.question}
                  </span>
                  <span
                    className={`material-symbols-outlined text-[20px] text-primary transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/20 animate-fadeIn">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
