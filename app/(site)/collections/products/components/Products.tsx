"use client";
import React from "react";
import { Pagination, Button, Badge } from "antd";
import ProductsFilter from "./ProductsFilter";
import { IoOptionsOutline } from "react-icons/io5";
import { Product } from "@/interfaces/Product";
import SortDropdown from "@/components/SortDropdown";
import PopUpFilterPanel from "@/components/PopUpFilterPanel";
import { useProductListing } from "@/hooks/useProductListing";
import ProductGrid from "@/components/ProductGrid";

const Products = ({
  items,
  apiEndpoint = "/web/products",
}: {
  items: Product[];
  apiEndpoint?: string;
}) => {
  // Use the new Unified Hook
  // We don't initialize internal state from 'items' because the hook fetches fresh data
  // but we could pass 'items' as initial data if we wanted SSR hydration support primarily.
  // For now, maximizing simple client-side consistency.
  const {
    products,
    loading,
    total,
    page,
    totalPages,
    filters,
    setPage,
    setSort,
    setInStock,
    toggleBrand,
    toggleCategory,
    toggleSize,
    toggleOccasion,
    toggleStyle,
    resetFilters,
  } = useProductListing({
    apiEndpoint,
    defaultSize: 16,
  });

  // Local state for mobile drawer only (UI state, not data state)
  const [showFilter, setShowFilter] = React.useState(false);

  // Derive products to show:
  // If loading first time (products empty) but we have SSR items, maybe show SSR items?
  // But hook fetches immediately. Let's just rely on hook data.
  const displayProducts =
    products.length > 0 ? products : loading && items.length > 0 ? items : [];
  const showLoading = loading && displayProducts.length === 0;

  return (
    <section className="w-full max-w-content mx-auto px-1 sm:px-4 md:px-8 pb-20 flex flex-col gap-0 bg-surface">
      {/* 1. DESKTOP TOP FILTER TOOLBAR */}
      <ProductsFilter
        filters={filters}
        actions={{
          toggleBrand,
          toggleCategory,
          toggleSize,
          toggleOccasion,
          toggleStyle,
          setInStock,
          setSort,
          resetFilters,
        }}
      />

      {/* Mobile Filter Drawer - Antd Drawer */}
      {showFilter && (
        <PopUpFilterPanel
          selectedBrands={filters.brands}
          selectedCategories={filters.categories}
          selectedSizes={filters.sizes}
          selectedOccasions={filters.occasion}
          selectedStyles={filters.style}
          inStock={filters.inStock}
          onBrandToggle={toggleBrand}
          onCategoryToggle={toggleCategory}
          onSizeToggle={toggleSize}
          onOccasionToggle={toggleOccasion}
          onStyleToggle={toggleStyle}
          onInStockChange={setInStock}
          onReset={resetFilters}
          onClose={() => setShowFilter(false)}
        />
      )}

      <div className="flex-1 w-full">
        {/* Mobile Filter & Sort Action Row (Hidden on Desktop since it is embedded in top bar) */}
        <div className="relative z-20 py-2 flex lg:hidden justify-between items-center gap-3">
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] hover:border-[var(--v2-accent,#2EE66A)] transition-all text-xs font-extrabold uppercase tracking-wider cursor-pointer"
          >
            <IoOptionsOutline size={16} className="text-[var(--v2-accent,#2EE66A)]" />
            <span>Filters</span>
            {filters.brands.length +
              filters.categories.length +
              filters.sizes.length +
              filters.occasion.length +
              filters.style.length +
              (filters.inStock ? 1 : 0) >
              0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] text-[10px] font-black">
                {filters.brands.length +
                  filters.categories.length +
                  filters.sizes.length +
                  filters.occasion.length +
                  filters.style.length +
                  (filters.inStock ? 1 : 0)}
              </span>
            )}
          </button>

          <SortDropdown value={filters.sort} onChange={setSort} />
        </div>

        {/* 3. PRODUCT GRID */}
        <ProductGrid products={displayProducts} loading={showLoading} />

        {/* Pagination */}
        {total > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-24 border-t border-default pt-12">
            <Pagination
              current={page}
              total={total}
              defaultPageSize={20}
              onChange={(page) => setPage(page)}
              showSizeChanger={false}
              className="font-display font-bold uppercase"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
