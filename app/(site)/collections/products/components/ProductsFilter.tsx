"use client";
import React from "react";
import FilterPanel from "@/components/FilterPanel";

interface ProductsFilterProps {
  filters: {
    brands: string[];
    categories: string[];
    sizes: string[];
    occasion: string[];
    style: string[];
    inStock: boolean;
    sort: string;
  };
  actions: {
    toggleBrand: (brand: string) => void;
    toggleCategory: (category: string) => void;
    toggleSize: (size: string) => void;
    toggleOccasion: (val: string) => void;
    toggleStyle: (val: string) => void;
    setInStock: (val: boolean) => void;
    setSort: (val: string) => void;
    resetFilters: () => void;
  };
}

const ProductsFilter = ({ filters, actions }: ProductsFilterProps) => {
  return (
    <FilterPanel
      selectedBrands={filters.brands}
      selectedCategories={filters.categories}
      selectedSizes={filters.sizes}
      selectedOccasions={filters.occasion}
      selectedStyles={filters.style}
      inStock={filters.inStock}
      sortValue={filters.sort}
      onSortChange={actions.setSort}
      onBrandToggle={actions.toggleBrand}
      onCategoryToggle={actions.toggleCategory}
      onSizeToggle={actions.toggleSize}
      onOccasionToggle={actions.toggleOccasion}
      onStyleToggle={actions.toggleStyle}
      onInStockChange={actions.setInStock}
      onReset={actions.resetFilters}
    />
  );
};

export default ProductsFilter;
