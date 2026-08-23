import React from "react";
import { Metadata } from "next";
import CheckoutForm from "@/app/(site)/checkout/components/CheckoutForm";
import AnonymousConversionBanner from "@/components/AnonymousConversionBanner";

export const metadata: Metadata = {
  title: "Secure Checkout | Neverbe",
};

const Page = () => {
  return (
    <main className="w-full min-h-screen bg-[var(--v2-bg-surface,#141414)] text-[var(--v2-text-primary,#F5F5F5)] pt-14 md:pt-16 pb-16">
      {/* Compact Header */}
      <div className="w-full border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))] py-4 text-center">
        <span className="v2-section-label text-[9px] mb-0.5">EXPRESS CHECKOUT</span>
        <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0">
          Secure Checkout
        </h1>
      </div>
      <AnonymousConversionBanner />

      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 mt-4">
        <CheckoutForm />
      </div>
    </main>
  );
};

export default Page;
