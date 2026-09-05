"use client";

import React, { useState } from "react";
import { DesktopLandingView } from "@/components/landing/desktop/DesktopLandingView";
import { MobileLandingView } from "@/components/landing/mobile/MobileLandingView";
import { LegalModals, LegalModalType } from "@/components/landing/shared/LegalModals";

export default function MarketingLandingPage() {
  const [activeModal, setActiveModal] = useState<LegalModalType>(null);

  return (
    <main className="min-h-screen w-full bg-surface text-on-surface">
      {/* Desktop & Tablet View (Responsive to tablet, 12-col grids, side-by-side mockups) */}
      <DesktopLandingView onOpenModal={setActiveModal} />

      {/* Mobile View (Dedicated separate view & custom touch-friendly components) */}
      <MobileLandingView onOpenModal={setActiveModal} />

      {/* Shared Interactive Legal Popups (Privacy Policy, Terms of Service, POPIA Notice) */}
      <LegalModals activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </main>
  );
}
