"use client";

import React, { useState } from "react";
import { BusinessInfo } from "@/config/BusinessInfo";
import { formatCurrency } from "@/utils/formatting";
import { formatSLDate } from "@/actions/utilAction";
import EBillDownloadButton from "./EBillDownloadButton";
import { Switch } from "antd";

interface EBillViewProps {
  order: any;
  daysRemaining?: number;
}

const EBillView: React.FC<EBillViewProps> = ({ order, daysRemaining }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const totalDiscount = order.discount || 0;

  // Use the backend-calculated total directly, or fallback to manual calculation
  const total = order.total || (rawSubtotal - totalDiscount + (order.shippingFee || 0) + (order.fee || 0));

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? "bg-[#141414] text-[#F5F5F5]" : "bg-slate-100 text-slate-900"}`}>
      {/* HEADER CONTROLS SECTION */}
      <div className={`w-full p-4 border-b ${isDarkMode ? "border-[rgba(255,255,255,0.08)] bg-[#141414]" : "border-slate-200 bg-white"}`}>
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold uppercase tracking-widest">Theme</span>
            <Switch
              checked={isDarkMode}
              onChange={setIsDarkMode}
              checkedChildren="Dark"
              unCheckedChildren="Light"
            />
          </div>
          <EBillDownloadButton order={order} />
        </div>
      </div>

      {/* INVOICE PAPER AREA */}
      <div className="flex-1 w-full p-6 md:p-12 flex justify-center">
        <div className={`w-full max-w-4xl p-8 md:p-12 shadow-2xl rounded-sm ${isDarkMode ? "bg-[#1C1C1C] border border-[rgba(255,255,255,0.08)]" : "bg-white"}`}>
          
          {/* Header Branding */}
          <div className={`flex justify-between items-start border-b-2 pb-8 mb-8 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
            <div className="flex flex-col gap-3">
              <img src="/logo.png" alt="NeverBe" className="h-10 w-auto object-contain self-start" />
              <div>
                <h1 className="text-3xl font-black tracking-tight leading-none mb-1 font-mono">
                  INVOICE
                </h1>
                <span className={`text-[11px] font-bold uppercase tracking-wider font-mono ${isDarkMode ? "text-slate-400" : "text-slate-400"}`}>
                  Official Receipt
                </span>
              </div>
            </div>

            <div className="text-right font-mono">
              <h2 className="text-lg font-bold mb-1">NeverBe.</h2>
              <p className={`text-xs leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                {BusinessInfo.addressLine1}
                <br />
                {BusinessInfo.city}, Sri Lanka
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>{BusinessInfo.phone}</p>
            </div>
          </div>

          {/* Customer & Order Metadata Grid */}
          <div className={`grid grid-cols-2 gap-8 mb-10 border-b pb-8 font-mono ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
            <div className="space-y-4">
              {order.customer && (
                <div>
                  <span className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                    Invoice To
                  </span>
                  <p className="text-xs font-bold">{order.customer.name || "Walk-in Customer"}</p>
                  <p className={`text-xs leading-relaxed font-sans ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    {order.customer.address}
                    {order.customer.city && `, ${order.customer.city}`}
                    {order.customer.zip && ` ${order.customer.zip}`}
                  </p>
                  {order.customer.phone && <p className={`text-[11px] font-mono mt-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Tel: {order.customer.phone}</p>}
                </div>
              )}

              {order.customer?.shippingAddress && (
                <div>
                  <span className={`block text-[10px] font-bold uppercase tracking-wider mb-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                    Ship To
                  </span>
                  <p className="text-xs font-bold">{order.customer.shippingName || order.customer.name}</p>
                  <p className={`text-xs leading-relaxed font-sans ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                    {order.customer.shippingAddress}
                    {order.customer.shippingCity && `, ${order.customer.shippingCity}`}
                    {order.customer.shippingZip && ` ${order.customer.shippingZip}`}
                  </p>
                </div>
              )}
            </div>

            <div className="text-right space-y-3 font-mono">
              <div>
                <span className={`block text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Order No.</span>
                <p className="text-sm font-bold">#{order.orderId}</p>
              </div>
              <div>
                <span className={`block text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Date Issued</span>
                <p className={`text-xs font-bold ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{formatSLDate(order.createdAt) || "N/A"}</p>
              </div>
              <div>
                <span className={`block text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>Payment Status</span>
                <p className="text-xs font-bold uppercase text-emerald-600">{order.paymentStatus || "PENDING"}</p>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className={`mb-10 overflow-hidden rounded-xl border ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}>
            <table className="w-full text-xs font-mono">
              <thead className={`border-b ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
                <tr>
                  <th className={`text-left font-bold uppercase py-3 px-4 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Item Description</th>
                  <th className={`text-center font-bold uppercase py-3 px-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Size</th>
                  <th className={`text-center font-bold uppercase py-3 px-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Qty</th>
                  <th className={`text-right font-bold uppercase py-3 px-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Price</th>
                  <th className={`text-right font-bold uppercase py-3 px-3 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Discount</th>
                  <th className={`text-right font-bold uppercase py-3 px-4 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>Amount</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? "divide-slate-800" : "divide-slate-100"}`}>
                {order.items?.map((item: any, idx: number) => {
                  const originalTotal = (item.price || 0) * (item.quantity || 1);
                  const discountTotal = (item.discount || 0) * (item.quantity || 1);
                  const finalTotal = originalTotal - discountTotal;
                  return (
                  <tr key={idx} className={isDarkMode ? "hover:bg-slate-800/50" : "hover:bg-slate-50/50"}>
                    <td className="py-3 px-4 flex items-center gap-3">
                      {item.thumbnail && (
                        <img src={item.thumbnail} alt={item.name} className="w-10 h-10 object-cover rounded-md" />
                      )}
                      <div>
                        <p className="font-bold">{item.name}</p>
                        {item.variantName && <p className={`text-[10px] uppercase ${isDarkMode ? "text-slate-500" : "text-slate-500"}`}>{item.variantName}</p>}
                      </div>
                    </td>
                    <td className={`py-3 px-3 text-center ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{item.size || "—"}</td>
                    <td className={`py-3 px-3 text-center ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>{item.quantity || 1}</td>
                    <td className={`py-3 px-3 text-right ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>
                      Rs {originalTotal.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right text-rose-500">
                      {discountTotal > 0 ? `-Rs ${discountTotal.toLocaleString()}` : "—"}
                    </td>
                    <td className="py-3 px-4 text-right font-bold">
                      Rs {finalTotal.toLocaleString()}
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div className="flex justify-end font-mono text-xs mb-8">
            <div className="w-full max-w-xs space-y-2">
              <div className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                <span>Subtotal</span>
                <span className={`font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Rs {rawSubtotal.toLocaleString()}</span>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between text-rose-500">
                  <span>Total Discount</span>
                  <span className="font-bold">-Rs {totalDiscount.toLocaleString()}</span>
                </div>
              )}

              {order.shippingFee !== undefined && order.shippingFee > 0 && (
                <div className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  <span>Shipping Fee</span>
                  <span className="font-bold">Rs {order.shippingFee.toLocaleString()}</span>
                </div>
              )}

              {order.fee !== undefined && order.fee > 0 && (
                <div className={`flex justify-between ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  <span>Processing Fee</span>
                  <span className="font-bold">Rs {order.fee.toLocaleString()}</span>
                </div>
              )}

              <div className={`pt-2 border-t-2 flex justify-between text-sm font-bold ${isDarkMode ? "border-slate-500 text-white" : "border-slate-900 text-slate-900"}`}>
                <span className="uppercase">Grand Total</span>
                <span className="text-emerald-600">Rs {(order.total || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className={`pt-6 border-t text-center font-mono text-[10px] ${isDarkMode ? "border-slate-800 text-slate-500" : "border-slate-100 text-slate-400"}`}>
            Thank you for choosing NeverBe! For support queries, contact info@neverbe.lk
          </div>
        </div>
      </div>
    </div>
  );
};

export default EBillView;
