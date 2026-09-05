"use client";

import React from "react";
import Link from "next/link";
import { SlipstatsLogo } from "@/components/shared/SlipstatsLogo";

export const DesktopNav: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 transition-all shadow-2xs">
      {/* Subtle top ambient highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-primary/25 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4.5 lg:py-5.5 flex items-center justify-between gap-6">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3.5 shrink-0 group active:opacity-85 transition-opacity">
          <SlipstatsLogo className="w-10 h-10 shrink-0 group-hover:scale-105 transition-transform" />
          <div className="flex flex-col justify-center">
            <span className="font-headline font-extrabold text-xl text-primary tracking-tight leading-tight">
              Slipstats
            </span>
            <span className="font-label text-[10.5px] text-on-surface-variant/80 font-medium tracking-tight whitespace-nowrap mt-0.5 hidden md:block">
              Child Maintenance Management Platform
            </span>
          </div>
        </Link>

        {/* Center Frosted Capsule Navigation (High-End SaaS Standard) */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full bg-surface-container-low/90 border border-outline-variant/40 backdrop-blur-md shadow-2xs">
          <a
            href="#features"
            className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-high/80 transition-all whitespace-nowrap"
          >
            Features
          </a>
          <a
            href="#till-slip-demo"
            className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-high/80 transition-all whitespace-nowrap"
          >
            Till Slip AI
          </a>
          <a
            href="#pricing"
            className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-high/80 transition-all whitespace-nowrap"
          >
            Pricing
          </a>
          <a
            href="#court-standards"
            className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-high/80 transition-all whitespace-nowrap"
          >
            Court Standards
          </a>
          <a
            href="#faq"
            className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:text-primary hover:bg-surface-container-high/80 transition-all whitespace-nowrap"
          >
            FAQ
          </a>
        </nav>

        {/* Compact Navigation for Tablet (md to lg) */}
        <nav className="hidden md:flex lg:hidden items-center gap-4 font-label text-xs font-semibold text-on-surface-variant">
          <a href="#features" className="hover:text-primary transition-colors whitespace-nowrap">
            Features
          </a>
          <a href="#till-slip-demo" className="hover:text-primary transition-colors whitespace-nowrap">
            Till Slip AI
          </a>
          <a href="#pricing" className="hover:text-primary transition-colors whitespace-nowrap">
            Pricing
          </a>
          <a href="#faq" className="hover:text-primary transition-colors whitespace-nowrap">
            FAQ
          </a>
        </nav>

        {/* Action CTAs with high-end polished styling */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/demo"
            className="h-10.5 px-4.5 rounded-xl text-xs font-bold text-primary bg-primary-fixed/50 hover:bg-primary-fixed border border-primary/20 hover:border-primary/40 transition-all flex items-center gap-2 shadow-2xs hover:shadow-xs active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px] text-primary animate-pulse">bolt</span>
            <span>Try Live Demo</span>
          </Link>
          <Link
            href="/login"
            className="h-10.5 px-4 rounded-xl text-xs font-bold text-on-surface-variant hover:text-primary hover:bg-surface-container/60 transition-all flex items-center whitespace-nowrap cursor-pointer"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="h-10.5 px-5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-primary to-primary-container hover:from-primary/95 hover:to-primary-container/95 transition-all flex items-center gap-2 shadow-xs hover:shadow-md active:scale-95 whitespace-nowrap group cursor-pointer"
          >
            <span>Sign Up Now</span>
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
