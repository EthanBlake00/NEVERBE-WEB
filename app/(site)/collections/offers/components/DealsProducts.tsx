"use client";
import React from "react";
import Pagination from "@/components/Pagination";
import DealsFilter from "./DealsFilter";
import { IoOptionsOutline } from "react-icons/io5";
import { AnimatePresence } from "framer-motion";
import { Product } from "@/interfaces/Product";
import SortDropdown from "@/components/SortDropdown";
import PopUpFilterPanel from "@/components/PopUpFilterPanel";
import { useProductListing } from "@/hooks/useProductListing";
import ProductGrid from "@/components/ProductGrid";

const DealsProducts = ({ items }: { items: Product[] }) => {
  // Use the new Unified Hook with Deals API
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
    resetFilters,
  } = useProductListing({
    apiEndpoint: "/web/products/deals",
  });

  const [showFilter, setShowFilter] = React.useState(false);

  const displayProducts =
    products.length > 0 ? products : loading && items.length > 0 ? items : [];
  const showLoading = loading && displayProducts.length === 0;

  return (
    <section className="w-full max-w-content mx-auto px-1 sm:px-4 md:px-8 pb-20 flex flex-col gap-0">
      {/* 1. DESKTOP TOP FILTER TOOLBAR */}
      <DealsFilter
        filters={filters}
        actions={{
          toggleBrand,
          toggleCategory,
          toggleSize,
          setInStock,
          resetFilters,
        }}
      />

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showFilter && (
          <PopUpFilterPanel
            selectedBrands={filters.brands}
            selectedCategories={filters.categories}
            selectedSizes={filters.sizes}
            inStock={filters.inStock}
            onBrandToggle={toggleBrand}
            onCategoryToggle={toggleCategory}
            onSizeToggle={toggleSize}
            onInStockChange={setInStock}
            selectedOccasions={[]}
            selectedStyles={[]}
            onOccasionToggle={() => {}}
            onStyleToggle={() => {}}
            onReset={resetFilters}
            onClose={() => setShowFilter(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex-1 w-full">
        {/* Mobile Action Row */}
        <div className="relative z-20 py-2 flex lg:hidden justify-between items-center gap-3">
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] hover:border-[var(--v2-accent,#2EE66A)] transition-all text-xs font-extrabold uppercase tracking-wider cursor-pointer"
          >
            <IoOptionsOutline size={16} className="text-[var(--v2-accent,#2EE66A)]" />
            <span>Filters</span>
          </button>

          <SortDropdown value={filters.sort} onChange={setSort} />
        </div>

        {/* 3. PRODUCT GRID */}
        <ProductGrid
          products={displayProducts}
          loading={showLoading}
          emptyHeading="No Deals Found"
        />

        {/* Pagination */}
        {total > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-24 border-t border-default pt-12">
            <Pagination count={totalPages} page={page} onChange={setPage} />
          </div>
        )}
      </div>
    </section>
  );
};

export default DealsProducts;
