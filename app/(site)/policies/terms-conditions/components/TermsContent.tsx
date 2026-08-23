"use client";

import React from "react";
import { termsAndConditions } from "@/constants";

const TermsContent = () => {
  return (
    <div className="flex flex-col gap-6">
      {termsAndConditions.map((item, index) => (
        <div
          key={index}
          className="v2-glass p-8 rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] hover:border-[var(--v2-accent,#2EE66A)] transition-all group"
        >
          <div className="flex items-center gap-4 mb-3">
            <span className="text-xs font-black uppercase tracking-widest text-[var(--v2-accent,#2EE66A)]">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="text-xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0">
              {item.title}
            </h2>
          </div>
          <p className="text-xs md:text-sm font-medium leading-relaxed text-[var(--v2-text-secondary,#A0A0A0)] whitespace-pre-line m-0">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TermsContent;
