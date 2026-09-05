import React from "react";

export const PaystackBadges: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-on-surface-variant">
        <span className="material-symbols-outlined text-[15px] text-emerald-700">lock</span>
        <span>
          Secure Checkout via <strong className="text-on-surface">Paystack</strong> • 256-Bit SSL
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Capitec Pay Badge */}
        <div
          title="Capitec Pay"
          className="h-7 px-2.5 rounded-lg bg-surface-container border border-outline-variant/50 flex items-center gap-1.5 shadow-2xs hover:border-outline-variant transition-colors"
        >
          <div className="w-3.5 h-3.5 rounded-full bg-[#004f71] flex items-center justify-center text-[9px] font-black text-white leading-none">
            C
          </div>
          <span className="text-[11px] font-bold text-on-surface tracking-tight">Capitec Pay</span>
        </div>

        {/* Instant EFT Badge */}
        <div
          title="Instant EFT (All SA Banks)"
          className="h-7 px-2.5 rounded-lg bg-surface-container border border-outline-variant/50 flex items-center gap-1.5 shadow-2xs hover:border-outline-variant transition-colors"
        >
          <span className="material-symbols-outlined text-[14px] text-primary">bolt</span>
          <span className="text-[11px] font-bold text-on-surface tracking-tight">Instant EFT</span>
        </div>

        {/* Debit / Credit Cards */}
        <div
          title="Visa and Mastercard"
          className="h-7 px-2.5 rounded-lg bg-surface-container border border-outline-variant/50 flex items-center gap-1.5 shadow-2xs hover:border-outline-variant transition-colors"
        >
          <span className="material-symbols-outlined text-[14px] text-on-surface-variant">credit_card</span>
          <span className="text-[11px] font-bold text-on-surface tracking-tight">Visa • Mastercard</span>
        </div>

        {/* South African Banks Pill */}
        <div className="h-7 px-2 rounded-lg bg-surface-container-high text-[10px] font-medium text-on-surface-variant flex items-center">
          Absa • FNB • Nedbank • Standard
        </div>
      </div>
    </div>
  );
};
