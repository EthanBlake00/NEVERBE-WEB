"use client";
import React from "react";
import { motion } from "framer-motion";

/**
 * ComponentLoader - NEVERBE 2026 Theme System
 * Dark surface loading spinner for page & tab state transitions.
 */
const ComponentLoader = () => {
  return (
    <div className="fixed inset-0 w-full h-full z-50 overflow-hidden flex items-center justify-center bg-[var(--v2-bg-surface,#141414)] text-[var(--v2-text-primary,#F5F5F5)]">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[var(--v2-accent,#2EE66A)]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Spinner & Brand Icon */}
      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="relative flex items-center justify-center w-16 h-16">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[var(--v2-accent,#2EE66A)]/20 border-t-[var(--v2-accent,#2EE66A)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-1.5 rounded-full border border-dashed border-[var(--v2-accent,#2EE66A)]/40"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <span className="font-black text-lg text-[var(--v2-accent,#2EE66A)]">
            N
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[var(--v2-text-primary,#F5F5F5)]">
            NEVERBE
          </span>
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[var(--v2-accent,#2EE66A)] animate-pulse">
            LOADING...
          </span>
        </div>
      </div>
    </div>
  );
};

export default ComponentLoader;
