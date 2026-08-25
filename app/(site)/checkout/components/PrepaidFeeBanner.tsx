"use client";

import React from "react";
import { Order } from "@/interfaces";
import { FiAlertTriangle, FiCreditCard } from "react-icons/fi";

interface PrepaidFeeBannerProps {
  order: Order;
  onPayNow: () => void;
}

export default function PrepaidFeeBanner({ order, onPayNow }: PrepaidFeeBannerProps) {
  if (!order || order.deliveryFeePrepaid) return null;

  return (
    <div className="w-full bg-amber-500/10 border-b border-amber-500/30 py-3 px-4 md:px-8 text-amber-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <FiAlertTriangle className="text-amber-400 shrink-0 animate-bounce" size={20} />
          <p className="text-xs font-semibold m-0">
            <strong className="text-amber-400 font-bold">Action Required for Order #{order.orderId}:</strong>{" "}
            Rs. 450 Delivery Fee Prepayment is pending before dispatch.
          </p>
        </div>

        <button
          type="button"
          onClick={onPayNow}
          className="shrink-0 py-2 px-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-[11px] rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
        >
          <FiCreditCard size={14} />
          <span>Pay LKR 450 Now</span>
        </button>
      </div>
    </div>
  );
}
