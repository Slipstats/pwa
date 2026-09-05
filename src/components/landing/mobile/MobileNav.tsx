"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SlipstatsLogo } from "@/components/shared/SlipstatsLogo";

export const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 transition-all shadow-2xs">
      {/* Subtle top ambient highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/25 to-transparent pointer-events-none" />

      <div className="px-4 py-3.5 min-h-[64px] flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 active:opacity-85 shrink-0">
          <SlipstatsLogo className="w-8.5 h-8.5 shrink-0" />
          <div className="flex flex-col justify-center">
            <span className="font-headline font-extrabold text-base text-primary tracking-tight leading-tight">
              Slipstats
            </span>
            <span className="font-label text-[9.5px] text-on-surface-variant/80 font-medium tracking-tight whitespace-nowrap truncate max-w-[150px] xs:max-w-[200px] mt-0.5">
              Child Maintenance Management Platform
            </span>
          </div>
        </Link>

        {/* Quick Mobile Action + Hamburger */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/demo"
            className="h-8 px-3 rounded-full bg-primary-fixed/60 text-primary font-label text-[11px] font-bold flex items-center gap-1 shadow-2xs border border-primary/20 active:scale-95 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            <span>Live Demo</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation drawer"
            className="w-8.5 h-8.5 rounded-xl bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors active:scale-95 cursor-pointer border border-outline-variant/40 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Slide-Down Mobile Drawer */}
      {isOpen && (
        <div className="border-t border-outline-variant/30 bg-surface px-4 py-5 flex flex-col gap-4 shadow-2xl animate-fadeIn">
          {/* Statutory Chip */}
          <div className="p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 flex items-center gap-2 text-xs font-semibold text-on-surface">
            <span className="material-symbols-outlined text-[18px] text-primary">verified</span>
            <span>Maintenance Act 99/1998 • Form 4A & Rule 43</span>
          </div>

          {/* Navigation Anchors */}
          <nav className="flex flex-col gap-1.5 font-label text-sm font-semibold text-on-surface">
            <a
              href="#mobile-features"
              onClick={() => setIsOpen(false)}
              className="p-2.5 hover:bg-surface-container rounded-xl transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">stars</span>
                Features & Automation
              </span>
              <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
            </a>
            <a
              href="#mobile-demo"
              onClick={() => setIsOpen(false)}
              className="p-2.5 hover:bg-surface-container rounded-xl transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">receipt_long</span>
                Till Slip AI Demo
              </span>
              <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
            </a>
            <a
              href="#mobile-pricing"
              onClick={() => setIsOpen(false)}
              className="p-2.5 hover:bg-surface-container rounded-xl transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">payments</span>
                Pricing (ZAR)
              </span>
              <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
            </a>
            <a
              href="#mobile-faq"
              onClick={() => setIsOpen(false)}
              className="p-2.5 hover:bg-surface-container rounded-xl transition-colors flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">help</span>
                Frequently Asked Questions
              </span>
              <span className="material-symbols-outlined text-[18px] text-outline">chevron_right</span>
            </a>
          </nav>

          {/* Auth Action Buttons */}
          <div className="pt-2 border-t border-outline-variant/30 flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full h-11 rounded-xl bg-primary text-white font-headline text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95"
            >
              <span>Sign Up Now</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full h-10 rounded-xl bg-surface-container text-on-surface font-headline text-xs font-bold flex items-center justify-center hover:bg-surface-container-high transition-colors"
            >
              Sign In to Existing Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
