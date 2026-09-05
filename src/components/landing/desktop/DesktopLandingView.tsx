"use client";

import React from "react";
import { DesktopNav } from "./DesktopNav";
import { DesktopHero } from "./DesktopHero";
import { DesktopFeatures } from "./DesktopFeatures";
import { DesktopPricing } from "./DesktopPricing";
import { DesktopFaq } from "./DesktopFaq";
import { DesktopCtaBanner } from "./DesktopCtaBanner";
import { DesktopFooter } from "./DesktopFooter";
import { LegalModalType } from "../shared/LegalModals";

interface DesktopLandingViewProps {
  onOpenModal: (modal: LegalModalType) => void;
}

export const DesktopLandingView: React.FC<DesktopLandingViewProps> = ({ onOpenModal }) => {
  return (
    <div className="hidden md:flex flex-col w-full min-h-screen bg-surface text-on-surface">
      {/* 1. Desktop & Tablet Top Navigation */}
      <DesktopNav />

      {/* 2. Hero Section with Mockup Showcase */}
      <DesktopHero />

      {/* 3. Core Evidentiary Features Grid */}
      <DesktopFeatures />

      {/* 4. South African Rand Pricing Matrix */}
      <DesktopPricing />

      {/* 5. Frequently Asked Questions Accordion */}
      <DesktopFaq />

      {/* 6. Pre-Footer Conversion CTA Banner */}
      <DesktopCtaBanner />

      {/* 7. Structured Desktop Footer with Legal Modals */}
      <DesktopFooter onOpenModal={onOpenModal} />
    </div>
  );
};
