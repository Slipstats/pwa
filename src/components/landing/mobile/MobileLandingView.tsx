"use client";

import React from "react";
import { MobileNav } from "./MobileNav";
import { MobileHero } from "./MobileHero";
import { MobileFeatures } from "./MobileFeatures";
import { MobilePricing } from "./MobilePricing";
import { MobileFaq } from "./MobileFaq";
import { MobileCtaBanner } from "./MobileCtaBanner";
import { MobileFooter } from "./MobileFooter";
import { LegalModalType } from "../shared/LegalModals";

interface MobileLandingViewProps {
  onOpenModal: (modal: LegalModalType) => void;
}

export const MobileLandingView: React.FC<MobileLandingViewProps> = ({ onOpenModal }) => {
  return (
    <div className="block md:hidden flex-col w-full min-h-screen bg-surface text-on-surface">
      {/* 1. Mobile Sticky Header with Slide-Over Drawer */}
      <MobileNav />

      {/* 2. Mobile Hero with Touch Actions and Mockup Preview */}
      <MobileHero />

      {/* 3. Mobile Evidentiary Features Stack */}
      <MobileFeatures />

      {/* 4. Mobile Pricing Segmented Cards (ZAR) */}
      <MobilePricing />

      {/* 5. Mobile Accordion FAQ */}
      <MobileFaq />

      {/* 6. Mobile High-Conversion CTA Card */}
      <MobileCtaBanner />

      {/* 7. Mobile Footer with Legal Popup Triggers */}
      <MobileFooter onOpenModal={onOpenModal} />
    </div>
  );
};
