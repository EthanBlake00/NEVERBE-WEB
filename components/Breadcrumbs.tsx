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
 * Breadcrumbs - NEVERBE CSS Variable Dynamic Contrast Theme
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = "" }) => {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider overflow-x-auto hide-scrollbar max-w-full py-0.5 ${className}`}
    >
      {/* Home Icon */}
      <Link
        href="/"
        className="v2-breadcrumb-link flex items-center shrink-0"
        aria-label="Home"
      >
        <IoHomeOutline size={16} className="v2-breadcrumb-icon shrink-0" />
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <IoChevronForward size={12} className="v2-breadcrumb-icon shrink-0 opacity-70" />

          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className="v2-breadcrumb-link shrink-0 truncate max-w-[160px] md:max-w-none"
            >
              {item.label}
            </Link>
          ) : (
            <span className="v2-breadcrumb-current shrink-0 truncate max-w-[200px] md:max-w-none">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
