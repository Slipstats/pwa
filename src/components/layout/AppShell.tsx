"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { OfflineIndicator } from "@/components/shared/OfflineIndicator";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const isPublicRoute = pathname === "/" || pathname === "/login";

  if (isPublicRoute) {
    return <main className="w-full min-h-screen flex flex-col">{children}</main>;
  }

  return (
    <>
      <AppHeader />
      <div className="fixed top-16 w-full z-30">
        <OfflineIndicator />
      </div>
      <main className="flex-1 w-full max-w-xl md:max-w-4xl lg:max-w-5xl mx-auto pt-16 md:pt-20 pb-28 md:pb-12 px-4 md:px-6">
        {children}
      </main>
      <BottomNav />
    </>
  );
};
