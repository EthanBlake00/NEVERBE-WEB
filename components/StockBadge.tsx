"use client";

import React from "react";
import { IoFlameOutline } from "react-icons/io5";

interface StockBadgeProps {
  stockCount: number;
  lowStockThreshold?: number;
  className?: string;
}

/**
 * StockBadge - NEVERBE High-Contrast Stock Alert
 * Works perfectly in both dark and light modes.
 */
const StockBadge: React.FC<StockBadgeProps> = ({
  stockCount,
  lowStockThreshold = 5,
  className = "",
}) => {
  if (stockCount <= 0 || stockCount > lowStockThreshold) {
    return null;
  }

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3.5 py-1.5 
        bg-[var(--v2-accent,#2EE66A)]/15 text-[var(--v2-accent,#2EE66A)] border border-[var(--v2-accent,#2EE66A)]/35
        rounded-full transition-all animate-fade ${className}
      `}
    >
      <div className="relative flex items-center justify-center shrink-0">
        <IoFlameOutline size={14} className="relative z-10 animate-pulse text-[var(--v2-accent,#2EE66A)]" />
      </div>

      <span className="text-[10px] font-black uppercase tracking-wider">
        Critical: Only {stockCount} {stockCount === 1 ? "Unit" : "Units"} Left
      </span>
    </div>
  );
};

export default StockBadge;
