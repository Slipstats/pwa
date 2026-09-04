"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AppHeaderProps {
  selectedChild?: string;
  onSelectChild?: (child: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  selectedChild = "All Kids",
  onSelectChild,
}) => {
  const pathname = usePathname();
  const [activeChild, setActiveChild] = useState(selectedChild);

  const handleChildChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setActiveChild(val);
    if (onSelectChild) onSelectChild(val);
  };

  const getPageTitle = () => {
    if (pathname.includes("/scan")) return "Scan Till Slip";
    if (pathname.includes("/reports")) return "Court Reports";
    if (pathname.includes("/children")) return "Family & Splits";
    if (pathname.includes("/expenses/new")) return "Manual Expense";
    return "Expenses Dashboard";
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/90 backdrop-blur-xl border-b border-surface-variant/70 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="h-16 max-w-xl md:max-w-4xl lg:max-w-5xl mx-auto px-4 md:px-6 flex items-center justify-between gap-space-sm">
        {/* Left: Brand Identity */}
        <Link href="/" className="flex items-center gap-space-xs active:opacity-80 transition-opacity">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-primary-fixed flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Slipstats App Logo"
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline font-bold text-base text-primary tracking-tight leading-tight">
              Slipstats
            </span>
            <span className="font-label text-[11px] text-on-surface-variant font-medium leading-none">
              {getPageTitle()}
            </span>
          </div>
        </Link>

        {/* Right: Child Selector, Alerts, and Profile */}
        <div className="flex items-center gap-2">
          {/* Child Filter Dropdown */}
          <div className="flex items-center bg-surface-container-high/90 px-2.5 py-1 rounded-full text-on-surface-variant border border-outline-variant/40 shadow-sm">
            <span className="material-symbols-outlined text-[15px] text-primary mr-1">
              family_restroom
            </span>
            <select
              aria-label="Active child filter"
              value={activeChild}
              onChange={handleChildChange}
              className="bg-transparent font-label text-[12px] text-on-surface font-semibold focus:outline-none pr-1 appearance-none cursor-pointer border-none p-0 focus:ring-0"
            >
              <option value="All Kids">All Kids</option>
              <option value="Liam">Liam</option>
              <option value="Maya">Maya</option>
            </select>
            <span className="material-symbols-outlined text-[13px] text-outline pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Notifications Trigger */}
          <div className="relative flex items-center justify-center">
            <button
              aria-label="Notifications"
              type="button"
              className="w-8 h-8 flex items-center justify-center text-on-surface-variant rounded-full active:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface"></span>
            </button>
          </div>

          {/* Mother Profile Avatar */}
          <Link
            href="/children"
            className="relative flex items-center justify-center rounded-full active:scale-95 transition-transform"
            aria-label="User Profile"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/25 bg-surface-container-high">
              <Image
                src="/images/mother_avatar.png"
                alt="Sarah Profile"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
