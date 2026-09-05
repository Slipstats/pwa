"use client";

import React, { useState, useEffect } from "react";

export const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    setIsOffline(!navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="w-full bg-amber-500/90 text-amber-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all animate-fadeIn z-50">
      <span className="material-symbols-outlined text-[16px]">wifi_off</span>
      <span>Working Offline — Slips & expenses are stored safely locally. Will sync automatically.</span>
    </div>
  );
};
