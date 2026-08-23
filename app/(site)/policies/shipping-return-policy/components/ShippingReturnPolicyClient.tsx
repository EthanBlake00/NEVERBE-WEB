"use client";

import ShippingReturnPolicyContent from "./ShippingReturnPolicyContent";

const ShippingReturnPolicyClient = () => {
  return (
    <main className="w-full bg-[var(--v2-bg-surface,#141414)] text-[var(--v2-text-primary,#F5F5F5)] min-h-screen pt-28 md:pt-36 pb-20">
      {/* 1. HERO SECTION */}
      <section className="w-full px-4 md:px-8 mb-12">
        <div className="max-w-[1200px] mx-auto">
          <span className="v2-section-label mb-3">ISLAND-WIDE DELIVERY &amp; EXCHANGES</span>
          <h1 className="text-[clamp(2.5rem,7vw,5rem)] font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] mb-4 m-0 leading-tight">
            Shipping &amp; Returns
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <p className="text-xs font-black uppercase tracking-widest text-[var(--v2-text-secondary,#A0A0A0)] m-0">
              Customer Support
            </p>
            <div className="h-px w-8 bg-[var(--v2-glass-border,rgba(255,255,255,0.15))]"></div>
            <p className="text-xs font-black uppercase tracking-widest text-[var(--v2-accent,#2EE66A)] m-0">
              7-Day Size Exchange Guarantee
            </p>
          </div>
        </div>
      </section>

      {/* 2. CONTENT SECTION */}
      <section className="w-full border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))] px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-[1200px] mx-auto">
          <ShippingReturnPolicyContent />
        </div>
      </section>
    </main>
  );
};

export default ShippingReturnPolicyClient;
