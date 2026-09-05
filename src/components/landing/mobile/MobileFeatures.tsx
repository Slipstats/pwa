"use client";

import React from "react";

export const MobileFeatures: React.FC = () => {
  const features = [
    {
      icon: "document_scanner",
      badge: "ECT Act s15 Evidential Weight",
      title: "Line-Item Expense Extraction",
      description:
        "Parses receipts line by line. Personal adult groceries are automatically excluded with clear audit trails, leaving only verifiable child expenses that meet court clarity standards.",
      highlight: "Prevents unreadable receipts from being set aside",
      badgeColor: "bg-primary-fixed text-primary",
      iconColor: "text-primary",
    },
    {
      icon: "medical_services",
      badge: "Discovery • Bonitas • GEMS",
      title: "Medical Aid Gap Recovery",
      description:
        "Reconciles doctor consults against medical scheme claim statements. Automatically calculates the out-of-pocket shortfall and quantifies your co-parent's share.",
      highlight: "Substantiates unsubmitted copayments clearly",
      badgeColor: "bg-secondary-fixed text-on-secondary-fixed",
      iconColor: "text-secondary",
    },
    {
      icon: "gavel",
      badge: "Rule 6 Financial Assessment",
      title: "Court-Ready Indexed Breakdowns",
      description:
        "Generates standardized expenditure summaries structured specifically to assist maintenance officers and magistrates during the Rule 6 financial assessment process.",
      highlight: "Structured for magistrate and officer review",
      badgeColor: "bg-primary-fixed text-primary",
      iconColor: "text-primary",
    },
    {
      icon: "pie_chart",
      badge: "Per-Child Split Rules",
      title: "Settlement Split Accounting",
      description:
        "Set custom split ratios (50/50, 60/40) per child. Running arrears and historical payments update automatically with full evidentiary transparency.",
      highlight: "Substantiates actual expenditure mathematically",
      badgeColor: "bg-tertiary-fixed text-on-tertiary-fixed",
      iconColor: "text-tertiary",
    },
    {
      icon: "task_alt",
      badge: "Immediate Judicial Clarity",
      title: "Designed For Immediate Review",
      description:
        "Dramatically speeds up review times by providing magistrates and investigators with clear, legible, and chronologically indexed data that stands up to scrutiny under the ECT Act.",
      highlight: "Ensures evidence is readable, complete & chronological",
      badgeColor: "bg-primary-fixed text-primary",
      iconColor: "text-primary",
    },
  ];

  return (
    <section id="mobile-features" className="py-14 bg-surface border-b border-outline-variant/30">
      <div className="px-4 flex flex-col gap-6">
        {/* Section Header */}
        <div className="flex flex-col gap-2">
          <span className="self-start font-label text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary-fixed/70 text-primary">
            Built For SA Law
          </span>
          <h2 className="font-headline font-extrabold text-2xl text-on-surface tracking-tight">
            Evidentiary Automation
          </h2>
          <p className="font-body text-xs text-on-surface-variant leading-relaxed">
            Engineered to fulfill South African Maintenance Act 99 of 1998 standards.
          </p>
        </div>

        {/* Feature Cards Stack */}
        <div className="flex flex-col gap-4">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center">
                  <span className={`material-symbols-outlined text-[22px] ${feat.iconColor}`}>
                    {feat.icon}
                  </span>
                </div>
                <span className={`font-label text-[10px] font-bold px-2.5 py-0.5 rounded-full ${feat.badgeColor}`}>
                  {feat.badge}
                </span>
              </div>

              <div>
                <h3 className="font-headline font-bold text-base text-on-surface">
                  {feat.title}
                </h3>
                <p className="font-body text-xs text-on-surface-variant mt-1 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="pt-2 border-t border-outline-variant/20 flex items-center gap-1.5 text-[11px] font-semibold text-primary">
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
