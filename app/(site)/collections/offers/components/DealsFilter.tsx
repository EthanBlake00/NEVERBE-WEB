"use client";
import FilterPanel from "@/components/FilterPanel";

interface DealsFilterProps {
  filters: {
    brands: string[];
    categories: string[];
    sizes: string[];
    inStock: boolean;
  };
  actions: {
    toggleBrand: (brand: string) => void;
    toggleCategory: (category: string) => void;
    toggleSize: (size: string) => void;
    setInStock: (val: boolean) => void;
    resetFilters: () => void;
  };
}

const DealsFilter = ({ filters, actions }: DealsFilterProps) => {
  return (
    <FilterPanel
      selectedBrands={filters.brands}
      selectedCategories={filters.categories}
      selectedSizes={filters.sizes}
      inStock={filters.inStock}
      onBrandToggle={actions.toggleBrand}
      onCategoryToggle={actions.toggleCategory}
      onSizeToggle={actions.toggleSize}
      onInStockChange={actions.setInStock}
      selectedOccasions={[]}
      selectedStyles={[]}
      onOccasionToggle={() => {}}
      onStyleToggle={() => {}}
      onReset={actions.resetFilters}
    />
  );
};

export default DealsFilter;
