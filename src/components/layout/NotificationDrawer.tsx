"use client";

import React from "react";

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  icon: string;
  type: "court" | "expense" | "reminder";
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Maintenance Payment Due",
    desc: "Co-parent monthly contribution of R1,422.75 is scheduled for Day 1 under court agreement.",
    time: "Due in 3 days",
    icon: "account_balance",
    type: "court",
  },
  {
    id: "notif-2",
    title: "Receipt Hashed & Secured",
    desc: "Checkers Hyper slip #CK-49102 cryptographically recorded with SHA-256 seal.",
    time: "2 hours ago",
    icon: "verified",
    type: "expense",
  },
  {
    id: "notif-3",
    title: "October Form 4A Exhibit Ready",
    desc: "Itemized exhibit schedule compiled with 14 verified till slips ready for attorney export.",
    time: "Yesterday",
    icon: "gavel",
    type: "reminder",
  },
];

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div
        className="w-full max-w-sm h-full bg-surface-container-lowest border-l border-outline-variant/40 shadow-2xl p-4 flex flex-col gap-4 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">
              notifications_active
            </span>
            <h3 className="font-headline text-base font-bold text-on-surface">
              Court & Ledger Alerts
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5 flex-1">
          {NOTIFICATIONS.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 flex items-start gap-2.5 shadow-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-title text-xs font-bold text-on-surface truncate">
                    {item.title}
                  </h4>
                  <span className="text-[10px] text-secondary font-semibold shrink-0">
                    {item.time}
                  </span>
                </div>
                <p className="font-body text-[11px] text-on-surface-variant leading-relaxed mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-surface-container-high text-on-surface text-xs font-semibold hover:bg-surface-variant transition-colors"
          >
            Dismiss All
          </button>
        </div>
      </div>
    </div>
  );
};
