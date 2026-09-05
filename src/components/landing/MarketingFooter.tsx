import React from "react";
import Image from "next/image";
import Link from "next/link";

export const MarketingFooter: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/40 pt-12 pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand & Mission (5 cols) */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-fixed flex items-center justify-center p-1 border border-primary-fixed-dim/40 shadow-xs">
                <Image
                  src="/images/logo.png"
                  alt="Slipstats Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <span className="font-headline font-extrabold text-xl text-primary tracking-tight">
                Slipstats
              </span>
            </Link>
            <p className="font-body text-xs sm:text-sm text-on-surface-variant max-w-sm leading-relaxed">
              Court-grade child expense tracker and forensic till slip allocation PWA for South
              African mothers. Form 4A & Rule 43 compliant with cryptographic receipt hashing.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-primary pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Admissible across South African Maintenance Courts</span>
            </div>
          </div>

          {/* Navigation Links (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 font-body text-xs">
            <div className="flex flex-col gap-2.5">
              <span className="font-label text-xs font-bold text-on-surface uppercase tracking-wider">
                Product Features
              </span>
              <a href="#till-slip-audit" className="text-on-surface-variant hover:text-primary transition-colors">
                Till Slip Itemization AI
              </a>
              <a href="#medical-shortfall" className="text-on-surface-variant hover:text-primary transition-colors">
                Medical Aid Shortfalls
              </a>
              <a href="#court-compliance" className="text-on-surface-variant hover:text-primary transition-colors">
                Form 4A Exhibit Bundles
              </a>
              <a href="#calculator" className="text-on-surface-variant hover:text-primary transition-colors">
                Maintenance Calculator
              </a>
            </div>

            <div className="flex flex-col gap-2.5">
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

            <div className="flex flex-col gap-2.5">
              <span className="font-label text-xs font-bold text-on-surface uppercase tracking-wider">
                Legal & Security
              </span>
              <span className="text-on-surface-variant">Maintenance Act 99/1998</span>
              <span className="text-on-surface-variant">High Court Rule 43</span>
              <span className="text-on-surface-variant">POPIA Compliant</span>
              <span className="text-on-surface-variant">SHA-256 Web Crypto</span>
            </div>
          </div>
        </div>

        {/* Mandatory Statutory Legal Disclaimer */}
        <div className="p-4 rounded-2xl bg-surface-container border border-outline-variant/30 text-[11px] text-on-surface-variant leading-relaxed">
          <p className="font-semibold text-on-surface mb-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-primary">info</span>
            Mandatory Statutory Legal Disclaimer:
          </p>
          <p>
            Slipstats is an administrative, organizational, and data-formatting utility designed to assist users in structuring their personal financial information. Slipstats is not a law firm, does not provide legal advice, and does not replace the counsel of a qualified legal practitioner. The use of this software does not guarantee any specific outcome, speed of adjudication, or the acceptance/endorsement of submitted data by any maintenance court, maintenance officer, or judicial official. The burden of ensuring data accuracy and compliance with court evidentiary rules rests entirely on the user. Formatted in alignment with the South African Maintenance Act 99 of 1998 and High Court Uniform Rule 43.
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-on-surface-variant">
          <p>
            © {new Date().getFullYear()} Slipstats (Pty) Ltd. All rights reserved. - Developed and Managed by{" "}
            <a
              href="https://www.digitalspaces.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold transition-colors"
            >
              Digital Spaces
            </a>
          </p>
          <div className="flex items-center gap-4">
            <span>Currency: ZAR (R)</span>
            <span>•</span>
            <span>Version 1.0 (PWA)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
