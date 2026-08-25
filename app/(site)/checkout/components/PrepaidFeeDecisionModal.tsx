"use client";

import React from "react";
import { Modal } from "antd";
import { Order } from "@/interfaces";
import { FiShield, FiAlertTriangle, FiCreditCard, FiX, FiCheckCircle } from "react-icons/fi";

interface PrepaidFeeDecisionModalProps {
  isOpen: boolean;
  order: Order | null;
  onPayNow: () => void;
  onDismiss: () => void;
}

export default function PrepaidFeeDecisionModal({
  isOpen,
  order,
  onPayNow,
  onDismiss,
}: PrepaidFeeDecisionModalProps) {
  if (!order) return null;

  return (
    <Modal
      open={isOpen}
      footer={null}
      closable={false}
      centered
      className="prepaid-fee-modal"
      width={460}
      styles={{
        content: {
          backgroundColor: "#141414",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "24px",
          padding: "24px",
          color: "#F5F5F5",
        },
      }}
    >
      <div className="flex flex-col items-center text-center">
        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
          <FiShield size={28} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">
          Delivery Prepayment Required
        </h3>

        {/* Order ID Badge */}
        <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-amber-400 font-bold mb-4">
          Order #{order.orderId}
        </span>

        {/* Message */}
        <p className="text-xs text-gray-300 font-medium leading-relaxed mb-6">
          Due to delivery risk indicators on past network activity, a{" "}
          <strong className="text-amber-400 font-bold">Rs. 450 Delivery Fee Prepayment</strong>{" "}
          is required online before your Cash-on-Delivery parcel can be dispatched.
        </p>

        {/* Benefit Box */}
        <div className="w-full bg-white/[0.03] border border-white/5 rounded-xl p-3 mb-6 text-left space-y-2">
          <div className="flex items-center gap-2 text-[11px] text-gray-300">
            <FiCheckCircle className="text-emerald-400 shrink-0" size={14} />
            <span>Pay LKR 450 delivery fee online immediately</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-300">
            <FiCheckCircle className="text-emerald-400 shrink-0" size={14} />
            <span>Pay remaining balance (LKR {(order.total - 450).toLocaleString()}) in cash upon delivery</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 w-full">
          <button
            type="button"
            onClick={onPayNow}
            className="w-full py-3.5 px-4 bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] font-black uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg cursor-pointer"
          >
            <FiCreditCard size={16} />
            <span>Pay LKR 450 Delivery Fee Now</span>
          </button>

          <button
            type="button"
            onClick={onDismiss}
            className="w-full py-3 px-4 bg-white/5 border border-white/10 text-gray-400 hover:text-white font-bold uppercase tracking-wider text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <FiX size={14} />
            <span>Pay Later (Keep Pending Banner)</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
