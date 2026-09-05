"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Child } from "@/types/database.types";

interface ChildSelectorDropdownProps {
  childrenList: Child[];
  activeChildId: string | null;
  onSelect: (childId: string | null, childName: string) => void;
  className?: string;
}

export const ChildSelectorDropdown: React.FC<ChildSelectorDropdownProps> = ({
  childrenList,
  activeChildId,
  onSelect,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Match the currently selected child
  const matchedChild = childrenList.find(
    (c) =>
      c.id === activeChildId ||
      (activeChildId && c.first_name.toLowerCase() === activeChildId.toLowerCase())
  );

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
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
  }, [isOpen]);

  const handleSelect = (childId: string | null, childName: string) => {
    onSelect(childId, childName);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Pill Trigger Button */}
      <button
        type="button"
        id="child-filter-dropdown-btn"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Filter expenses by child"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-on-surface-variant border transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:scale-95 ${
          isOpen
            ? "bg-surface-container-highest border-primary/50 shadow-sm"
            : "bg-surface-container-high/90 hover:bg-surface-container-highest border-outline-variant/40 shadow-xs"
        }`}
      >
        {/* Child Avatar or Family Icon */}
        {matchedChild ? (
          matchedChild.avatar_url ? (
            <div className="relative w-4 h-4 rounded-full overflow-hidden ring-1 ring-primary/40 flex-shrink-0">
              <Image
                src={matchedChild.avatar_url}
                alt={matchedChild.first_name}
                width={16}
                height={16}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-4 h-4 rounded-full bg-primary-fixed text-on-primary-fixed text-[9px] font-bold flex items-center justify-center ring-1 ring-primary/30 flex-shrink-0">
              {matchedChild.first_name.charAt(0).toUpperCase()}
            </div>
          )
        ) : (
          <span className="material-symbols-outlined text-[15px] text-primary flex-shrink-0">
            family_restroom
          </span>
        )}

        {/* Selected Name */}
        <span className="font-label text-xs text-on-surface font-semibold tracking-tight truncate max-w-[80px] sm:max-w-[110px]">
          {matchedChild ? matchedChild.first_name : "All Kids"}
        </span>

        {/* Animated Chevron */}
        <span
          className={`material-symbols-outlined text-[14px] text-outline transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : "group-hover:text-on-surface"
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          id="child-filter-dropdown-menu"
          aria-label="Child ledger options"
          className="absolute right-0 top-full mt-2 w-72 max-w-[calc(100vw-2rem)] bg-surface-container-lowest/95 backdrop-blur-xl border border-outline-variant/40 rounded-2xl shadow-2xl p-1.5 z-50 ring-1 ring-black/5 animate-fadeIn"
        >
          {/* Header Label */}
          <div className="px-3 py-1.5 flex items-center justify-between border-b border-outline-variant/20 mb-1">
            <span className="text-[10px] font-bold tracking-wider uppercase text-on-surface-variant/70">
              Filter Ledger View
            </span>
            <span className="text-[10px] text-primary font-semibold bg-primary-fixed/60 px-2 py-0.5 rounded-full">
              {childrenList.length} {childrenList.length === 1 ? "child" : "children"}
            </span>
          </div>

          {/* Option: All Kids */}
          <button
            type="button"
            role="option"
            aria-selected={!matchedChild}
            onClick={() => handleSelect(null, "All Kids")}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all duration-150 cursor-pointer text-left ${
              !matchedChild
                ? "bg-primary/10 text-primary font-semibold shadow-xs"
                : "hover:bg-surface-container/70 text-on-surface active:bg-surface-container"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  !matchedChild
                    ? "bg-primary text-white shadow-xs"
                    : "bg-primary-fixed/80 text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">family_restroom</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold leading-tight truncate">All Kids</span>
                <span className="text-[10px] text-on-surface-variant leading-tight">
                  Combined ledger • All expenses
                </span>
              </div>
            </div>
            {!matchedChild && (
              <span className="material-symbols-outlined text-[18px] text-primary flex-shrink-0 ml-2">
                check_circle
              </span>
            )}
          </button>

          {/* Divider */}
          {childrenList.length > 0 && (
            <div className="my-1 border-t border-outline-variant/20" />
          )}

          {/* Option for each child */}
          <div className="flex flex-col gap-0.5 max-h-60 overflow-y-auto no-scrollbar">
            {childrenList.map((child) => {
              const isSelected = matchedChild?.id === child.id;

              return (
                <button
                  key={child.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(child.id, child.first_name)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-all duration-150 cursor-pointer text-left ${
                    isSelected
                      ? "bg-primary/10 text-primary font-semibold shadow-xs"
                      : "hover:bg-surface-container/70 text-on-surface active:bg-surface-container"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-1.5 ring-outline-variant/30 bg-surface-container-high flex items-center justify-center">
                      {child.avatar_url ? (
                        <Image
                          src={child.avatar_url}
                          alt={child.first_name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-primary">
                          {child.first_name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold leading-tight truncate">
                        {child.first_name} {child.last_name || ""}
                      </span>
                      <span className="text-[10px] text-on-surface-variant leading-tight truncate">
                        {child.age_display || "Child"} •{" "}
                        {Math.round(child.default_split_ratio ?? 50)}% split
                      </span>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[18px] text-primary flex-shrink-0 ml-2">
                      check_circle
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Quick Action */}
          <div className="mt-1 pt-1 border-t border-outline-variant/20">
            <Link
              href="/children"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] font-medium text-primary hover:bg-primary/5 active:bg-primary/10 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">manage_accounts</span>
                Manage Family & Splits
              </span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
