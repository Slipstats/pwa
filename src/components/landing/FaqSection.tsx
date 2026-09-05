"use client";

import React, { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Are Slipstats till slip schedules legally admissible in South African Maintenance Courts?",
    answer:
      "Yes. Under Sections 11 and 15 of the Electronic Communications and Transactions Act (ECT Act) 25 of 2002, electronic records and data messages are admissible. Section 15(3) requires courts to assess their evidential weight based on reliability, integrity, and presentation. Slipstats formats your data into a court-ready, indexed financial breakdown structured to assist maintenance officers and magistrates during the Rule 6 financial assessment process under the Maintenance Act 99 of 1998, with SHA-256 cryptographic hashes establishing record integrity.",
    category: "Legal Admissibility",
  },
  {
    question: "How does Slipstats prevent disputes over personal groceries (like wine or coffee)?",
    answer:
      "Unlike traditional apps that only record the total till slip amount, Slipstats breaks down grocery slips line by line. Personal items (such as adult alcohol, cigarettes, or personal cosmetics) are excluded with a single tap. The court schedule explicitly shows: Gross Slip Total, Excluded Personal Items, and Admissible Child Qualifying Total. This proves complete transparency and good faith to the magistrate.",
    category: "Till Slip Audit",
  },
  {
    question: "How does medical aid gap tracking work with Discovery Health, Bonitas, or Medihelp?",
    answer:
      "Many co-parents dispute medical expenses by claiming 'medical aid covered it all'. Slipstats calculates the exact cash shortfall: Gross Medical Bill minus Medical Scheme Benefit Paid equals Net Claimable Gap. You can upload both the doctor's invoice and the medical aid claims statement, proving the out-of-pocket payment beyond doubt.",
    category: "Medical Gap",
  },
  {
    question: "Can I use Slipstats completely offline without an internet connection?",
    answer:
      "Yes. Slipstats is engineered as a Progressive Web App (PWA) with a local-first offline architecture. You can snap receipts, audit line items, and record expenses while offline (e.g. in a clinic or shopping mall with weak reception). Your records are securely stored locally on your device and will sync automatically when you reconnect.",
    category: "Offline PWA",
  },
  {
    question: "Is my children's personal information protected under POPIA?",
    answer:
      "Absolutely. Slipstats is built strictly adhering to South Africa's Protection of Personal Information Act (POPIA). Your children's names, ID/medical aid numbers, and financial receipts are encrypted. We never sell or share your data with third parties or data brokers.",
    category: "Data Privacy & POPIA",
  },
  {
    question: "Can I share reports directly with my family attorney or maintenance officer?",
    answer:
      "Yes. You can export court-grade PDF schedules formatted for A4 printing or email them directly to your attorney, advocate, or maintenance officer with all supporting till slip vouchers and hash certificates attached.",
    category: "Court Exports",
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-surface border-b border-outline-variant/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center flex flex-col gap-3 mb-12">
          <span className="font-label text-xs font-bold text-primary tracking-wider uppercase">
            Frequently Asked Questions
          </span>
          <h2 className="font-headline font-extrabold text-2xl sm:text-4xl text-on-surface tracking-tight">
            Legal & Practical Questions Answered.
          </h2>
          <p className="font-body text-base text-on-surface-variant leading-relaxed">
            Everything you need to know about preparing maintenance court claims in South Africa.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="bg-surface-container-low rounded-2xl border border-outline-variant/40 overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-surface-container transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-label text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-container-highest text-primary flex-shrink-0">
                      {faq.category}
                    </span>
                    <h3 className="font-headline text-sm sm:text-base font-bold text-on-surface">
                      {faq.question}
                    </h3>
                  </div>
                  <span
                    className={`material-symbols-outlined text-[22px] text-outline transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/20 pt-3 animate-fadeIn">
                    {faq.answer}
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
