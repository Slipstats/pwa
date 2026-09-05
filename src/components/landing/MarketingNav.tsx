"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SlipstatsLogo } from "@/components/shared/SlipstatsLogo";

export const MarketingNav: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 active:opacity-85 transition-opacity">
          <SlipstatsLogo className="w-9 h-9" />
          <div className="flex flex-col">
            <span className="font-headline font-extrabold text-xl text-primary tracking-tight leading-none">
              Slipstats
            </span>
            <span className="font-label text-[11px] text-on-surface-variant font-medium mt-0.5">
              Child Maintenance Management Platform
            </span>
          </div>
        </Link>

        {/* Desktop Anchor Navigation */}
        <nav className="hidden md:flex items-center gap-6 font-label text-[13px] font-semibold text-on-surface-variant">
          <a href="#till-slip-audit" className="hover:text-primary transition-colors">
            Till Slip AI
          </a>
          <a href="#medical-shortfall" className="hover:text-primary transition-colors">
            Medical Gap
          </a>
          <a href="#court-compliance" className="hover:text-primary transition-colors">
            Court Compliance
          </a>
          <a href="#calculator" className="hover:text-primary transition-colors">
            Calculator
          </a>
          <a href="#faq" className="hover:text-primary transition-colors">
            FAQ
          </a>
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/demo"
            className="h-10 px-4 rounded-xl text-xs font-bold text-primary bg-primary-fixed hover:bg-primary-fixed-dim transition-all flex items-center gap-1.5 shadow-xs border border-primary-fixed-dim/50 active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>Try Live Demo</span>
          </Link>
          <Link
            href="/login"
            className="h-10 px-3.5 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="h-10 px-4 rounded-xl text-xs font-bold text-white bg-primary hover:bg-primary-container transition-all flex items-center gap-1.5 shadow-md active:scale-95"
          >
            <span>Get Started</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <span className="material-symbols-outlined text-[24px]">
            {mobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-outline-variant/30 bg-surface px-4 py-5 flex flex-col gap-4 shadow-xl animate-fadeIn">
          <nav className="flex flex-col gap-3 font-label text-sm font-semibold text-on-surface">
            <a
              href="#till-slip-audit"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-2 hover:bg-surface-container rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Till Slip Audit AI</span>
              <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
            </a>
            <a
              href="#medical-shortfall"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-2 hover:bg-surface-container rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Medical Gap Recovery</span>
              <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
            </a>
            <a
              href="#court-compliance"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-2 hover:bg-surface-container rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Court-Ready Form 4A & Rule 43</span>
              <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-2 hover:bg-surface-container rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Maintenance Share Calculator</span>
              <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 px-2 hover:bg-surface-container rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Frequently Asked Questions</span>
              <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
            </a>
          </nav>

          <div className="pt-3 border-t border-outline-variant/20 flex flex-col gap-2.5">
            <Link
              href="/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full h-11 rounded-xl font-semibold text-sm text-primary bg-primary-fixed hover:bg-primary-fixed-dim flex items-center justify-center gap-2 border border-primary-fixed-dim/50"
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              <span>Try Live Interactive Demo</span>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-11 rounded-xl font-semibold text-sm text-on-surface bg-surface-container hover:bg-surface-container-high flex items-center justify-center"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-11 rounded-xl font-semibold text-sm text-white bg-primary hover:bg-primary-container flex items-center justify-center gap-1 shadow-sm"
              >
                <span>Get Started</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
