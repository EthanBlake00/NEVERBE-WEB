"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoInformationCircle,
  IoLockClosed,
} from "react-icons/io5";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useCoupon from "@/hooks/useCoupon";
import confetti from "canvas-confetti";

interface CouponInputProps {
  className?: string;
  onDiscountChange?: (discount: number) => void;
}

const CouponInput: React.FC<CouponInputProps> = ({
  className = "",
  onDiscountChange,
}) => {
  const {
    couponState,
    setCode,
    validateCoupon,
    removeCouponFromCart,
    isBlocked,
    hasComboItems,
  } = useCoupon({ autoValidate: false, debounceMs: 600 });

  useEffect(() => {
    if (couponState.isApplied) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2EE66A", "#141414", "#ffffff"],
      });
    }
  }, [couponState.isApplied]);

  useEffect(() => {
    if (onDiscountChange) {
      onDiscountChange(couponState.discount);
    }
  }, [couponState.discount, onDiscountChange]);

  const getMessageIcon = () => {
    switch (couponState.messageType) {
      case "success":
        return <IoCheckmarkCircle className="text-[var(--v2-accent,#2EE66A)]" size={16} />;
      case "error":
        return <IoCloseCircle className="text-rose-500" size={16} />;
      case "info":
        return couponState.isValidating ? (
          <AiOutlineLoading3Quarters
            className="text-[var(--v2-accent,#2EE66A)] animate-spin"
            size={14}
          />
        ) : (
          <IoInformationCircle className="text-sky-400" size={16} />
        );
      case "restricted":
        return <IoLockClosed className="text-amber-400" size={16} />;
      default:
        return null;
    }
  };

  const getMessageColor = () => {
    switch (couponState.messageType) {
      case "success":
        return "text-[var(--v2-accent,#2EE66A)]";
      case "error":
        return "text-rose-400";
      case "info":
        return "text-[var(--v2-text-secondary,#A0A0A0)]";
      case "restricted":
        return "text-amber-400";
      default:
        return "text-[var(--v2-text-secondary,#A0A0A0)]";
    }
  };

  return (
    <div className={`${className}`}>
      {isBlocked && hasComboItems && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-2"
        >
          <IoLockClosed className="text-amber-400 shrink-0" size={16} />
          <p className="text-xs font-bold text-amber-300 m-0">
            Promotions locked. Remove bundle deals to apply custom coupon.
          </p>
        </motion.div>
      )}

      {/* Input Row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={couponState.code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={isBlocked ? "Promotions locked" : "PROMO CODE"}
            disabled={couponState.isApplied || isBlocked}
            className={`w-full h-12 px-4 bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border rounded-full text-xs font-extrabold tracking-widest uppercase text-[var(--v2-text-primary,#F5F5F5)] placeholder:text-[var(--v2-text-muted,#666666)] outline-none transition-all ${
              isBlocked
                ? "opacity-50 cursor-not-allowed border-[var(--v2-glass-border,rgba(255,255,255,0.08))]"
                : couponState.isApplied
                ? "border-[var(--v2-accent,#2EE66A)] bg-[var(--v2-accent,#2EE66A)]/10 text-[var(--v2-accent,#2EE66A)]"
                : couponState.messageType === "error"
                ? "border-rose-500/50"
                : "border-[var(--v2-glass-border,rgba(255,255,255,0.1))] focus:border-[var(--v2-accent,#2EE66A)]"
            }`}
          />

          {couponState.code && !isBlocked && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {getMessageIcon()}
            </div>
          )}
        </div>

        {/* Action Button */}
        {couponState.isApplied ? (
          <button
            type="button"
            onClick={removeCouponFromCart}
            className="px-6 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-wider rounded-full hover:bg-rose-500/20 transition-all cursor-pointer"
          >
            Remove
          </button>
        ) : (
          <button
            type="button"
            onClick={validateCoupon}
            disabled={
              !couponState.code || couponState.isValidating || isBlocked
            }
            className="px-6 h-12 bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] text-xs font-black uppercase tracking-wider rounded-full hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer border-none shadow-md"
          >
            {couponState.isValidating ? "..." : "Apply"}
          </button>
        )}
      </div>

      {/* Feedback Message */}
      <AnimatePresence mode="wait">
        {couponState.message && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-2 mt-2 text-xs font-bold ${getMessageColor()}`}
          >
            {getMessageIcon()}
            <span>{couponState.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CouponInput;
