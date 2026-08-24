"use client";

import React from "react";
import Link from "next/link";
import { IoChevronForward, IoHomeOutline } from "react-icons/io5";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumbs - NEVERBE Theme (Supports Light & Dark Modes)
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = "" }) => {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider overflow-x-auto hide-scrollbar max-w-full py-2 ${className}`}
    >
      {/* Home Icon */}
      <Link
        href="/"
        className="text-[var(--v2-text-secondary)] hover:text-[var(--v2-accent)] transition-colors flex items-center shrink-0"
        aria-label="Home"
      >
        <IoHomeOutline size={16} className="shrink-0 text-[var(--v2-text-secondary)]" />
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <IoChevronForward size={12} className="text-[var(--v2-text-muted)] shrink-0 opacity-70" />

          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="text-[var(--v2-text-secondary)] hover:text-[var(--v2-accent)] transition-colors shrink-0 truncate max-w-[160px] md:max-w-none"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[var(--v2-text-primary)] font-black shrink-0 truncate max-w-[200px] md:max-w-none">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
