"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLedger } from "@/context/LedgerContext";
import { NotificationDrawer } from "@/components/layout/NotificationDrawer";
import { ChildSelectorDropdown } from "@/components/layout/ChildSelectorDropdown";
import { SlipstatsLogo } from "@/components/shared/SlipstatsLogo";

interface AppHeaderProps {
  selectedChild?: string;
  onSelectChild?: (child: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  selectedChild = "All Kids",
  onSelectChild,
}) => {
  const pathname = usePathname();
  const { user, profile, logout } = useAuth();
  const { children, activeChildId, setActiveChildId } = useLedger();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile menu on outside click
  useEffect(() => {
    if (!isProfileMenuOpen) return;
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProfileMenuOpen]);

  const handleSelectChild = (childId: string | null, childName: string) => {
    setActiveChildId(childId);
    if (onSelectChild) {
      onSelectChild(childName);
    }
  };

  const getPageTitle = () => {
    if (pathname.includes("/demo")) return "Interactive Demo";
    if (pathname.includes("/scan")) return "Scan Till Slip";
    if (pathname.includes("/reports")) return "Court Reports";
    if (pathname.includes("/children")) return "Family & Splits";
    if (pathname.includes("/expenses/new")) return "Manual Expense";
    if (pathname.includes("/login")) return "Authentication";
    return "Expenses Dashboard";
  };

  return (
    <>
      <header className="fixed top-0 w-full z-40 pt-safe bg-surface/90 backdrop-blur-xl border-b border-surface-variant/70 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="h-16 max-w-xl md:max-w-4xl lg:max-w-5xl mx-auto px-4 md:px-6 flex items-center justify-between gap-space-sm">
          {/* Left: Brand Identity */}
          <Link href="/dashboard" className="flex items-center gap-space-xs active:opacity-80 transition-opacity">
            <SlipstatsLogo className="w-8 h-8" />
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
            <ChildSelectorDropdown
              childrenList={children}
              activeChildId={activeChildId}
              onSelect={handleSelectChild}
            />

            {/* Notifications Trigger */}
            <div className="relative flex items-center justify-center">
              <button
                aria-label="Notifications"
                id="header-notif-btn"
                type="button"
                onClick={() => setIsNotifOpen(true)}
                className="w-8 h-8 flex items-center justify-center text-on-surface-variant rounded-full active:bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface"></span>
              </button>
            </div>

            {/* Profile Avatar / Login Button */}
            {user ? (
              <div ref={profileMenuRef} className="relative">
                <button
                  type="button"
                  id="profile-menu-btn"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="relative flex items-center justify-center rounded-full active:scale-95 transition-transform cursor-pointer"
                  aria-label="User Profile"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/25 bg-surface-container-high flex items-center justify-center text-xs font-bold text-primary">
                    <Image
                      src="/images/mother_avatar.png"
                      alt={user.full_name || "Mother Profile"}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shadow-xl p-2 z-50 animate-fadeIn">
                    <div className="px-3 py-2 border-b border-outline-variant/20">
                      <p className="font-headline text-xs font-bold text-on-surface truncate">
                        {user.full_name || profile?.full_name || "Sarah Jenkins"}
                      </p>
                      <p className="text-[10px] text-on-surface-variant truncate">
                        {user.email || "sarah.j@example.com"}
                      </p>
                    </div>
                    <Link
                      href="/children"
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-on-surface hover:bg-surface-container rounded-xl transition-colors mt-1"
                    >
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        shield_person
                      </span>
                      Family & Court Splits
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-error hover:bg-error-container/20 rounded-xl transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                id="header-login-btn"
                className="px-3 py-1 rounded-full bg-primary text-white font-label text-xs font-semibold hover:bg-primary-container transition-all active:scale-95 shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Notification Drawer Modal */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />
    </>
  );
};
