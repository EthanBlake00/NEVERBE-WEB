"use client";
import React from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface PaginationProps {
  count: number;
  page: number;
  onChange: (page: number) => void;
  siblingCount?: number;
}

/**
 * Pagination - NEVERBE Theme (Supports Light & Dark Modes)
 */
const Pagination: React.FC<PaginationProps> = ({
  count,
  page,
  onChange,
  siblingCount = 1,
}) => {
  if (count <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    const leftSibling = Math.max(page - siblingCount, 1);
    const rightSibling = Math.min(page + siblingCount, count);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < count - 1;

    if (!showLeftDots && showRightDots) {
      for (let i = 1; i <= Math.min(3 + siblingCount * 2, count - 1); i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(count);
    } else if (showLeftDots && !showRightDots) {
      pages.push(1);
      pages.push("...");
      for (let i = Math.max(count - 2 - siblingCount * 2, 2); i <= count; i++) {
        pages.push(i);
      }
    } else if (showLeftDots && showRightDots) {
      pages.push(1);
      pages.push("...");
      for (let i = leftSibling; i <= rightSibling; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(count);
    } else {
      for (let i = 1; i <= count; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav
      className="flex items-center justify-center gap-2 py-4 md:py-6 animate-fade"
      aria-label="Pagination"
    >
      {/* --- PREVIOUS BUTTON --- */}
      <button
        type="button"
        onClick={() => page > 1 && onChange(page - 1)}
        disabled={page === 1}
        className={`
          group flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 p-0
          ${
            page === 1
              ? "border-[var(--v2-glass-border,rgba(255,255,255,0.08))] text-[var(--v2-text-muted,#666666)] opacity-40 cursor-not-allowed bg-transparent"
              : "border-[var(--v2-glass-border,rgba(255,255,255,0.15))] text-[var(--v2-text-primary,#F5F5F5)] bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] hover:border-[var(--v2-accent,#2EE66A)] hover:text-[var(--v2-accent,#2EE66A)] cursor-pointer shadow-sm"
          }
        `}
        aria-label="Previous page"
      >
        <IoChevronBack
          size={18}
          className="transition-transform group-hover:-translate-x-0.5"
        />
      </button>

      {/* --- PAGE NUMBERS --- */}
      <div className="flex items-center gap-1.5 mx-2">
        {pages.map((p, idx) =>
          p === "..." ? (
            <span
              key={`dots-${idx}`}
              className="px-2 text-[var(--v2-text-muted,#666666)] font-black tracking-widest text-xs"
            >
              ···
            </span>
          ) : (
            <button
              type="button"
              key={p}
              onClick={() => onChange(p)}
              className={`
                w-10 h-10 rounded-full text-xs font-black transition-all duration-300 tabular-nums p-0 flex items-center justify-center cursor-pointer
                ${
                  p === page
                    ? "bg-[var(--v2-accent,#2EE66A)] text-[var(--v2-accent-text,#0A0A0A)] font-black shadow-md scale-105 border border-[var(--v2-accent,#2EE66A)]"
                    : "text-[var(--v2-text-secondary,#A0A0A0)] bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] hover:text-[var(--v2-text-primary,#F5F5F5)] hover:border-[var(--v2-accent,#2EE66A)]"
                }
              `}
              aria-current={p === page ? "page" : undefined}
            >
              {p}
            </button>
          ),
        )}
      </div>

      {/* --- NEXT BUTTON --- */}
      <button
        type="button"
        onClick={() => page < count && onChange(page + 1)}
        disabled={page === count}
        className={`
          group flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 p-0
          ${
            page === count
              ? "border-[var(--v2-glass-border,rgba(255,255,255,0.08))] text-[var(--v2-text-muted,#666666)] opacity-40 cursor-not-allowed bg-transparent"
              : "border-[var(--v2-glass-border,rgba(255,255,255,0.15))] text-[var(--v2-text-primary,#F5F5F5)] bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] hover:border-[var(--v2-accent,#2EE66A)] hover:text-[var(--v2-accent,#2EE66A)] cursor-pointer shadow-sm"
          }
        `}
        aria-label="Next page"
      >
        <IoChevronForward
          size={18}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </button>
    </nav>
  );
};

export default Pagination;
