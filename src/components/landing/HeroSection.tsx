import React from "react";
import Link from "next/link";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-surface via-surface to-surface-container-low/40 border-b border-outline-variant/30">
      {/* Ambient background glow accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-primary-fixed/20 via-secondary-container/20 to-tertiary-fixed/15 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-5">
          {/* Statutory Trust Signal Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/50 shadow-xs">
            <span className="material-symbols-outlined text-[18px] text-primary">verified</span>
            <span className="font-label text-xs font-bold text-on-surface tracking-tight">
              Maintenance Act 99 of 1998 (Rule 6) • ECT Act 25 of 2002 Evidential Integrity
            </span>
          </div>

          {/* Primary Headline */}
          <h1 className="font-headline font-extrabold text-3xl sm:text-5xl lg:text-6xl text-on-surface tracking-tight leading-[1.15]">
            Turn Crumpled Till Slips Into{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Court-Ready
            </span>{" "}
            Child Maintenance Claims.
          </h1>

          {/* Value Proposition Description */}
          <p className="font-body text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
            Saves your case from being stalled or unread. Slipstats formats your data into a
            court-ready, indexed financial breakdown structured to assist maintenance officers during
            the Rule 6 financial assessment process with SHA-256 integrity proof.
          </p>

          {/* Conversion CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mt-2">
            <Link
              href="/login"
              className="w-full sm:w-auto h-13 px-8 rounded-2xl bg-primary hover:bg-primary-container text-white font-headline text-base font-bold shadow-lg flex items-center justify-center gap-2.5 transition-all active:scale-95"
            >
              <span>Get Started Free</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto h-13 px-6 rounded-2xl bg-surface-container-highest hover:bg-surface-variant text-primary font-headline text-sm font-bold border border-outline-variant/60 shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px] text-primary">bolt</span>
              <span>Try Live Demo (Instant)</span>
            </Link>
          </div>

          {/* Microcopy & Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-on-surface-variant font-medium pt-1">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
              100% Free Local Testing
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
              No Credit Card Required
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
              POPIA Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
              Works 100% Offline (PWA)
            </span>
          </div>
        </div>

        {/* Hero Product Visual Mockup */}
        <div className="mt-12 lg:mt-16 relative">
          <div className="rounded-3xl bg-surface-container-low border border-outline-variant/50 p-4 sm:p-6 lg:p-8 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left: Scanned Till Slip with Audited Line Items */}
              <div className="lg:col-span-6 flex flex-col bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4 sm:p-5 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-primary">receipt</span>
                    <span className="font-headline text-sm font-bold text-on-surface">
                      Checkers Hyper Sandton
                    </span>
                  </div>
                  <span className="font-label text-[11px] font-semibold px-2 py-0.5 rounded-md bg-secondary-container/50 text-on-secondary-container">
                    OCR Parsed • Slip #CK-49102
                  </span>
                </div>

                <div className="py-3 flex flex-col gap-2 font-body text-xs">
                  {/* Included Child Item 1 */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-emerald-700">
                        check_box
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface">Purity Organic Toddler Formula</p>
                        <p className="text-[10px] text-on-surface-variant">Allocated: Liam & Maya (100%)</p>
                      </div>
                    </div>
                    <span className="font-bold tabular-nums text-emerald-800">R48.99</span>
                  </div>

                  {/* Included Child Item 2 */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-emerald-700">
                        check_box
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface">Panado Paediatric Syrup 100ml</p>
                        <p className="text-[10px] text-on-surface-variant">Allocated: Maya (100%)</p>
                      </div>
                    </div>
                    <span className="font-bold tabular-nums text-emerald-800">R35.50</span>
                  </div>

                  {/* Included Child Item 3 */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-emerald-700">
                        check_box
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface">Staedtler School Pencil & Wax Set</p>
                        <p className="text-[10px] text-on-surface-variant">Allocated: Liam (100%)</p>
                      </div>
                    </div>
                    <span className="font-bold tabular-nums text-emerald-800">R42.00</span>
                  </div>

                  {/* Excluded Personal Item 1 */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-rose-500/10 border border-rose-500/25 opacity-75 line-through decoration-rose-600">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-rose-600">
                        disabled_by_default
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface">French Roast Espresso Pods 250g</p>
                        <p className="text-[10px] text-rose-700 font-semibold no-underline">
                          [EXCLUDED: Adult Personal Luxury Item]
                        </p>
                      </div>
                    </div>
                    <span className="font-bold tabular-nums text-rose-700">R38.20</span>
                  </div>

                  {/* Excluded Personal Item 2 */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-rose-500/10 border border-rose-500/25 opacity-75 line-through decoration-rose-600">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-rose-600">
                        disabled_by_default
                      </span>
                      <div>
                        <p className="font-semibold text-on-surface">Brutal Fruit Sparkling Spritzer</p>
                        <p className="text-[10px] text-rose-700 font-semibold no-underline">
                          [EXCLUDED: Alcoholic Beverage]
                        </p>
                      </div>
                    </div>
                    <span className="font-bold tabular-nums text-rose-700">R19.91</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-outline-variant/30 flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant font-medium">Till Slip Gross: R184.60</span>
                  <span className="font-bold text-primary">Qualifying Child Total: R126.49</span>
                </div>
              </div>

              {/* Right: Certified Court Claim Schedule Result */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-label text-xs font-bold text-primary uppercase tracking-wide">
                      Form 4A Maintenance Court Schedule
                    </span>
                    <span className="font-label text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800">
                      Dispute-Proof
                    </span>
                  </div>

                  <h3 className="font-headline text-lg font-bold text-on-surface">
                    Forensically Audited Beneficiary Share
                  </h3>

                  <div className="grid grid-cols-2 gap-3 py-1">
                    <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
                      <p className="text-[11px] text-on-surface-variant font-medium">Child Qualifying</p>
                      <p className="font-headline text-xl font-extrabold text-on-surface tabular-nums mt-0.5">
                        R126.49
                      </p>
                      <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                        3 of 5 items admitted
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-primary-fixed/40 border border-primary-fixed-dim/60">
                      <p className="text-[11px] text-primary font-medium">Co-Parent Owed (50%)</p>
                      <p className="font-headline text-xl font-extrabold text-primary tabular-nums mt-0.5">
                        R63.25
                      </p>
                      <p className="text-[10px] text-primary font-semibold mt-0.5">
                        Section 6(1) enforceable
                      </p>
                    </div>
                  </div>

                  {/* Cryptographic SHA-256 Seal */}
                  <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/40 flex items-start gap-2.5 text-xs">
                    <span className="material-symbols-outlined text-[18px] text-primary flex-shrink-0 mt-0.5">
                      security
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-on-surface text-[11px]">
                        Cryptographic Chain-of-Custody Seal (SHA-256)
                      </p>
                      <p className="font-mono text-[9px] text-on-surface-variant truncate mt-0.5">
                        e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                      </p>
                      <p className="text-[10px] text-on-surface-variant mt-1">
                        Stamped on device at scan time. Proves the original till slip image was never
                        modified or photoshopped.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between px-2 text-xs text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-secondary">verified_user</span>
                    Admissible in Randburg, Wynberg & Durban Courts
                  </span>
                  <Link
                    href="/reports"
                    className="text-primary font-semibold hover:underline flex items-center gap-0.5"
                  >
                    <span>View Sample Court PDF</span>
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
