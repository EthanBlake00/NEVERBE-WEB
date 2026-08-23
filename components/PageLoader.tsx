"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * PageLoader - NEVERBE 2026 Theme System
 * Full-page loading overlay with glowing brand pulse & dark glass backdrop.
 */
const PageLoader = () => {
  return (
    <main className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden bg-[var(--v2-bg-surface,#141414)] text-[var(--v2-text-primary,#F5F5F5)] transition-colors duration-300">
      {/* Radial Glow Mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[var(--v2-accent,#2EE66A)]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Center Branding & Loader */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Animated Brand Logo Icon Ring */}
        <div className="relative flex items-center justify-center w-20 h-20">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[var(--v2-accent,#2EE66A)]/20 border-t-[var(--v2-accent,#2EE66A)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border border-dashed border-[var(--v2-accent,#2EE66A)]/40"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <span className="font-black text-xl tracking-tighter text-[var(--v2-accent,#2EE66A)] font-display">
            N
          </span>
        </div>

        {/* Text & Pulse */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-[var(--v2-text-primary,#F5F5F5)]">
            NEVERBE
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--v2-accent,#2EE66A)] animate-pulse">
            LOADING EXPERIENCE...
          </span>
        </div>
      </div>
    </main>
  );
};

export default PageLoader;
