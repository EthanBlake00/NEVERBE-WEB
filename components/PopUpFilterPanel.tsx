"use client";

import React from "react";
import { Drawer, Switch } from "antd";
import { IoCloseOutline } from "react-icons/io5";
import { useFilterData } from "@/hooks/useFilterData";
import { AVAILABLE_SIZES, OCCASIONS, STYLES } from "@/constants/filters";

interface PopUpFilterPanelProps {
  selectedBrands: string[];
  selectedCategories: string[];
  selectedSizes: string[];
  selectedOccasions: string[];
  selectedStyles: string[];
  inStock: boolean;
  onBrandToggle: (brand: string) => void;
  onCategoryToggle: (category: string) => void;
  onSizeToggle: (size: string) => void;
  onOccasionToggle: (val: string) => void;
  onStyleToggle: (val: string) => void;
  onInStockChange: (value: boolean) => void;
  onReset: () => void;
  onClose: () => void;
  showCategories?: boolean;
}

const FilterList = ({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: any[];
  selected: string[];
  onToggle: (label: string) => void;
}) => (
  <div className="py-5 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
    <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--v2-text-muted,#666666)] mb-3">
      {title}
    </h3>
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => {
        const isActive = selected.includes(item.label?.toLowerCase());
        return (
          <button
            key={i}
            onClick={() => onToggle(item.label)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              isActive
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

const PopUpFilterPanel: React.FC<PopUpFilterPanelProps> = ({
  selectedBrands,
  selectedCategories,
  selectedSizes,
  selectedOccasions,
  selectedStyles,
  inStock,
  onBrandToggle,
  onCategoryToggle,
  onSizeToggle,
  onOccasionToggle,
  onStyleToggle,
  onInStockChange,
  onReset,
  onClose,
  showCategories = true,
}) => {
  const { brands, categories } = useFilterData(showCategories);
  const activeFilterCount =
    selectedBrands.length +
    selectedCategories.length +
    selectedSizes.length +
    selectedOccasions.length +
    selectedStyles.length +
    (inStock ? 1 : 0);

  return (
    <Drawer
      open
      onClose={onClose}
      placement="right"
      width={360}
      styles={{
        header: {
          background: "var(--v2-bg-surface, #141414)",
          borderBottom: "1px solid var(--v2-glass-border, rgba(255, 255, 255, 0.08))",
          padding: "16px 20px",
        },
        body: {
          background: "var(--v2-bg-surface, #141414)",
          padding: 0,
          display: "flex",
          flexDirection: "column",
        },
        footer: {
          background: "var(--v2-bg-surface, #141414)",
          borderTop: "1px solid var(--v2-glass-border, rgba(255, 255, 255, 0.08))",
          padding: "16px 20px",
        },
        content: { borderRadius: "24px 0 0 24px", overflow: "hidden" },
      }}
      title={
        <div className="flex items-center gap-2">
          <span className="font-display font-extrabold text-base uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)]">
            Filters
          </span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] text-[10px] font-black">
              {activeFilterCount}
            </span>
          )}
        </div>
      }
      closeIcon={
        <IoCloseOutline
          size={24}
          className="text-[var(--v2-text-secondary,#A0A0A0)] hover:text-[var(--v2-text-primary,#F5F5F5)] transition-colors"
        />
      }
      footer={
        <div className="flex gap-3">
          <button
            onClick={onReset}
            disabled={activeFilterCount === 0}
            className={`flex-1 py-3 rounded-full text-[11px] font-extrabold uppercase tracking-wider transition-all border cursor-pointer ${
              activeFilterCount > 0
                ? "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
                : "bg-transparent text-[var(--v2-text-muted,#666666)] border-[var(--v2-glass-border,rgba(255,255,255,0.08))] opacity-40 cursor-not-allowed"
            }`}
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-2 py-3 rounded-full bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] text-[11px] font-black uppercase tracking-wider hover:bg-[#3AF07A] transition-all shadow-lg cursor-pointer"
          >
            View Results
          </button>
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto px-5 hide-scrollbar">
        {/* In Stock */}
        <div className="flex justify-between items-center py-4 border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--v2-text-secondary,#A0A0A0)]">
            In Stock Only
          </span>
          <Switch
            checked={inStock}
            onChange={onInStockChange}
            size="small"
            style={{ background: inStock ? "var(--v2-accent,#2EE66A)" : undefined }}
          />
        </div>

        {/* Sizes */}
        <div className="py-5 border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
          <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--v2-text-muted,#666666)] mb-3">
            Size
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {AVAILABLE_SIZES.map((size) => {
              const isActive = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => onSizeToggle(size)}
                  className={`py-2 rounded-xl text-[11px] font-extrabold text-center transition-all duration-200 cursor-pointer ${
                    isActive
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

        {showCategories && (
          <FilterList
            title="Category"
            items={categories}
            selected={selectedCategories}
            onToggle={onCategoryToggle}
          />
        )}

        <FilterList
          title="Brand"
          items={brands}
          selected={selectedBrands}
          onToggle={onBrandToggle}
        />

        <FilterList
          title="Occasion"
          items={OCCASIONS.map((o) => ({ label: o }))}
          selected={selectedOccasions}
          onToggle={onOccasionToggle}
        />

        <FilterList
          title="Style"
          items={STYLES.map((s) => ({ label: s }))}
          selected={selectedStyles}
          onToggle={onStyleToggle}
        />

        <div className="h-6" />
      </div>
    </Drawer>
  );
};

export default PopUpFilterPanel;
