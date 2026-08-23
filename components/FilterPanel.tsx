"use client";

import React, { useState } from "react";
import { useFilterData } from "@/hooks/useFilterData";
import { Switch } from "antd";
import { AVAILABLE_SIZES, OCCASIONS, STYLES } from "@/constants/filters";
import { IoOptionsOutline, IoChevronDownOutline, IoCloseOutline } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import SortDropdown from "@/components/SortDropdown";

interface FilterPanelProps {
  selectedBrands: string[];
  selectedCategories: string[];
  selectedSizes: string[];
  selectedOccasions: string[];
  selectedStyles: string[];
  inStock: boolean;
  sortValue?: string;
  onSortChange?: (val: string) => void;
  onBrandToggle: (brand: string) => void;
  onCategoryToggle: (category: string) => void;
  onSizeToggle: (size: string) => void;
  onOccasionToggle: (val: string) => void;
  onStyleToggle: (val: string) => void;
  onInStockChange: (value: boolean) => void;
  onReset: () => void;
  showCategories?: boolean;
  title?: string;
}

const QUICK_CATEGORIES = [
  "Sneakers",
  "Casual Shoes",
  "Running Shoes",
  "Slides & Sandals",
  "Boots",
  "Activewear",
  "Accessories",
];

const DesktopFilterGroup = ({
  title,
  items,
  selectedItems = [],
  onToggle,
}: {
  title: string;
  items: any[];
  selectedItems?: string[];
  onToggle: (label: string) => void;
}) => (
  <div className="flex flex-col gap-2">
    <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-muted,#666666)] m-0">
      {title}
    </h4>
    <div className="flex flex-wrap gap-1.5">
      {items.map((item, idx) => {
        const isSelected = selectedItems?.includes(item.label?.toLowerCase());
        return (
          <button
            key={idx}
            onClick={() => onToggle(item.label)}
            className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              isSelected
                ? "bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] border border-[var(--v2-accent,#2EE66A)] shadow-md"
                : "bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] text-[var(--v2-text-secondary,#A0A0A0)] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] hover:border-[var(--v2-accent,#2EE66A)] hover:text-[var(--v2-text-primary,#F5F5F5)]"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  </div>
);

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedBrands,
  selectedCategories,
  selectedSizes,
  selectedOccasions,
  selectedStyles,
  inStock,
  sortValue = "NO SELCT",
  onSortChange,
  onBrandToggle,
  onCategoryToggle,
  onSizeToggle,
  onOccasionToggle,
  onStyleToggle,
  onInStockChange,
  onReset,
  showCategories = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { brands, categories } = useFilterData(showCategories);

  const activeFilterCount =
    selectedBrands.length +
    selectedCategories.length +
    selectedSizes.length +
    selectedOccasions.length +
    selectedStyles.length +
    (inStock ? 1 : 0);

  return (
    <div className="hidden lg:block w-full mb-6 v2-landing">
      {/* 1. TOP HORIZONTAL TOOLBAR — FULLY FILLED WITH QUICK FILTERS + SORT */}
      <div className="flex items-center justify-between gap-4 p-2.5 px-4 rounded-2xl bg-[var(--v2-bg-surface,#141414)] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] shadow-lg">
        {/* Left Side: Filter Expand Button + In Stock Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              isExpanded || activeFilterCount > 0
                ? "bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] shadow-md"
                : "bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] text-[var(--v2-text-primary,#F5F5F5)] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] hover:border-[var(--v2-accent,#2EE66A)]"
            }`}
          >
            <IoOptionsOutline size={16} />
            <span>{isExpanded ? "Hide Filters" : "All Filters"}</span>
            {activeFilterCount > 0 && (
              <span className="ml-0.5 px-2 py-0.5 rounded-full bg-[#0A0A0A] text-[var(--v2-accent,#2EE66A)] text-[10px] font-black">
                {activeFilterCount}
              </span>
            )}
            <IoChevronDownOutline
              size={14}
              className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>

          {/* Quick In Stock Switch */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
            <span className="text-[10px] font-black uppercase tracking-wider text-[var(--v2-text-secondary,#A0A0A0)]">
              In Stock
            </span>
            <Switch
              checked={inStock}
              onChange={onInStockChange}
              size="small"
              style={{ background: inStock ? "var(--v2-accent,#2EE66A)" : undefined }}
            />
          </div>
        </div>

        {/* Middle Section: Quick Category Pills Filling Empty Space */}
        {showCategories && (
          <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5 mx-2">
            {QUICK_CATEGORIES.map((cat) => {
              const isSelected = selectedCategories.includes(cat.toLowerCase());
              return (
                <button
                  key={cat}
                  onClick={() => onCategoryToggle(cat)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] border border-[var(--v2-accent,#2EE66A)] shadow-md"
                      : "bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] text-[var(--v2-text-secondary,#A0A0A0)] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] hover:border-[var(--v2-accent,#2EE66A)] hover:text-[var(--v2-text-primary,#F5F5F5)]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Right Side: Clear All + Integrated SortDropdown */}
        <div className="flex items-center gap-3 shrink-0">
          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              <IoCloseOutline size={14} />
              <span>Clear ({activeFilterCount})</span>
            </button>
          )}

          {/* Integrated Sort Dropdown */}
          {onSortChange && (
            <SortDropdown value={sortValue} onChange={onSortChange} />
          )}
        </div>
      </div>

      {/* 2. EXPANDABLE FULL-WIDTH FILTER PANEL */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden rounded-3xl bg-[var(--v2-bg-surface,#141414)] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] shadow-2xl p-6 backdrop-blur-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sizes */}
              <div className="flex flex-col gap-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-muted,#666666)] m-0">
                  Select Size
                </h4>
                <div className="grid grid-cols-4 gap-1.5">
                  {AVAILABLE_SIZES.map((size) => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => onSizeToggle(size)}
                        className={`py-1.5 rounded-xl text-[10px] font-black text-center transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] border border-[var(--v2-accent,#2EE66A)] shadow-md"
                            : "bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] text-[var(--v2-text-secondary,#A0A0A0)] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] hover:border-[var(--v2-accent,#2EE66A)] hover:text-[var(--v2-text-primary,#F5F5F5)]"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Categories */}
              {showCategories && (
                <DesktopFilterGroup
                  title="Category"
                  items={categories}
                  selectedItems={selectedCategories}
                  onToggle={onCategoryToggle}
                />
              )}

              {/* Brands */}
              <DesktopFilterGroup
                title="Brands"
                items={brands}
                selectedItems={selectedBrands}
                onToggle={onBrandToggle}
              />

              {/* Occasion & Style */}
              <div className="flex flex-col gap-4">
                <DesktopFilterGroup
                  title="Occasion"
                  items={OCCASIONS.map((o) => ({ label: o }))}
                  selectedItems={selectedOccasions}
                  onToggle={onOccasionToggle}
                />
                <DesktopFilterGroup
                  title="Style"
                  items={STYLES.map((s) => ({ label: s }))}
                  selectedItems={selectedStyles}
                  onToggle={onStyleToggle}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterPanel;
