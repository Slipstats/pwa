import React from "react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

export const ChildSpendCard: React.FC = () => {
  const cards = [
    {
      id: "liam",
      name: "Liam",
      meta: "Age 7 • Grade 2",
      total: 1620.0,
      description: "School tuition, soccer gear, pediatric allergy prescription",
      coParentShare: 810.0,
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDV4Z1uMBbUw8xJc-Gnuy9IP1DrvyQRRLkN43RMhpnp6M7iIpg6UvYMzc-0sQ6albpPdQYsGpGrKJydKbd1bcv_eOmyhWc1221BvrlOAMhhxWyuYyF51Gndbnmzmv2Xu8V-h8N4kkKLse95GST3V0hK_yBHbS9NubuB9XdnIWtx1ncd_yB6oaIXXQ5vufSxekKEPwY26Agh50vJuyO5fdOHQ0KhtJAGKossL-pgfobaUTxJ-ia7hOhNxw",
      badgeColor: "bg-primary-fixed",
    },
    {
      id: "maya",
      name: "Maya",
      meta: "Age 3 • Nursery",
      total: 1225.5,
      description: "Toddler formula, size 4 diapers, nursery fees, winter boots",
      coParentShare: 612.75,
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBM7gJ34RP-Ddp9XI1q8kj8MHT-uqz0iWZm54NSLj5uVjxyYIAdlBhck6G5KBtD1umxIQ-UNJ5EWaEEHB2Xbvf1ChbwGr29qEYerrTNrsYA7fEaPQ5x-BGMRG440G4iiVPGPpVB_7p-uXna2ep-kLkSOvR9mWxnqCKhT8RiZ03hNkVam28vbFPJFxjqb8fWH_ETdubdLiwAu55s1zb_VRhkYRUGORa_OusWaxcfbSNceLwLhcFK8KJnKw",
      badgeColor: "bg-tertiary-fixed",
    },
  ];

  return (
    <div className="flex flex-col gap-space-xs">
      <div className="flex items-center justify-between px-space-2xs">
        <span className="font-headline text-headline-sm text-on-surface font-bold">
          Child Spend Allocation
        </span>
        <span className="font-label text-label-sm text-on-surface-variant">2 Beneficiaries</span>
      </div>

      <div className="grid grid-cols-2 gap-space-sm">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex flex-col p-space-sm rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-sm"
          >
            <div className="flex items-center gap-space-xs mb-2">
              <div
                className={`w-9 h-9 rounded-xl overflow-hidden ${card.badgeColor} flex-shrink-0 relative`}
              >
                <Image
                  src={card.avatar}
                  alt={card.name}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-title text-title-md text-on-surface leading-tight truncate font-semibold">
                  {card.name}
                </h3>
                <span className="font-label text-label-sm text-on-surface-variant block truncate">
                  {card.meta}
                </span>
              </div>
            </div>

            <div className="font-currency text-currency-md text-primary font-bold tracking-tight">
              {formatCurrency(card.total)}
            </div>

            <p className="font-body text-body-sm text-on-surface-variant line-clamp-2 mt-1 min-h-[32px]">
              {card.description}
            </p>

            <div className="mt-2.5 pt-2 flex items-center justify-between bg-surface-container-lowest border border-outline-variant/30 px-2 py-1 rounded-lg">
              <span className="font-label text-[11px] text-on-surface-variant">Co-parent share</span>
              <span className="font-label text-[11px] font-semibold text-secondary">
                {formatCurrency(card.coParentShare)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
