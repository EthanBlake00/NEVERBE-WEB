"use client";

import React from "react";

interface SizeGridProps {
  sizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  stockMap?: Record<string, number>;
  stockLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

const SizeGrid: React.FC<SizeGridProps> = ({
  sizes,
  selectedSize,
  onSelectSize,
  stockMap = {},
  stockLoading = false,
  disabled = false,
  className = "",
}) => {
  return (
    <div className={`grid grid-cols-3 gap-3 ${className}`}>
      {sizes.map((size) => {
        const stockQty = stockMap[size];
        const isOutOfStock = stockQty !== undefined && stockQty <= 0;
        const isSelected = selectedSize === size;
        const isDisabled = disabled || isOutOfStock || stockLoading;

        return (
          <button
            type="button"
            key={size}
            disabled={isDisabled}
            onClick={() => onSelectSize(size)}
            className={`
              relative py-3.5 h-12 text-sm transition-all duration-200
              flex items-center justify-center rounded-2xl border font-black uppercase tracking-wider w-full cursor-pointer
              ${
                isSelected
                  ? "bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] border-[var(--v2-accent,#2EE66A)] shadow-lg shadow-[var(--v2-accent,#2EE66A)]/20 scale-105"
                  : isOutOfStock
                  ? "bg-[#0A0A0A]/40 text-[var(--v2-text-muted,#666666)] border-[var(--v2-glass-border,rgba(255,255,255,0.04))] cursor-not-allowed opacity-40"
                  : "bg-[#0A0A0A] text-[var(--v2-text-primary,#F5F5F5)] border-[var(--v2-glass-border,rgba(255,255,255,0.12))] hover:border-[var(--v2-accent,#2EE66A)] hover:text-[var(--v2-accent,#2EE66A)]"
              }
            `}
          >
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[1.5px] bg-rose-500/50 rotate-12" />
              </div>
            )}

            {stockLoading ? (
              <span className="w-4 h-4 border-2 border-[var(--v2-accent,#2EE66A)] border-t-transparent rounded-full animate-spin" />
            ) : (
              size
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SizeGrid;
