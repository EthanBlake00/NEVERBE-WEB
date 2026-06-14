import React from "react";
import axiosInstance from "@/actions/axiosInstance";
import { formatCurrency } from "@/utils/formatting";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import EBillDownloadButton from "../components/EBillDownloadButton";
import { BusinessInfo } from "@/config/BusinessInfo";
import { Metadata } from "next";

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
      index: false, // Don't index individual customer receipts in search engines for privacy
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
      <div className="min-h-screen bg-white flex flex-col font-sans text-primary-dark">
        {/* HEADER */}
        <div className="w-full border-b border-default bg-surface-1 p-6 md:p-12">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter leading-none">
              Electronic Receipt
            </h1>
          </div>
        </div>

        {/* EXPIRED CONTENT */}
        <div className="flex-1 w-full p-6 md:p-12 bg-white flex items-center justify-center">
          <div className="max-w-lg mx-auto text-center space-y-8">
            {/* Expired Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-surface-1 border border-default mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight">
                eBill Expired
              </h2>
              <p className="text-sm font-bold uppercase tracking-widest text-muted leading-relaxed max-w-sm mx-auto">
                This electronic receipt has expired. POS receipts are available for 30 days from the date of purchase.
              </p>
            </div>

            <div className="pt-4 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted">
                Ref: #{orderId.toUpperCase()}
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">
                If you need assistance, please contact us at {BusinessInfo.phone}
              </p>
            </div>

            <a
              href="https://neverbe.lk"
              className="inline-block px-8 py-4 bg-primary-dark text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-accent transition-colors"
            >
              Visit Neverbe
            </a>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="w-full border-t border-default p-12 text-center bg-white">
          <a
            href="https://neverbe.lk"
            className="text-lg font-display font-black uppercase tracking-widest hover:text-accent transition-colors"
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

  const orderDate = order.createdAt?._seconds
    ? new Date(order.createdAt._seconds * 1000)
    : new Date(order.createdAt);

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

  // Use the backend-calculated total directly (most reliable)
  const total = order.total || (rawSubtotal - itemDiscountTotal + (order.shippingFee || 0) + (order.fee || 0));

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-primary-dark">
      {/* HEADER SECTION */}
      <div className="w-full border-b border-default bg-surface-1 p-6 md:p-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter leading-none">
              Electronic Receipt
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted">
              <span>Ref: #{order.orderId?.toUpperCase()}</span>
              <span className="hidden sm:inline">|</span>
              <span>Issued: {format(orderDate, "MMM dd, yyyy h:mm a")}</span>
              <span className="hidden sm:inline">|</span>
              <span>
                Validity: {daysRemaining !== undefined ? (
                  `Expires in ${daysRemaining} days`
                ) : (
                  "Lifetime"
                )}
              </span>
            </div>
          </div>
          <EBillDownloadButton order={order} />
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="flex-1 w-full p-6 md:p-12 bg-white">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* TOP INFO: FROM / TO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 border-b border-default pb-12">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">From</p>
              <div className="text-sm font-medium leading-relaxed">
                <p className="text-xl font-black uppercase tracking-tight mb-1">{BusinessInfo.name}</p>
                <p className="text-muted">{BusinessInfo.addressLine1}</p>
                <p className="text-muted">{BusinessInfo.city}, Sri Lanka</p>
                <p className="text-accent font-bold mt-2">{BusinessInfo.phone}</p>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Billed To</p>
              {order.customer ? (
                <div className="text-sm font-medium leading-relaxed">
                  <p className="text-xl font-black uppercase tracking-tight mb-1">
                    {order.customer.name || "Valued Customer"}
                  </p>
                  {order.customer.address && <p className="text-muted">{order.customer.address}</p>}
                  {order.customer.city && <p className="text-muted">{order.customer.city}</p>}
                  <p className="text-accent font-bold mt-2">{order.customer.phone}</p>
                </div>
              ) : (
                <p className="text-xl font-black uppercase tracking-tight text-muted">Walk-in Customer</p>
              )}
            </div>
          </div>

          {/* ITEM LIST SECTION */}
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-8">Statement of Items</h3>
            
            {/* Mobile View: Simplified List */}
            <div className="block sm:hidden space-y-6">
              {order.items?.map((item: any, idx: number) => {
                const netPrice = item.price - (item.discount || 0);
                const hasDiscount = (item.discount || 0) > 0;
                return (
                  <div key={idx} className="flex justify-between items-start border-b border-default pb-4">
                    <div className="space-y-1">
                      <p className="font-display font-black uppercase tracking-tight text-lg leading-none">{item.name}</p>
                      <p className="text-[10px] font-bold uppercase text-muted tracking-widest">
                        {item.size || "Free Size"} &times; {item.quantity}
                      </p>
                      {hasDiscount && (
                        <p className="text-[9px] font-bold text-accent">
                          {formatCurrency(item.price)} → {formatCurrency(netPrice)} (-{formatCurrency(item.discount)})
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-display font-black text-lg">{formatCurrency(netPrice * item.quantity)}</p>
                      {hasDiscount && (
                        <p className="text-[9px] text-muted font-bold uppercase line-through opacity-40">{formatCurrency(item.price * item.quantity)}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop View: Full Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-primary-dark">
                    <th className="py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted">Description</th>
                    <th className="py-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-center">Size</th>
                    <th className="py-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-center">Qty</th>
                    <th className="py-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-right">Price</th>
                    <th className="py-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-right">Discount</th>
                    <th className="py-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default">
                  {order.items?.map((item: any, idx: number) => {
                    const netPrice = item.price - (item.discount || 0);
                    const hasDiscount = (item.discount || 0) > 0;
                    return (
                      <tr key={idx} className="group transition-colors">
                        <td className="py-6 pr-4">
                          <p className="font-display font-black uppercase tracking-tight text-lg leading-tight">{item.name}</p>
                          {item.variantName && (
                            <p className="text-[10px] font-bold uppercase text-muted tracking-widest mt-1">
                              {item.variantName}
                            </p>
                          )}
                        </td>
                        <td className="py-6 px-4 text-center font-bold text-sm">{item.size || "-"}</td>
                        <td className="py-6 px-4 text-center font-bold text-sm">{item.quantity}</td>
                        <td className="py-6 px-4 text-right">
                          <p className="font-bold text-sm">{formatCurrency(item.price)}</p>
                        </td>
                        <td className="py-6 px-4 text-right">
                          {hasDiscount ? (
                            <p className="font-bold text-sm text-accent">-{formatCurrency(item.discount * item.quantity)}</p>
                          ) : (
                            <p className="font-bold text-sm text-muted">-</p>
                          )}
                        </td>
                        <td className="py-6 text-right font-display font-black text-lg">
                          {formatCurrency(netPrice * item.quantity)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* BOTTOM GRID: PAYMENT & SUMMARY */}
          <div className="flex flex-col lg:flex-row gap-16 pt-8 border-t border-default">
            
            {/* PAYMENT CONTEXT */}
            <div className="flex-1 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">Payment Method</p>
                  <p className="text-sm font-black uppercase tracking-widest leading-none">{order.paymentMethod || "CASH"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">Payment Status</p>
                  <p className="text-sm font-black uppercase tracking-widest leading-none">{order.paymentStatus || "PAID"}</p>
                </div>
              </div>
              <div className="pt-8 text-[10px] font-bold uppercase tracking-[0.3em] text-muted leading-relaxed max-w-xs">
                <p>Thank you for shopping with Neverbe. This is a system generated receipt.</p>
              </div>
            </div>

            {/* FINANCIAL SUMMARY CARD */}
            <div className="w-full lg:w-[400px] bg-surface-1 p-8 md:p-10 rounded-[2.5rem] border border-default space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted text-center lg:text-left">Financial Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                  <span className="text-muted">Subtotal</span>
                  <span className="text-primary-dark font-black">{formatCurrency(rawSubtotal)}</span>
                </div>

                {itemDiscountTotal > 0 && (
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-accent">
                    <span>Item Discounts</span>
                    <span className="font-black">- {formatCurrency(itemDiscountTotal)}</span>
                  </div>
                )}

                {order.shippingFee > 0 && (
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                    <span className="text-muted">Shipping</span>
                    <span className="text-primary-dark font-black">{formatCurrency(order.shippingFee)}</span>
                  </div>
                )}

                <div className="pt-6 border-t border-primary-dark/20">
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent text-center lg:text-left">Grand Total Due</span>
                    <p className="text-[44px] md:text-5xl font-display font-black tracking-tighter text-center lg:text-left leading-none">
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
      <footer className="w-full border-t border-default p-12 text-center bg-white">
        <a 
          href="https://neverbe.lk" 
          className="text-lg font-display font-black uppercase tracking-widest hover:text-accent transition-colors"
        >
          neverbe.lk
        </a>
      </footer>
    </div>
  );
}
