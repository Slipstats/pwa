"use client";

import React from "react";
import Link from "next/link";
import { LegalModalType } from "../shared/LegalModals";
import { SlipstatsLogo } from "@/components/shared/SlipstatsLogo";

interface MobileFooterProps {
  onOpenModal: (modal: LegalModalType) => void;
}

export const MobileFooter: React.FC<MobileFooterProps> = ({ onOpenModal }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/40 pt-10 pb-12">
      <div className="px-4 flex flex-col gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-2.5">
          <Link href="/" className="flex items-center gap-2">
            <SlipstatsLogo className="w-7 h-7" />
            <span className="font-headline font-extrabold text-lg text-primary tracking-tight">
              Slipstats
            </span>
          </Link>
          <p className="font-body text-xs text-on-surface-variant leading-relaxed">
            Forensic child maintenance tracking & till slip allocation Progressive Web App for South African mothers.
          </p>
        </div>

        {/* Legal Popups Direct Action Buttons */}
        <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-xs flex flex-col gap-2">
          <span className="font-label text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            Statutory & Legal Information
          </span>
          <div className="flex flex-col gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => onOpenModal("privacy")}
              className="w-full py-2 px-2.5 rounded-xl hover:bg-surface-container text-left text-xs font-semibold text-on-surface flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary">lock</span>
                Privacy Policy
              </span>
              <span className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenModal("terms")}
              className="w-full py-2 px-2.5 rounded-xl hover:bg-surface-container text-left text-xs font-semibold text-on-surface flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary">gavel</span>
                Terms of Service
              </span>
              <span className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenModal("popia")}
              className="w-full py-2 px-2.5 rounded-xl hover:bg-surface-container text-left text-xs font-semibold text-on-surface flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
                POPIA Statutory Notice
              </span>
              <span className="material-symbols-outlined text-[16px] text-outline">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Quick App Navigation Links */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <Link
            href="/demo"
            className="p-2.5 rounded-xl bg-surface-container text-on-surface font-semibold flex items-center justify-between"
          >
            <span>Live Demo</span>
            <span className="material-symbols-outlined text-[16px]">bolt</span>
          </Link>
          <Link
            href="/login"
            className="p-2.5 rounded-xl bg-surface-container text-on-surface font-semibold flex items-center justify-between"
          >
            <span>Sign In</span>
            <span className="material-symbols-outlined text-[16px]">login</span>
          </Link>
          <Link
            href="/reports"
            className="p-2.5 rounded-xl bg-surface-container text-on-surface font-semibold flex items-center justify-between"
          >
            <span>Court Report</span>
            <span className="material-symbols-outlined text-[16px]">description</span>
          </Link>
          <Link
            href="/children"
            className="p-2.5 rounded-xl bg-surface-container text-on-surface font-semibold flex items-center justify-between"
          >
            <span>Family Splits</span>
            <span className="material-symbols-outlined text-[16px]">family_restroom</span>
          </Link>
        </div>

        {/* Mandatory Statutory Legal Disclaimer */}
        <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/30 text-[10px] text-on-surface-variant leading-relaxed">
          <p className="font-semibold text-on-surface mb-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-primary">info</span>
            Mandatory Statutory Disclaimer:
          </p>
          <p>
            Slipstats is an administrative, organizational, and data-formatting utility designed to assist users in structuring their personal financial information. Slipstats is not a law firm, does not provide legal advice, and does not replace the counsel of a qualified legal practitioner. The use of this software does not guarantee any specific outcome, speed of adjudication, or the acceptance/endorsement of submitted data by any maintenance court, maintenance officer, or judicial official. The burden of ensuring data accuracy and compliance with court evidentiary rules rests entirely on the user. Maintenance Act 99 of 1998 • Rule 43.
          </p>
        </div>

        {/* Copyright & Scroll to Top */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-outline-variant/20">
          <div className="text-[11px] text-on-surface-variant leading-relaxed">
            © {new Date().getFullYear()} Slipstats (Pty) Ltd. All rights reserved. - Developed and Managed by{" "}
            <a
              href="https://www.digitalspaces.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold transition-colors"
            >
              Digital Spaces
            </a>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top of page"
            className="h-8.5 px-3 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-on-surface hover:text-primary font-bold text-[11px] flex items-center gap-1 shrink-0 shadow-2xs active:scale-95 transition-all cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[15px] text-primary group-hover:-translate-y-0.5 transition-transform">
              arrow_upward
            </span>
            <span>Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
