"use client";

import React, { useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuArrowUpDown, LuChevronDown } from "react-icons/lu";
import { useClickOutside } from "@/hooks/useClickOutside";
import { sortingOptions } from "@/constants";

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SortDropdown: React.FC<SortDropdownProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => setIsOpen(false), []);
  useClickOutside(dropdownRef, closeDropdown, isOpen);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const activeOption = sortingOptions.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Sleek Pill Sort Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] hover:border-[var(--v2-accent,#2EE66A)] transition-all duration-300 text-[var(--v2-text-primary,#F5F5F5)] cursor-pointer text-xs font-extrabold uppercase tracking-wider"
        aria-label="Sort options"
      >
        <LuArrowUpDown
          size={15}
          className={`transition-colors ${
            isOpen ? "text-[var(--v2-accent,#2EE66A)]" : "text-[var(--v2-accent,#2EE66A)]"
          }`}
        />
        <span className="hidden sm:inline">
          {activeOption && activeOption.value !== "NO SELCT"
            ? activeOption.name
            : "Sort By"}
        </span>
        <span className="sm:hidden">Sort</span>
        <LuChevronDown
          size={14}
          className={`transition-transform duration-300 text-[var(--v2-text-muted,#666666)] ${
            isOpen ? "rotate-180 text-[var(--v2-accent,#2EE66A)]" : ""
          }`}
        />
      </button>

      {/* DROPDOWN MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ type: "spring", damping: 22, stiffness: 350 }}
            className="absolute right-0 mt-2 w-[210px] bg-[var(--v2-bg-surface,#141414)] border border-[var(--v2-glass-border,rgba(255,255,255,0.12))] shadow-2xl z-50 py-2 rounded-2xl overflow-hidden backdrop-blur-xl"
          >
            {sortingOptions.map((opt, i) => {
              const isSelected = value === opt.value;
              return (
                <li
                  key={i}
                  onClick={() => handleSelect(opt.value)}
                  className={`
                    px-4 py-2.5 cursor-pointer transition-all duration-200 flex items-center justify-between group
                    ${isSelected ? "bg-[var(--v2-glass-bg-hover,rgba(255,255,255,0.08))]" : "hover:bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))]"}`}
                >
                  <span
                    className={`text-[11px] uppercase tracking-wider transition-colors ${
                      isSelected
                        ? "text-[var(--v2-accent,#2EE66A)] font-extrabold"
                        : "text-[var(--v2-text-secondary,#A0A0A0)] font-bold group-hover:text-[var(--v2-text-primary,#F5F5F5)]"
                    }`}
                  >
                    {opt.name}
                  </span>

                  {isSelected && (
                    <div className="w-1.5 h-1.5 bg-[var(--v2-accent,#2EE66A)] rounded-full shadow-[0_0_8px_rgba(46,230,106,0.6)]" />
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SortDropdown;
