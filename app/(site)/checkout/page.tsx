import React from "react";
import { Metadata } from "next";
import CheckoutForm from "@/app/(site)/checkout/components/CheckoutForm";
import AnonymousConversionBanner from "@/components/AnonymousConversionBanner";

export const metadata: Metadata = {
  title: "Secure Checkout | Neverbe",
};

const Page = () => {
  return (
    <main className="w-full min-h-screen bg-white pb-20">
      {/* Simple Header for Checkout Focus */}
      <div className="w-full border-b border-default py-6 text-center">
        <h1 className="text-2xl font-black uppercase tracking-tighter text-primary-dark">
          Checkout
        </h1>
      </div>
      <AnonymousConversionBanner />

      <div className="w-full max-w-content mx-auto px-2 md:px-8 mt-4 md:mt-8">
        <CheckoutForm />
      </div>
    </main>
  );
};

export default Page;
