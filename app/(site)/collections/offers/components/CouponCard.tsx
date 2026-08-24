"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import CountdownTimer from "@/components/CountdownTimer";
import { Coupon } from "@/interfaces/Coupon";
import { IoTicketOutline, IoCheckmarkDoneOutline, IoCopyOutline, IoTimeOutline } from "react-icons/io5";

interface Props {
  coupon: Coupon;
}

const getSafeISOString = (val: any): string => {
  if (!val) return new Date().toISOString();
  try {
    if (typeof val === "string") {
      const parsed = new Date(val);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString();
      }
    }
    if (typeof val.toDate === "function") {
      return val.toDate().toISOString();
    }
    if (val instanceof Date && !isNaN(val.getTime())) {
      return val.toISOString();
    }
    if (typeof val === "object") {
      const sec = val.seconds !== undefined ? val.seconds : val._seconds;
      if (sec !== undefined && typeof sec === "number") {
        return new Date(sec * 1000).toISOString();
      }
    }
    const fallback = new Date(val);
    if (!isNaN(fallback.getTime())) {
      return fallback.toISOString();
    }
  } catch (e) {
    console.error("Error parsing date in CouponCard:", e);
  }
  return new Date().toISOString();
};

/**
 * CouponCard - NEVERBE 2026 Ticket Coupon Design
 * Glassmorphic ticket card with glowing neon accents and copy interaction.
 */
const CouponCard: React.FC<Props> = ({ coupon }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative flex flex-col sm:flex-row bg-[var(--v2-bg-surface,#141414)] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] hover:border-[var(--v2-accent,#2EE66A)] transition-all duration-300 group rounded-3xl overflow-hidden shadow-xl"
    >
      {/* Left / Top Badge: Discount Value */}
      <div className="bg-gradient-to-br from-[var(--v2-accent,#2EE66A)] to-[var(--v2-accent-dim,#1B8A3F)] text-[var(--v2-accent-text,#0A0A0A)] p-5 flex flex-col items-center justify-center min-w-[130px] shrink-0 font-display">
        <IoTicketOutline size={24} className="mb-1 text-[var(--v2-accent-text,#0A0A0A)] opacity-90" />
        <span className="text-3xl font-black tracking-tighter leading-none text-[var(--v2-accent-text,#0A0A0A)]">
          {coupon.discountType === "PERCENTAGE"
            ? `${coupon.discountValue}%`
            : coupon.discountType === "FIXED"
            ? `LKR ${coupon.discountValue}`
            : "FREE"}
        </span>
        <span className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-90 text-[var(--v2-accent-text,#0A0A0A)]">
          {coupon.discountType === "FREE_SHIPPING" ? "Shipping" : "OFF"}
        </span>
      </div>

      {/* Dashed Ticket Divider */}
      <div className="hidden sm:block w-px border-r-2 border-dashed border-[var(--v2-glass-border,rgba(255,255,255,0.15))] relative">
        <div className="absolute -top-3 -left-2.5 w-5 h-5 rounded-full bg-[var(--v2-bg-surface,#141414)] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))]" />
        <div className="absolute -bottom-3 -left-2.5 w-5 h-5 rounded-full bg-[var(--v2-bg-surface,#141414)] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))]" />
      </div>

      {/* Content Body */}
      <div className="flex-1 p-5 flex flex-col justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] border border-[var(--v2-accent,#2EE66A)] text-[var(--v2-accent,#2EE66A)] text-[10px] font-black tracking-widest uppercase">
              CODE: {coupon.code.toUpperCase()}
            </span>
            {coupon.endDate && (
              <div className="text-[10px] text-amber-400 font-extrabold flex items-center gap-1 uppercase tracking-wider bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
                <IoTimeOutline size={12} className="animate-spin-slow" />
                <CountdownTimer
                  targetDate={getSafeISOString(coupon.endDate)}
                  labels={false}
                  compact={true}
                />
              </div>
            )}
          </div>

          <h3 className="text-sm font-black uppercase text-[var(--v2-text-primary,#F5F5F5)] tracking-tight line-clamp-2 m-0">
            {coupon.description || "Exclusive Member Voucher"}
          </h3>

          {(!!coupon.minOrderAmount && coupon.minOrderAmount > 0) || coupon.firstOrderOnly ? (
            <p className="text-[10px] font-bold text-[var(--v2-text-muted,#666666)] uppercase tracking-wider mt-2.5 m-0">
              {!!coupon.minOrderAmount &&
                coupon.minOrderAmount > 0 &&
                `Min. Order LKR ${coupon.minOrderAmount.toLocaleString()}`}
              {coupon.firstOrderOnly && " • First Order Only"}
            </p>
          ) : null}
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`w-full py-2.5 px-4 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            copied
              ? "bg-[var(--v2-accent,#2EE66A)] text-[var(--v2-accent-text,#0A0A0A)] shadow-md scale-98"
              : "bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] text-[var(--v2-text-primary,#F5F5F5)] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] hover:border-[var(--v2-accent,#2EE66A)] hover:text-[var(--v2-accent,#2EE66A)]"
          }`}
        >
          {copied ? (
            <>
              <IoCheckmarkDoneOutline size={16} className="text-[var(--v2-accent-text,#0A0A0A)]" />
              <span className="text-[var(--v2-accent-text,#0A0A0A)] font-black">COPIED CODE!</span>
            </>
          ) : (
            <>
              <IoCopyOutline size={14} />
              <span>COPY CODE</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default CouponCard;
