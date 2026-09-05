"use client";

import React, { useEffect } from "react";

export type LegalModalType = "privacy" | "terms" | "popia" | null;

interface LegalModalsProps {
  activeModal: LegalModalType;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  // Close on Escape key press
  useEffect(() => {
    if (!activeModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeModal, onClose]);

  if (!activeModal) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 bg-surface-container-low/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">
                {activeModal === "privacy" && "lock"}
                {activeModal === "terms" && "gavel"}
                {activeModal === "popia" && "verified_user"}
              </span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-base sm:text-lg text-on-surface">
                {activeModal === "privacy" && "Privacy Policy"}
                {activeModal === "terms" && "Terms of Service"}
                {activeModal === "popia" && "POPIA Statutory Notice"}
              </h3>
              <p className="font-label text-[11px] text-on-surface-variant">
                Slipstats Legal & Compliance Standards • Republic of South Africa
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body with Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-4 font-body text-xs sm:text-sm text-on-surface-variant leading-relaxed">
          {activeModal === "privacy" && (
            <>
              <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/40 text-[11px] leading-relaxed">
                <span className="font-bold text-on-surface">Statutory Compliance Framework: </span>
                Protection of Personal Information Act 4 of 2013 (POPIA) &amp; Electronic Communications and Transactions Act 25 of 2002 (ECT Act).
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-sm mb-1">1. Information We Collect &amp; Data Minimization</h4>
                <p>
                  Slipstats collects only data essential for administrative expense tracking and structuring: till slip receipt images, OCR itemized lines, child first names, date of birth / school grade, and settlement agreement split percentages. Slipstats does not sell, rent, or disclose personal information to commercial third parties, advertisers, or credit bureaus.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-sm mb-1">2. Cryptographic Integrity under ECT Act Section 15(3)</h4>
                <p>
                  Under Section 15(3) of the ECT Act 25 of 2002, the evidential weight of data messages depends on the reliability and integrity of the manner in which information was generated, stored, or communicated. Uploaded receipt images are stamped client-side with SHA-256 cryptographic hashes to establish tamper-evident record integrity.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-sm mb-1">3. Offline-First Storage &amp; Security Safeguards</h4>
                <p>
                  Receipts and expense records are stored locally on your device via Progressive Web App IndexedDB. Cloud synchronization is secured with TLS 1.3 in transit and AES-256 encryption at rest.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-sm mb-1">4. Data Subject Rights (POPIA Section 18)</h4>
                <p>
                  In terms of Section 18 and Chapter 3 of POPIA, you have the right to request access to, correction of, or permanent deletion of your personal and child data at any time from your account settings.
                </p>
              </div>
            </>
          )}

          {activeModal === "terms" && (
            <>
              {/* Mandatory General Disclaimer Text (Verbatim from Framework Section 4) */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-on-surface leading-relaxed">
                <p className="font-bold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">gavel</span>
                  Mandatory Legal Disclaimer &amp; Risk Notice:
                </p>
                <p className="italic">
                  Slipstats is an administrative, organizational, and data-formatting utility designed to assist users in structuring their personal financial information. Slipstats is not a law firm, does not provide legal advice, and does not replace the counsel of a qualified legal practitioner. The use of this software does not guarantee any specific outcome, speed of adjudication, or the acceptance/endorsement of submitted data by any maintenance court, maintenance officer, or judicial official. The burden of ensuring data accuracy and compliance with court evidentiary rules rests entirely on the user.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-on-surface text-sm mb-1">1. Scope of Utility Service</h4>
                <p>
                  Slipstats provides software engines for till slip optical line-item extraction, calculation of settlement splits, and generation of structured expenditure summaries aligned with the South African Maintenance Act 99 of 1998 and High Court Uniform Rule 43.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-sm mb-1">2. Legal Burden of Proof (Maintenance Act Rule 6)</h4>
                <p>
                  Rule 6 of the Maintenance Act 99 of 1998 empowers Maintenance Officers to investigate complaints; however, the practical burden of proof rests entirely on the litigant to substantiate income and expenditure. Maintenance courts retain full discretion to reject unreadable, unindexed, or unquantified electronic submissions if they fail to meet minimum clarity requirements.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-sm mb-1">3. Electronic Evidence &amp; Evidential Weight (ECT Act Sections 11 &amp; 15)</h4>
                <p>
                  Under Sections 11 and 15 of the Electronic Communications and Transactions (ECT) Act 25 of 2002, data messages and electronic records are admissible in legal proceedings. However, Section 15(3) mandates that the court assesses their evidential weight based on reliability, integrity, and how the information was archived and presented. Slipstats assists by indexing data chronologically and calculating SHA-256 digests, but evidential weight is determined exclusively by the presiding judicial officer.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-sm mb-1">4. Judicial Scrutiny &amp; Discretion</h4>
                <p>
                  Magistrates cannot legally delegate or bypass their duty to evaluate evidence. Every financial submission is subject to cross-examination by the opposing party. No software tool can bypass this statutory process.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-sm mb-1">5. User Responsibility for Data Accuracy</h4>
                <p>
                  The user warrants that all receipt uploads, amounts, and category allocations represent bona fide child maintenance expenses. The burden of ensuring data accuracy and compliance with court evidentiary rules rests entirely on the user.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-sm mb-1">6. Memberships, Paystack Billing &amp; Cancellation</h4>
                <p>
                  Users may evaluate the platform using the interactive demonstration sandbox prior to subscribing. Paid memberships renew monthly or annually in South African Rand (ZAR) processed securely via Paystack (supporting Capitec Pay, Instant EFT, and Visa/Mastercard) and may be cancelled online at any time without penalty or notice periods.
                </p>
              </div>
            </>
          )}

          {activeModal === "popia" && (
            <>
              <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/40 text-[11px] leading-relaxed">
                <span className="font-bold text-on-surface">Statutory Notice: </span>
                Issued in terms of Section 18 of the Protection of Personal Information Act 4 of 2013 (POPIA).
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-sm mb-1">1. Processing of Minor Children's Information (Sections 34 &amp; 35)</h4>
                <p>
                  In terms of Section 34 and 35 of POPIA, the processing of personal information concerning children is prohibited unless carried out with the prior consent of a competent person (parent or legal guardian) or permitted by law. Slipstats processes minor beneficiary first names, age categories, and school expenses strictly on the authorization of the parent or legal guardian for the purpose of substantiating maintenance claims under Rule 6 of the Maintenance Act 99 of 1998.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-sm mb-1">2. Purpose Specification</h4>
                <p>
                  Personal data is processed exclusively for: (a) itemizing child-specific expenditures from till slips, (b) computing proportional co-parent split obligations under settlement agreements, and (c) generating indexed financial summaries to assist maintenance officers during Rule 6 financial assessments.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-sm mb-1">3. Record Integrity &amp; Security Safeguards</h4>
                <p>
                  Data messages and till slip records are archived in compliance with Section 15(3) of the Electronic Communications and Transactions Act 25 of 2002 to maintain data reliability, chronological traceability, and tamper evidence.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-sm mb-1">4. Information Regulator Notice</h4>
                <p>
                  You have the right to lodge a complaint with the Information Regulator of South Africa (inforeg@justice.gov.za | JD House, 27 Stiemens Street, Braamfontein, Johannesburg) if you believe your personal information has been processed unlawfully.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-surface-container-low border-t border-outline-variant/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors shadow-xs"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
