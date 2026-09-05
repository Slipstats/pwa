"use client";

import React from "react";
import Link from "next/link";

export const MobileCtaBanner: React.FC = () => {
  return (
    <section className="py-12 bg-surface">
      <div className="px-4">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-primary-container p-6 sm:p-8 text-white shadow-xl flex flex-col gap-5">
          <span className="self-start font-label text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white">
            Court-Ready Evidentiary Protection
          </span>

          <h2 className="font-headline font-extrabold text-2xl tracking-tight leading-tight">
            Save Your Case From Being Stalled or Unread.
          </h2>

          <p className="font-body text-xs text-white/90 leading-relaxed">
            Presenting messy chats or unindexed receipts risks having your case set aside. Formats
            your data into a court-ready, indexed breakdown structured for Rule 6 assessment.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col gap-2.5 pt-1">
            <Link
              href="/login"
              className="w-full h-12 rounded-xl bg-white text-primary font-headline text-xs font-bold shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>Sign Up Now</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <Link
              href="/demo"
              className="w-full h-11 rounded-xl bg-white/15 hover:bg-white/20 text-white font-headline text-xs font-bold border border-white/25 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Try Live Demo</span>
            </Link>
          </div>

          <div className="flex items-center justify-between text-[10px] text-white/80 font-medium pt-1 border-t border-white/15">
            <span>✓ Paystack Secure</span>
            <span>✓ Capitec Pay &amp; EFT</span>
            <span>✓ POPIA Compliant</span>
          </div>
        </div>
      </div>
    </section>
  );
};
