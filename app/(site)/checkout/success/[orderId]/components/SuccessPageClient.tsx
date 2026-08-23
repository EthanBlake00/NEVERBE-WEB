"use client";

import Link from "next/link";
import { Order } from "@/interfaces";
import SuccessAnimationComponents from "./SuccessAnimationComponents";
import { IoArrowForward } from "react-icons/io5";

export default function SuccessPageClient({ order }: { order: Order }) {
  return (
    <main className="w-full min-h-screen bg-[var(--v2-bg-surface,#141414)] text-[var(--v2-text-primary,#F5F5F5)] pt-28 pb-20 px-4 md:px-8 flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-xl animate-fadeIn v2-glass p-8 sm:p-12 rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
        <SuccessAnimationComponents />

        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-none mb-3 text-[var(--v2-text-primary,#F5F5F5)] m-0">
          Order Confirmed!
        </h1>

        <p className="text-xs sm:text-sm text-[var(--v2-text-secondary,#A0A0A0)] font-medium mb-6 leading-relaxed m-0">
          Thank you, <span className="text-[var(--v2-text-primary,#F5F5F5)] font-bold">{order.customer.name.split(" ")[0]}</span>. Your order is registered &amp; being prepared.
        </p>

        <div className="inline-block px-4 py-1.5 bg-[var(--v2-accent,#2EE66A)]/10 border border-[var(--v2-accent,#2EE66A)]/30 rounded-full mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-primary,#F5F5F5)] m-0">
            Order ID: <span className="text-[var(--v2-accent,#2EE66A)]">#{order.orderId}</span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
          <Link
            href="/collections/products"
            className="flex-1 py-3.5 px-6 bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] font-black uppercase tracking-widest text-xs rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
          >
            <span>Continue Shopping</span>
            <IoArrowForward size={16} />
          </Link>

          <Link
            href="/account"
            className="flex-1 py-3.5 px-6 bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] font-black uppercase tracking-widest text-xs rounded-full flex items-center justify-center gap-2 hover:border-[var(--v2-accent,#2EE66A)] transition-all"
          >
            Go to Account
          </Link>
        </div>

        <p className="mt-8 text-[10px] text-[var(--v2-text-muted,#666666)] font-extrabold uppercase tracking-widest m-0">
          Confirmation receipt sent to {order.customer.email}
        </p>
      </div>
    </main>
  );
}
