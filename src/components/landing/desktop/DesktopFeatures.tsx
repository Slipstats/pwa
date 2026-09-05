"use client";

import React from "react";

export const DesktopFeatures: React.FC = () => {
  const features = [
    {
      icon: "document_scanner",
      badge: "ECT Act s15 Evidentiary Weight",
      title: "Line-Item Expense Extraction",
      description:
        "Supermarket slips from Checkers, Woolworths, and Pick n Pay are parsed line by line. Adult personal items (coffee pods, wine, luxury cosmetics) are struck out automatically, leaving only verifiable child essentials with verified evidential integrity.",
      highlight: "Prevents unreadable receipts from being set aside",
      badgeColor: "bg-primary-fixed text-primary",
      iconColor: "text-primary",
    },
    {
      icon: "medical_services",
      badge: "Discovery • Bonitas • GEMS",
      title: "Medical Aid Gap Reconciliation",
      description:
        "Match pediatric consultation invoices against scheme claim statements. Slipstats automatically calculates the out-of-pocket shortfall and quantifies your co-parent's court-ordered share with clear line-item substantiation.",
      highlight: "Substantiates unsubmitted copayments clearly",
      badgeColor: "bg-secondary-fixed text-on-secondary-fixed",
      iconColor: "text-secondary",
    },
    {
      icon: "gavel",
      badge: "Rule 6 Financial Assessment",
      title: "Court-Ready Indexed Financial Breakdown",
      description:
        "Generates standardized expenditure summaries structured specifically to assist maintenance officers and magistrates during the Rule 6 financial assessment process under the Maintenance Act 99 of 1998.",
      highlight: "Structured to assist maintenance investigators",
      badgeColor: "bg-primary-fixed text-primary",
      iconColor: "text-primary",
    },
    {
      icon: "pie_chart",
      badge: "Per-Child Apportionment",
      title: "Dynamic Settlement Split Accounting",
      description:
        "Configure custom split ratios per child (50/50, 60/40, or per-category agreements). Track running arrears, partial reimbursements, and payment histories with complete evidentiary transparency.",
      highlight: "Substantiates actual expenditure mathematically",
      badgeColor: "bg-tertiary-fixed text-on-tertiary-fixed",
      iconColor: "text-tertiary",
    },
    {
      icon: "task_alt",
      badge: "Immediate Judicial Clarity",
      title: "Designed For Immediate Review",
      description:
        "Dramatically speeds up review times by providing magistrates and investigators with clear, legible, and chronologically indexed data that stands up to scrutiny under Sections 11 and 15 of the ECT Act 25 of 2002.",
      highlight: "Ensures evidence is readable, complete & chronological",
      badgeColor: "bg-primary-fixed text-primary",
      iconColor: "text-primary",
    },
  ];

  return (
    <section id="features" className="py-20 bg-surface border-b border-outline-variant/30">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-fixed/60 text-primary font-label text-xs font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-[16px]">stars</span>
            <span>Evidentiary Capabilities</span>
          </div>
          <h2 className="font-headline font-extrabold text-3xl sm:text-4xl text-on-surface tracking-tight">
            Engineered For South African Maintenance Law
          </h2>
          <p className="font-body text-base text-on-surface-variant mt-3 leading-relaxed">
            Every feature in Slipstats was designed to satisfy the evidentiary thresholds of
            Magistrate Maintenance Court Form 4A filings and High Court Rule 43 financial disclosure
            mandates.
          </p>
        </div>

        {/* Features Layout: 2 Large Top Cards + 3 Bottom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Top 2 Cards (6 cols each) */}
          {features.slice(0, 2).map((feat, idx) => (
            <div
              key={idx}
              className="md:col-span-6 flex flex-col justify-between p-7 rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center">
                    <span className={`material-symbols-outlined text-[28px] ${feat.iconColor}`}>
                      {feat.icon}
                    </span>
                  </div>
                  <span className={`font-label text-[11px] font-bold px-3 py-1 rounded-full ${feat.badgeColor}`}>
                    {feat.badge}
                  </span>
                </div>
                <h3 className="font-headline font-bold text-xl text-on-surface mb-2.5">
                  {feat.title}
                </h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center gap-2 text-xs font-semibold text-primary">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>{feat.highlight}</span>
              </div>
            </div>
          ))}

          {/* Bottom 3 Cards (4 cols each) */}
          {features.slice(2, 5).map((feat, idx) => (
            <div
              key={idx}
              className="md:col-span-4 flex flex-col justify-between p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-surface-container flex items-center justify-center">
                    <span className={`material-symbols-outlined text-[24px] ${feat.iconColor}`}>
                      {feat.icon}
                    </span>
                  </div>
                  <span className={`font-label text-[10px] font-bold px-2.5 py-0.5 rounded-full ${feat.badgeColor}`}>
                    {feat.badge}
                  </span>
                </div>
                <h3 className="font-headline font-bold text-base text-on-surface mb-2">
                  {feat.title}
                </h3>
                <p className="font-body text-xs text-on-surface-variant leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-outline-variant/20 flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                <span className="material-symbols-outlined text-[15px]">check_circle</span>
                <span>{feat.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
