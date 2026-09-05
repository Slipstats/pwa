import React from "react";
import Link from "next/link";

export const CourtComplianceSection: React.FC = () => {
  const complianceFeatures = [
    {
      icon: "gavel",
      title: "Maintenance Act 99 of 1998 (Form 4A)",
      description:
        "Specifically structured for Section 6 applications and Section 10 enquiries. Itemizes reasonable child needs into statutory categories accepted by Maintenance Officers across South Africa.",
      badge: "Statutory Standard",
    },
    {
      icon: "balance",
      title: "High Court Rule 43 Affidavits",
      description:
        "Generates clean financial disclosure schedules and annexures required for urgent interim child maintenance pending High Court divorce or matrimonial action.",
      badge: "High Court Grade",
    },
    {
      icon: "fingerprint",
      title: "Cryptographic SHA-256 Hashing",
      description:
        "Every receipt photo is hashed on-device using native Web Crypto API before storage. Produces an immutable 64-character digital fingerprint proving zero image doctoring.",
      badge: "Forensic Integrity",
    },
    {
      icon: "menu_book",
      title: "Arrears Statement of Account",
      description:
        "Maintains an ongoing debit/credit audit trail of owed contributions vs settled amounts, preventing disputes over historical maintenance arrears under Section 26.",
      badge: "Section 26 Proof",
    },
  ];

  return (
    <section id="court-compliance" className="py-16 md:py-24 bg-surface border-b border-outline-variant/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-3 mb-14">
          <span className="font-label text-xs font-bold text-primary tracking-wider uppercase">
            Judicial Admissibility Standards
          </span>
          <h2 className="font-headline font-extrabold text-2xl sm:text-4xl text-on-surface tracking-tight">
            Built for Magistrates, Not Just Spreadsheets.
          </h2>
          <p className="font-body text-base text-on-surface-variant leading-relaxed">
            Saves your case from being stalled or unread. Maintenance courts are overwhelmed;
            presenting messy, unindexed chats or unquantified receipts risks having your evidence
            set aside or deprioritised by overextended officers. Slipstats formats your data into a
            court-ready, indexed financial breakdown—generating standardized expenditure summaries
            structured specifically to assist maintenance officers and magistrates during the Rule 6
            financial assessment process, designed for immediate clarity.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {complianceFeatures.map((feat) => (
            <div
              key={feat.title}
              className="bg-surface-container-low rounded-3xl border border-outline-variant/40 p-6 sm:p-7 shadow-xs flex flex-col justify-between gap-4 transition-all hover:border-outline-variant hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[26px]">{feat.icon}</span>
                </div>
                <span className="font-label text-[10px] font-bold px-2.5 py-1 rounded-full bg-surface-container-highest text-on-surface-variant border border-outline-variant/30">
                  {feat.badge}
                </span>
              </div>

              <div>
                <h3 className="font-headline text-lg font-bold text-on-surface tracking-tight mb-2">
                  {feat.title}
                </h3>
                <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="pt-2 border-t border-outline-variant/30 flex items-center gap-1.5 text-xs font-semibold text-primary">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Admissible in Randburg, Wynberg, Durban & Pretoria</span>
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Exhibit Bundle Card */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-surface-container-lowest via-surface-container-low to-primary-fixed/20 border border-outline-variant/40 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="font-label text-xs font-bold text-primary uppercase">
              1-Click Court Exhibit Compilation
            </span>
            <h3 className="font-headline text-xl sm:text-2xl font-bold text-on-surface">
              Export Form 4A Exhibit Schedule with Hash Receipts
            </h3>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Instantly generate an A4 court-formatted PDF schedule itemizing gross receipts, excluded
              personal items, medical gap reconciliations, and SHA-256 receipt hashes ready to serve
              on the respondent or maintenance clerk.
            </p>
          </div>

          <Link
            href="/reports"
            className="w-full sm:w-auto h-12 px-7 rounded-2xl bg-primary hover:bg-primary-container text-white font-headline text-sm font-bold shadow-md flex items-center justify-center gap-2 flex-shrink-0 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">gavel</span>
            <span>View Sample Court Exhibit</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
