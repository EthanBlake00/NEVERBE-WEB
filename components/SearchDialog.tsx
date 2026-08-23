"use client";
import React from "react";
import SearchResultCard from "@/components/SearchResultCard";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/interfaces/Product";

interface SearchDialogProps {
  results: Product[];
  recommendations?: Product[];
  onClick: () => void;
  containerStyle?: string;
  maxHeight?: string;
}

const SearchDialog: React.FC<SearchDialogProps> = ({
  results,
  recommendations = [],
  onClick,
  containerStyle,
  maxHeight = "60vh",
}) => {
  const isGridMode = containerStyle?.includes("grid");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`w-full text-[var(--v2-text-primary,#F5F5F5)] overflow-hidden flex flex-col ${
          containerStyle ||
          "v2-glass rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] absolute top-14 right-0 lg:w-[600px] z-50 shadow-2xl"
        }`}
        style={{ maxHeight: isGridMode ? undefined : maxHeight }}
      >
        {results.length > 0 ? (
          isGridMode ? (
            <>
              {results.map((result, index) => (
                <motion.div
                  key={result.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <SearchResultCard
                    item={result}
                    onClick={onClick}
                    variant="card"
                  />
                </motion.div>
              ))}
            </>
          ) : (
            <ul className="flex flex-col overflow-y-auto hide-scrollbar bg-[var(--v2-bg-surface,#141414)] m-0 p-0 list-none">
              {results.map((result, index) => (
                <motion.li
                  key={result.id || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-[var(--v2-glass-border,rgba(255,255,255,0.06))] last:border-none group"
                >
                  <SearchResultCard
                    item={result}
                    onClick={onClick}
                    variant="list"
                  />
                </motion.li>
              ))}
            </ul>
          )
        ) : recommendations.length > 0 ? (
          <div className="flex flex-col w-full h-full p-6 animate-fade bg-[var(--v2-bg-surface,#141414)]">
            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--v2-accent,#2EE66A)] mb-6 flex items-center gap-3 m-0">
              <span className="w-8 h-px bg-[var(--v2-accent,#2EE66A)]/30"></span>
              Trending Now
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
              {recommendations.map((result, index) => (
                <motion.div
                  key={result.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SearchResultCard
                    item={result}
                    onClick={onClick}
                    variant="card"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-[var(--v2-bg-surface,#141414)]">
            <p className="text-xs font-black uppercase tracking-widest text-[var(--v2-text-muted,#666666)] m-0">
              No matching products found
            </p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchDialog;
