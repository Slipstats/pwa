"use client";

import React from "react";
import Link from "next/link";
import { LegalModalType } from "../shared/LegalModals";
import { SlipstatsLogo } from "@/components/shared/SlipstatsLogo";

interface DesktopFooterProps {
  onOpenModal: (modal: LegalModalType) => void;
}

export const DesktopFooter: React.FC<DesktopFooterProps> = ({ onOpenModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/40 pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-12">
        {/* Top Multi-Column Grid */}
        <div className="grid grid-cols-12 gap-8">
          {/* Brand & Purpose (5 cols) */}
          <div className="col-span-5 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <SlipstatsLogo className="w-8 h-8" />
              <span className="font-headline font-extrabold text-xl text-primary tracking-tight">
                Slipstats
              </span>
            </Link>
            <p className="font-body text-xs text-on-surface-variant max-w-sm leading-relaxed">
              Forensic child maintenance tracking & till slip allocation Progressive Web App for
              South African mothers. Form 4A & Rule 43 compliant with cryptographic receipt hashing.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Admissible Data Messages (ECT Act 25 of 2002) • Structured for Rule 6 Evidential Weight</span>
            </div>
          </div>

          {/* Navigation Columns (7 cols) */}
          <div className="col-span-7 grid grid-cols-3 gap-6 font-body text-xs">
            {/* Column 1: Platform Features */}
            <div className="flex flex-col gap-3">
              <span className="font-label text-xs font-bold text-on-surface uppercase tracking-wider">
                Product Features
              </span>
              <a href="#till-slip-demo" className="text-on-surface-variant hover:text-primary transition-colors">
                Till Slip Itemization AI
              </a>
              <a href="#features" className="text-on-surface-variant hover:text-primary transition-colors">
                Medical Aid Shortfalls
              </a>
              <a href="#court-standards" className="text-on-surface-variant hover:text-primary transition-colors">
                Form 4A Court Bundles
              </a>
              <a href="#pricing" className="text-on-surface-variant hover:text-primary transition-colors">
                South African Pricing
              </a>
            </div>

            {/* Column 2: Live App Routes */}
            <div className="flex flex-col gap-3">
              <span className="font-label text-xs font-bold text-on-surface uppercase tracking-wider">
                Live App Routes
              </span>
              <Link href="/demo" className="text-on-surface-variant hover:text-primary transition-colors">
                Interactive Demo
              </Link>
              <Link href="/login" className="text-on-surface-variant hover:text-primary transition-colors">
                Sign In / Register
              </Link>
              <Link href="/reports" className="text-on-surface-variant hover:text-primary transition-colors">
                Sample Court Report
              </Link>
              <Link href="/children" className="text-on-surface-variant hover:text-primary transition-colors">
                Settlement Split Rules
              </Link>
            </div>

            {/* Column 3: Legal & Regulatory Popups */}
            <div className="flex flex-col gap-2.5">
              <span className="font-label text-xs font-bold text-on-surface uppercase tracking-wider mb-0.5">
                Legal & Privacy
              </span>
              <button
                type="button"
                onClick={() => onOpenModal("privacy")}
                className="text-left text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center gap-2 py-1 px-2 -ml-2 rounded-lg hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[15px] text-primary">lock</span>
                <span>Privacy Policy</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenModal("terms")}
                className="text-left text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center gap-2 py-1 px-2 -ml-2 rounded-lg hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[15px] text-primary">gavel</span>
                <span>Terms of Service</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenModal("popia")}
                className="text-left text-on-surface-variant hover:text-primary transition-colors cursor-pointer flex items-center gap-2 py-1 px-2 -ml-2 rounded-lg hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[15px] text-primary">verified_user</span>
                <span>POPIA Statutory Notice</span>
              </button>
              <span className="text-[11px] text-on-surface-variant/80 pt-1">
                Maintenance Act 99 of 1998 (Rule 6)
              </span>
            </div>
          </div>
        </div>

        {/* Mandatory Statutory Legal Disclaimer */}
        <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 text-[11px] text-on-surface-variant leading-relaxed">
          <p className="font-semibold text-on-surface mb-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">info</span>
            Mandatory Legal & Statutory Disclaimer:
          </p>
          <p>
            Slipstats is an administrative, organizational, and data-formatting utility designed to
            assist users in structuring their personal financial information. Slipstats is not a law
            firm, does not provide legal advice, and does not replace the counsel of a qualified legal
            practitioner. The use of this software does not guarantee any specific outcome, speed of
            adjudication, or the acceptance/endorsement of submitted data by any maintenance court,
            maintenance officer, or judicial official. The burden of ensuring data accuracy and
            compliance with court evidentiary rules rests entirely on the user. Formatted in alignment
            with the South African Maintenance Act 99 of 1998 and High Court Uniform Rule 43.
          </p>
        </div>

        {/* Bottom Copyright & Scroll to Top */}
        <div className="pt-6 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-on-surface-variant">
          <span>
            © {new Date().getFullYear()} Slipstats (Pty) Ltd. All rights reserved. - Developed and Managed by{" "}
            <a
              href="https://www.digitalspaces.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold transition-colors"
            >
              Digital Spaces
            </a>
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenModal("privacy")}
                className="px-2 py-1 rounded-md hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
              >
                Privacy
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => onOpenModal("terms")}
                className="px-2 py-1 rounded-md hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
              >
                Terms
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => onOpenModal("popia")}
                className="px-2 py-1 rounded-md hover:bg-surface-container hover:text-primary transition-colors cursor-pointer"
              >
                POPIA
              </button>
            </div>

            <div className="h-4 w-[1px] bg-outline-variant/50 hidden sm:block" />

            {/* Scroll to Top Button (Bottom Right in Footer) */}
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll to top of page"
              className="h-9 px-3.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface hover:text-primary font-bold text-xs flex items-center gap-1.5 shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer group"
            >
              <span className="material-symbols-outlined text-[16px] text-primary group-hover:-translate-y-0.5 transition-transform">
                arrow_upward
              </span>
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
