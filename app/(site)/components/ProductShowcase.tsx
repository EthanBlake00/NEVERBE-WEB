"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ItemCard from "@/components/ItemCard";

interface ProductShowcaseProps {
  hotItems: any[];
  arrivals: any[];
}

export default function ProductShowcase({
  hotItems,
  arrivals,
}: ProductShowcaseProps) {
  const [activeTab, setActiveTab] = useState<"popular" | "new">("popular");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  const currentItems = activeTab === "popular" ? hotItems : arrivals;

  const tabs = [
    { id: "popular" as const, label: "Popular Now", count: hotItems.length },
    { id: "new" as const, label: "Just Dropped", count: arrivals.length },
  ];

  if (hotItems.length === 0 && arrivals.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 md:py-24"
      style={{ background: "var(--v2-bg-void)" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
        >
          <div>
            <span className="v2-section-label">Trending</span>
            <h2
              className="v2-section-title mt-2"
              style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
            >
              What&apos;s Hot
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Tabs */}
            <div
              className="flex gap-1 p-1"
              style={{
                background: "var(--v2-glass-bg)",
                border: "1px solid var(--v2-glass-border)",
                borderRadius: "var(--v2-radius-pill)",
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border-none outline-none"
                  style={{
                    borderRadius: "var(--v2-radius-pill)",
                    background:
                      activeTab === tab.id
                        ? "var(--v2-accent)"
                        : "transparent",
                    color:
                      activeTab === tab.id
                        ? "#0A0A0A"
                        : "var(--v2-text-secondary)",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* View All Link */}
            <Link
              href="/collections/products"
              className="hidden md:flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider transition-colors duration-300"
              style={{ color: "var(--v2-text-secondary)" }}
            >
              <span className="hover:text-[var(--v2-accent)]">View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {/* Horizontal Scroll Rail */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-4 md:gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent 0%, black 2%, black 98%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, black 2%, black 98%, transparent 100%)",
          }}
        >
          {currentItems.map((item, index) => (
            <div
              key={item.id}
              className="snap-start flex-shrink-0 w-[280px] sm:w-[320px] md:w-[350px] flex flex-col h-full"
            >
              <ItemCard item={item} priority={index < 4} />
            </div>
          ))}

          {/* View All Button & Text (No Card Container) */}
          <div className="flex-shrink-0 px-8 md:px-12 flex flex-col items-center justify-center snap-start">
            <Link
              href="/collections/products"
              className="flex flex-col items-center justify-center gap-3 group transition-transform hover:scale-105"
            >
              <div
                className="w-14 h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-lg"
                style={{
                  borderRadius: "50%",
                  background: "var(--v2-accent)",
                }}
              >
                <ArrowRight size={22} color="#0A0A0A" />
              </div>
              <span className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-[var(--v2-text-secondary)] group-hover:text-[var(--v2-accent)] transition-colors">
                View All
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile View All */}
        <div className="flex md:hidden justify-center mt-6">
          <Link href="/collections/products" className="v2-btn-ghost">
            View All Products
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
