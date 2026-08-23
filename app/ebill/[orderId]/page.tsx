import React from "react";
import axiosInstance from "@/actions/axiosInstance";
import { formatCurrency } from "@/utils/formatting";
import { notFound } from "next/navigation";
import EBillDownloadButton from "../components/EBillDownloadButton";
import { BusinessInfo } from "@/config/BusinessInfo";
import { Metadata } from "next";
import { formatSLDate } from "@/actions/utilAction";

export async function generateMetadata(props: { params: Promise<{ orderId: string }> }): Promise<Metadata> {
  const { orderId } = await props.params;
  const title = `Electronic Receipt #${orderId.toUpperCase()} - Neverbe`;
  const description = `View and download your official Neverbe electronic receipt for order #${orderId.toUpperCase()}. Digital billing made simple.`;
  const ogImage = "/ebill-og.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: "Neverbe Electronic Receipt" }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

const getOrder = async (orderId: string) => {
  try {
    const res = await axiosInstance.get(`/web/orders/${orderId}`);
    return { 
      order: res.data?.data || res.data, 
      daysRemaining: res.data?.daysRemaining,
      expired: false 
    };
  } catch (error: any) {
    if (error?.response?.status === 410) {
      return { order: null, daysRemaining: 0, expired: true };
    }
    return { order: null, daysRemaining: null, expired: false };
  }
};

export default async function EBillPage(props: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await props.params;
  const { order, expired, daysRemaining } = await getOrder(orderId);

  if (expired) {
    return (
      <div className="min-h-screen bg-[var(--v2-bg-surface,#141414)] text-[var(--v2-text-primary,#F5F5F5)] flex flex-col font-sans">
        {/* HEADER */}
        <div className="w-full border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))] bg-[var(--v2-bg-surface,#141414)] p-6 md:p-12">
          <div className="max-w-5xl mx-auto">
            <span className="v2-section-label mb-2">RECEIPT EXPIRED</span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0">
              Electronic Receipt
            </h1>
          </div>
        </div>

        {/* EXPIRED CONTENT */}
        <div className="flex-1 w-full p-6 md:p-12 bg-[var(--v2-bg-surface,#141414)] flex items-center justify-center">
          <div className="max-w-lg mx-auto text-center space-y-6 v2-glass p-10 rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] text-amber-400 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0">
                eBill Expired
              </h2>
              <p className="text-xs font-medium text-[var(--v2-text-secondary,#A0A0A0)] leading-relaxed m-0">
                This electronic receipt has expired. Receipts are accessible for 30 days from the purchase date.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-accent,#2EE66A)] m-0">
                Ref: #{orderId.toUpperCase()}
              </p>
              <p className="text-[10px] font-medium text-[var(--v2-text-muted,#666666)] uppercase tracking-wider m-0">
                Need assistance? Contact support at {BusinessInfo.phone}
              </p>
            </div>

            <a
              href="https://neverbe.lk"
              className="inline-block px-8 py-3.5 bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] text-xs font-black uppercase tracking-widest rounded-full hover:opacity-90 transition-all shadow-md mt-4"
            >
              Visit Neverbe Store
            </a>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="w-full border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))] p-8 text-center bg-[var(--v2-bg-surface,#141414)]">
          <a
            href="https://neverbe.lk"
            className="text-sm font-black uppercase tracking-widest text-[var(--v2-text-muted,#666666)] hover:text-[var(--v2-accent,#2EE66A)] transition-colors"
          >
            neverbe.lk
          </a>
        </footer>
      </div>
    );
  }

  if (!order) {
    return notFound();
  }

  // Raw subtotal BEFORE any discounts
  const rawSubtotal = order.items?.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0,
  ) || 0;

  // Total of all per-item discounts
  const itemDiscountTotal = order.items?.reduce(
    (sum: number, item: any) => sum + (item.discount || 0) * item.quantity,
    0,
  ) || 0;

  // Use the backend-calculated total directly
  const total = order.total || (rawSubtotal - itemDiscountTotal + (order.shippingFee || 0) + (order.fee || 0));

  return (
    <div className="min-h-screen bg-[var(--v2-bg-surface,#141414)] text-[var(--v2-text-primary,#F5F5F5)] flex flex-col font-sans">
      {/* HEADER SECTION */}
      <div className="w-full border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))] bg-[var(--v2-bg-surface,#141414)] p-6 md:p-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="v2-section-label mb-1">DIGITAL INVOICE</span>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0">
              Electronic Receipt
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-extrabold uppercase tracking-wider text-[var(--v2-text-secondary,#A0A0A0)]">
              <span>Ref: #{order.orderId?.toUpperCase()}</span>
              <span className="hidden sm:inline">•</span>
              <span>Issued: {formatSLDate(order.createdAt)}</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-[var(--v2-accent,#2EE66A)]">
                {daysRemaining !== undefined ? `Expires in ${daysRemaining} days` : "Lifetime Guarantee"}
              </span>
            </div>
          </div>
          <EBillDownloadButton order={order} />
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="flex-1 w-full p-6 md:p-12 bg-[var(--v2-bg-surface,#141414)]">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* TOP INFO: FROM / TO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))] pb-10">
            <div className="v2-glass p-6 rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-accent,#2EE66A)] block mb-2">Merchant Info</span>
              <div className="text-xs leading-relaxed space-y-1">
                <p className="text-base font-black uppercase text-[var(--v2-text-primary,#F5F5F5)] m-0 mb-1">{BusinessInfo.name}</p>
                <p className="text-[var(--v2-text-secondary,#A0A0A0)] m-0">{BusinessInfo.addressLine1}</p>
                <p className="text-[var(--v2-text-secondary,#A0A0A0)] m-0">{BusinessInfo.city}, Sri Lanka</p>
                <p className="text-[var(--v2-accent,#2EE66A)] font-bold m-0 mt-2">{BusinessInfo.phone}</p>
              </div>
            </div>

            <div className="v2-glass p-6 rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-accent,#2EE66A)] block mb-2">Billed To</span>
              {order.customer ? (
                <div className="text-xs leading-relaxed space-y-1">
                  <p className="text-base font-black uppercase text-[var(--v2-text-primary,#F5F5F5)] m-0 mb-1">
                    {order.customer.name || "Valued Customer"}
                  </p>
                  {order.customer.address && <p className="text-[var(--v2-text-secondary,#A0A0A0)] m-0">{order.customer.address}</p>}
                  {order.customer.city && <p className="text-[var(--v2-text-secondary,#A0A0A0)] m-0">{order.customer.city}</p>}
                  <p className="text-[var(--v2-accent,#2EE66A)] font-bold m-0 mt-2">{order.customer.phone}</p>
                </div>
              ) : (
                <p className="text-sm font-black uppercase text-[var(--v2-text-secondary,#A0A0A0)] m-0">Walk-in Customer</p>
              )}
            </div>
          </div>

          {/* ITEM LIST SECTION */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-[var(--v2-text-muted,#666666)] mb-6">
              Statement of Purchased Items
            </h3>
            
            {/* Mobile View */}
            <div className="block sm:hidden space-y-4">
              {order.items?.map((item: any, idx: number) => {
                const netPrice = item.price - (item.discount || 0);
                const hasDiscount = (item.discount || 0) > 0;
                return (
                  <div key={idx} className="v2-glass p-4 rounded-2xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      {item.thumbnail && (
                        <div className="w-12 h-12 bg-[#0A0A0A] shrink-0 rounded-xl overflow-hidden border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] p-1 flex items-center justify-center">
                          <img
                            src={item.thumbnail}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-black uppercase text-xs text-[var(--v2-text-primary,#F5F5F5)] m-0">{item.name}</p>
                        <p className="text-[10px] font-bold uppercase text-[var(--v2-text-muted,#666666)] tracking-wider m-0">
                          {item.size || "Free Size"} &times; {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-xs text-[var(--v2-accent,#2EE66A)] m-0">{formatCurrency(netPrice * item.quantity)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop View Table */}
            <div className="hidden sm:block overflow-x-auto v2-glass rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] p-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--v2-glass-border,rgba(255,255,255,0.1))]">
                    <th className="py-3 text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-muted,#666666)]">Description</th>
                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-muted,#666666)] text-center">Size</th>
                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-muted,#666666)] text-center">Qty</th>
                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-muted,#666666)] text-right">Price</th>
                    <th className="py-3 px-4 text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-muted,#666666)] text-right">Discount</th>
                    <th className="py-3 text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-muted,#666666)] text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--v2-glass-border,rgba(255,255,255,0.06))]">
                  {order.items?.map((item: any, idx: number) => {
                    const netPrice = item.price - (item.discount || 0);
                    const hasDiscount = (item.discount || 0) > 0;
                    return (
                      <tr key={idx}>
                        <td className="py-4 pr-4 flex items-center gap-3">
                          {item.thumbnail && (
                            <div className="w-10 h-10 bg-[#0A0A0A] shrink-0 rounded-xl overflow-hidden border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] p-0.5 flex items-center justify-center">
                              <img
                                src={item.thumbnail}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <span className="font-bold text-xs uppercase text-[var(--v2-text-primary,#F5F5F5)]">{item.name}</span>
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-xs text-[var(--v2-text-secondary,#A0A0A0)]">{item.size || "-"}</td>
                        <td className="py-4 px-4 text-center font-bold text-xs text-[var(--v2-text-secondary,#A0A0A0)]">{item.quantity}</td>
                        <td className="py-4 px-4 text-right font-bold text-xs text-[var(--v2-text-secondary,#A0A0A0)]">{formatCurrency(item.price)}</td>
                        <td className="py-4 px-4 text-right font-bold text-xs text-[var(--v2-accent,#2EE66A)]">
                          {hasDiscount ? `-${formatCurrency(item.discount * item.quantity)}` : "-"}
                        </td>
                        <td className="py-4 text-right font-black text-xs text-[var(--v2-text-primary,#F5F5F5)]">
                          {formatCurrency(netPrice * item.quantity)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* BOTTOM SUMMARY */}
          <div className="flex flex-col lg:flex-row gap-8 pt-6 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
            {/* PAYMENT CONTEXT */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="v2-glass p-5 rounded-2xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-accent,#2EE66A)] block mb-1">Payment Method</span>
                  <span className="text-xs font-black uppercase tracking-wider text-[var(--v2-text-primary,#F5F5F5)]">{order.paymentMethod || "CASH"}</span>
                </div>
                <div className="v2-glass p-5 rounded-2xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-accent,#2EE66A)] block mb-1">Payment Status</span>
                  <span className="text-xs font-black uppercase tracking-wider text-[var(--v2-text-primary,#F5F5F5)]">{order.paymentStatus || "PAID"}</span>
                </div>
              </div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--v2-text-muted,#666666)] m-0">
                Thank you for choosing Neverbe. This is an official digital electronic receipt.
              </p>
            </div>

            {/* FINANCIAL SUMMARY CARD */}
            <div className="w-full lg:w-[380px] v2-glass p-8 rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] space-y-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-accent,#2EE66A)] block mb-2">Financial Summary</span>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[var(--v2-text-secondary,#A0A0A0)]">
                  <span>Subtotal</span>
                  <span className="text-[var(--v2-text-primary,#F5F5F5)] font-black">{formatCurrency(rawSubtotal)}</span>
                </div>

                {itemDiscountTotal > 0 && (
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[var(--v2-accent,#2EE66A)]">
                    <span>Discounts</span>
                    <span className="font-black">- {formatCurrency(itemDiscountTotal)}</span>
                  </div>
                )}

                {order.shippingFee > 0 && (
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[var(--v2-text-secondary,#A0A0A0)]">
                    <span>Shipping</span>
                    <span className="text-[var(--v2-text-primary,#F5F5F5)] font-black">{formatCurrency(order.shippingFee)}</span>
                  </div>
                )}

                <div className="pt-4 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.1))]">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-accent,#2EE66A)]">Grand Total</span>
                    <p className="text-3xl md:text-4xl font-display font-black tracking-tight text-[var(--v2-accent,#2EE66A)] leading-none m-0">
                      {formatCurrency(total)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))] p-8 text-center bg-[var(--v2-bg-surface,#141414)]">
        <a 
          href="https://neverbe.lk" 
          className="text-xs font-black uppercase tracking-widest text-[var(--v2-text-muted,#666666)] hover:text-[var(--v2-accent,#2EE66A)] transition-colors"
        >
          neverbe.lk
        </a>
      </footer>
    </div>
  );
}
