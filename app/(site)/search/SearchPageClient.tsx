"use client";

import React from "react";
import { Product } from "@/interfaces/Product";
import ProductGrid from "@/components/ProductGrid";
import { Typography, Breadcrumb, Flex } from "antd";
import Link from "next/link";

const { Title, Text } = Typography;

interface SearchPageClientProps {
  query: string;
  products: Product[];
}

export default function SearchPageClient({ query, products }: SearchPageClientProps) {
  return (
    <div className="w-full min-h-screen bg-[var(--v2-bg-surface,#141414)]">
      {/* Hero Header */}
      <div className="bg-[var(--v2-bg-surface,#141414)] border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))] pt-28 pb-10 md:pt-36 md:pb-14">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--v2-text-muted,#666666)] mb-3">
            <Link href="/" className="hover:text-[var(--v2-accent,#2EE66A)] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[var(--v2-text-primary,#F5F5F5)]">Search Results</span>
          </nav>

          <span className="v2-section-label mb-2">SEARCH RESULTS</span>
          <h1 className="v2-section-title text-[clamp(2.2rem,5vw,4rem)] font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] mb-3">
            {products.length > 0 ? (
              <>
                Results for <span className="text-[var(--v2-accent,#2EE66A)]">"{query}"</span>
              </>
            ) : (
              <>
                No results for <span className="text-[var(--v2-accent,#2EE66A)]">"{query}"</span>
              </>
            )}
          </h1>
          <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--v2-text-secondary,#A0A0A0)] m-0">
            Found <span className="text-[var(--v2-accent,#2EE66A)] font-black">{products.length}</span> {products.length === 1 ? "PRODUCT" : "PRODUCTS"}
          </p>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-16">
        <ProductGrid 
          products={products} 
          loading={false} 
          emptyHeading="We couldn't find any matches"
          emptySubHeading="Try checking your spelling or using more general terms."
        />
      </div>
    </div>
  );
}
