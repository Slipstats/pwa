"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      match: ["/dashboard", "/expenses"],
      label: "Expenses",
      icon: "receipt_long",
    },
    {
      href: "/scan",
      match: ["/scan"],
      label: "Scan Slip",
      icon: "document_scanner",
      isHighlighted: true,
    },
    {
      href: "/reports",
      match: ["/reports"],
      label: "Reports",
      icon: "gavel",
    },
    {
      href: "/children",
      match: ["/children"],
      label: "Children",
      icon: "shield_person",
    },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-surface/95 backdrop-blur-xl border-t border-surface-variant/80 shadow-[0_-2px_14px_rgba(0,0,0,0.04)]">
      <div className="h-pwa-nav-height max-w-xl mx-auto px-space-sm flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = item.match.includes(pathname);

          if (item.isHighlighted) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center w-16 h-12 rounded-xl gap-0.5 transition-transform active:scale-95 text-primary"
              >
                <div
                  className={`w-11 h-7 flex items-center justify-center rounded-full transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "bg-primary-fixed text-primary hover:bg-primary-fixed-dim"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                </div>
                <span
                  className={`font-label text-[11px] font-bold ${
                    isActive ? "text-primary" : "text-on-surface-variant"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-12 rounded-xl gap-0.5 transition-all active:scale-95 ${
                isActive
                  ? "text-primary font-bold"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              <span className="font-label text-[11px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
