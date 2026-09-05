import React from "react";

export interface CategoryShareItem {
  name: string;
  percentage: number;
  color: string;
}

interface CategoryChartProps {
  categories?: CategoryShareItem[];
}

const DEFAULT_CATEGORIES: CategoryShareItem[] = [
  { name: "Tuition", percentage: 42, color: "bg-primary" },
  { name: "Medical", percentage: 26, color: "bg-secondary" },
  { name: "Hygiene", percentage: 18, color: "bg-tertiary-container" },
  { name: "Transit", percentage: 9, color: "bg-primary-fixed-dim" },
  { name: "Other", percentage: 5, color: "bg-outline-variant" },
];

export const CategoryChart: React.FC<CategoryChartProps> = ({
  categories = DEFAULT_CATEGORIES,
}) => {
  const displayCats = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  return (
    <div className="flex flex-col p-space-md rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-sm gap-space-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[18px] text-primary">pie_chart</span>
          <span className="font-headline text-headline-sm text-on-surface font-bold">
            Category Proportions
          </span>
        </div>
        <span className="font-label text-label-sm text-on-surface-variant font-medium">
          100% Accounted
        </span>
      </div>

      {/* Multi-segment progress bar */}
      <div className="w-full h-3 rounded-lg overflow-hidden flex bg-surface-container-highest mt-1">
        {displayCats.map((cat) => (
          <div
            key={cat.name}
            className={`h-full ${cat.color} transition-all duration-500`}
            style={{ width: `${cat.percentage}%` }}
            title={`${cat.name} ${cat.percentage}%`}
          />
        ))}
      </div>

      {/* Legend Items */}
      <div className="grid grid-cols-3 gap-y-1.5 gap-x-2 pt-2">
        {displayCats.map((cat) => (
          <div key={cat.name} className="flex items-center gap-1.5 min-w-0">
            <span className={`w-2.5 h-2.5 rounded-sm ${cat.color} flex-shrink-0`} />
            <span className="font-label text-label-sm text-on-surface truncate">
              {cat.name} ({cat.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
