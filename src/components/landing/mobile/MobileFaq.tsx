"use client";

import React, { useState } from "react";

export const MobileFaq: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      question: "Are Slipstats records admissible in SA Maintenance Courts?",
      answer:
        "Yes. Under Sections 11 & 15 of the ECT Act 25 of 2002, electronic records and scanned receipts are admissible. Section 15(3) assesses evidential weight based on integrity and presentation. Slipstats formats your data into a court-ready, indexed financial breakdown with SHA-256 integrity hashes to assist officers during Rule 6 financial assessments.",
    },
    {
      question: "How does the AI separate child items from my own groceries?",
      answer:
        "Our model scans till slips from Checkers, Woolworths, Pick n Pay, Dis-Chem, and Clicks. It flags baby formula, school items, medicines, and nappies as child qualifying, while automatically excluding personal adult groceries (coffee, wine, cosmetics).",
    },
    {
      question: "What if my co-parent disputes an expense or refuses to pay?",
      answer:
        "Slipstats records the dispute log alongside the high-resolution receipt image, store location, and statutory timestamps. In Rule 6 financial assessment hearings, maintenance officers evaluate this verifiable documentary evidence.",
    },
    {
      question: "Does Slipstats work without cellular signal at the supermarket?",
      answer:
        "Yes. As an offline-first Progressive Web App (PWA), you can take receipt photos at the checkout counter without signal. All slips save locally on your device and sync once you reconnect.",
    },
    {
      question: "How is my children's data protected under POPIA?",
      answer:
        "We enforce strict compliance with POPIA Act 4 of 2013 with AES-256 encryption at rest and TLS 1.3 in transit. We do not track minors' locations or sell personal data to advertisers or credit bureaus.",
    },
  ];

  return (
    <section id="mobile-faq" className="py-14 bg-surface border-b border-outline-variant/30">
      <div className="px-4 flex flex-col gap-6">
        {/* Section Header */}
        <div className="flex flex-col gap-2">
          <span className="self-start font-label text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary-fixed/70 text-primary">
            Legal Clarifications
          </span>
          <h2 className="font-headline font-extrabold text-2xl text-on-surface tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="font-body text-xs text-on-surface-variant leading-relaxed">
            Common questions about till slip itemization and court admissibility.
          </p>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest overflow-hidden shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-4 flex items-center justify-between text-left gap-3 hover:bg-surface-container/50 transition-colors cursor-pointer"
                >
                  <span className="font-headline font-bold text-xs sm:text-sm text-on-surface">
                    {faq.question}
                  </span>
                  <span
                    className={`material-symbols-outlined text-[18px] text-primary transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-on-surface-variant leading-relaxed border-t border-outline-variant/20 animate-fadeIn">
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
