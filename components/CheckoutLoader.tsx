"use client";
import React from "react";

const CheckoutLoader = () => {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center">
      {/* Dark Glass Overlay */}
      <div className="absolute inset-0 bg-[#0A0A0A]/90 backdrop-blur-2xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center p-8 bg-[var(--v2-bg-surface,#141414)] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] rounded-3xl max-w-sm w-full mx-4 shadow-2xl">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-[var(--v2-accent,#2EE66A)]/20 animate-ping" />
          <div className="w-10 h-10 rounded-full border-2 border-t-[var(--v2-accent,#2EE66A)] border-r-[var(--v2-accent,#2EE66A)] border-b-transparent border-l-transparent animate-spin" />
        </div>

        <div className="space-y-1">
          <span className="v2-section-label text-[9px] mb-0.5">SECURE TRANSACTION</span>
          <h2 className="text-xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0">
            Processing Order
          </h2>
          <p className="text-xs text-[var(--v2-text-secondary,#A0A0A0)] font-medium m-0">
            Please wait while we confirm your reservation
          </p>
        </div>

        <span className="text-[10px] uppercase font-black tracking-widest text-[var(--v2-accent,#2EE66A)] animate-pulse">
          Do not refresh or close this window
        </span>
      </div>
    </div>
  );
};

export default CheckoutLoader;
