"use client";
import React from "react";
import { PaymentMethod } from "@/interfaces";
import { IoCheckmark } from "react-icons/io5";
import { BagItem } from "@/interfaces/BagItem";
import { calculateTotal, calculateTotalDiscount } from "@/utils/bagCalculations";

interface PaymentOptionsProps {
  paymentOptions: PaymentMethod[];
  paymentType: string;
  setPaymentType: React.Dispatch<React.SetStateAction<string>>;
  setPaymentTypeId: React.Dispatch<React.SetStateAction<string>>;
  setPaymentFee: React.Dispatch<React.SetStateAction<number>>;
  setMerchantFee?: React.Dispatch<React.SetStateAction<number>>;
  bagItems: BagItem[];
  taxableBase?: number;
  isHighRisk?: boolean;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  paymentOptions,
  paymentType,
  setPaymentType,
  setPaymentTypeId,
  setPaymentFee,
  setMerchantFee,
  bagItems,
  taxableBase,
  isHighRisk,
}) => {
  const handleSelect = (option: PaymentMethod) => {
    setPaymentType(option.name);
    setPaymentTypeId(option.paymentId);
    setPaymentFee(option.customerFee || 0);
    if (setMerchantFee) setMerchantFee(option.fee || 0);
  };

  const rawSubTotal = calculateTotal(bagItems);
  const itemDiscount = calculateTotalDiscount(bagItems);
  const base = taxableBase !== undefined ? taxableBase : Math.max(0, rawSubTotal - itemDiscount);

  return (
    <div className="flex flex-col gap-3">
      {paymentOptions.map((option) => {
        const isSelected = option.name === paymentType;
        const hasFee = (option.customerFee || 0) > 0;
        const optionFeePercent = option.customerFee || 0;
        const optionFeeAmount = parseFloat((base * (optionFeePercent / 100)).toFixed(2));
        const isCod = option.name?.toLowerCase().includes("cod") || option.name?.toLowerCase().includes("cash on delivery");

        return (
          <div
            key={option.paymentId}
            onClick={() => handleSelect(option)}
            className={`
              relative group cursor-pointer p-4 transition-all duration-300 rounded-2xl overflow-hidden v2-glass border
              ${
                isSelected
                  ? "border-[var(--v2-accent,#2EE66A)] bg-[var(--v2-accent,#2EE66A)]/10 ring-1 ring-[var(--v2-accent,#2EE66A)]/30"
                  : "border-[var(--v2-glass-border,rgba(255,255,255,0.08))] hover:border-[var(--v2-accent,#2EE66A)]/50"
              }
            `}
          >
            <div className="flex items-start gap-3.5">
              {/* Radio Checkbox */}
              <div
                className={`
                  flex items-center justify-center h-5 w-5 shrink-0 border-2 rounded-full transition-all mt-0.5
                  ${
                    isSelected
                      ? "border-[var(--v2-accent,#2EE66A)] bg-[var(--v2-accent,#2EE66A)] text-[var(--v2-accent-text,#0A0A0A)]"
                      : "border-[var(--v2-glass-border,rgba(255,255,255,0.2))] group-hover:border-[var(--v2-accent,#2EE66A)]"
                  }
                `}
              >
                {isSelected && (
                  <IoCheckmark size={12} className="stroke-[3px] text-[var(--v2-accent-text,#0A0A0A)]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 w-full">
                  <div className="flex items-start gap-3 min-w-0">
                    {option.imageUrl && (
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-[var(--v2-bg-elevated,#1E1E1E)] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] flex items-center justify-center p-1 shrink-0">
                        <img
                          src={option.imageUrl}
                          alt={option.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-black uppercase tracking-wider text-[var(--v2-text-primary,#F5F5F5)] m-0 leading-snug">
                        {isCod && isHighRisk ? "COD (Prepaid Delivery Fee Required)" : option.name}
                      </p>

                      {/* Payment Description */}
                      {option.description && (
                        <p className="text-[11px] font-medium text-[var(--v2-text-secondary,#A0A0A0)] mt-1 m-0 leading-relaxed">
                          {option.description}
                        </p>
                      )}

                      {isCod && isHighRisk && (
                        <span className="inline-block text-[9px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md mt-1.5">
                          LKR 450 Delivery Fee Online Prepayment Required
                        </span>
                      )}
                    </div>
                  </div>

                  {hasFee && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-accent,#2EE66A)] shrink-0">
                      + LKR {optionFeeAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PaymentOptions;
