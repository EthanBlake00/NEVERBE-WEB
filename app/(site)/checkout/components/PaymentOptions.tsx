"use client";
import React from "react";
import { PaymentMethod } from "@/interfaces";
import { IoCheckmark } from "react-icons/io5";
import { BagItem } from "@/interfaces/BagItem";

interface PaymentOptionsProps {
  paymentOptions: PaymentMethod[];
  paymentType: string;
  setPaymentType: React.Dispatch<React.SetStateAction<string>>;
  setPaymentTypeId: React.Dispatch<React.SetStateAction<string>>;
  setPaymentFee: React.Dispatch<React.SetStateAction<number>>;
  setMerchantFee?: React.Dispatch<React.SetStateAction<number>>;
  bagItems: BagItem[];
  isHighRisk?: boolean;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  paymentOptions,
  paymentType,
  setPaymentType,
  setPaymentTypeId,
  setPaymentFee,
  setMerchantFee,
  isHighRisk,
}) => {
  const handleSelect = (option: PaymentMethod) => {
    setPaymentType(option.name);
    setPaymentTypeId(option.paymentId);
    setPaymentFee(option.customerFee || 0);
    if (setMerchantFee) setMerchantFee(option.fee || 0);
  };

  return (
    <div className="flex flex-col gap-3">
      {paymentOptions.map((option) => {
        const isSelected = option.name === paymentType;
        const hasFee = (option.customerFee || 0) > 0;
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
            <div className="flex items-center gap-4">
              {/* Radio */}
              <div
                className={`
                  flex items-center justify-center h-5 w-5 shrink-0 border-2 rounded-full transition-all
                  ${
                    isSelected
                      ? "border-[var(--v2-accent,#2EE66A)] bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A]"
                      : "border-[var(--v2-glass-border,rgba(255,255,255,0.2))] group-hover:border-[var(--v2-accent,#2EE66A)]"
                  }
                `}
              >
                {isSelected && (
                  <IoCheckmark size={12} className="stroke-[3px]" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-3">
                    {option.imageUrl && (
                      <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-[#0A0A0A] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] flex items-center justify-center p-0.5 shrink-0">
                        <img
                          src={option.imageUrl}
                          alt={option.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-[var(--v2-text-primary,#F5F5F5)] m-0">
                        {isCod && isHighRisk ? "COD (Prepaid Delivery Fee Required)" : option.name}
                      </p>
                      {isCod && isHighRisk && (
                        <span className="inline-block text-[9px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md mt-1">
                          LKR 450 Delivery Fee Online Prepayment Required
                        </span>
                      )}
                    </div>
                  </div>

                  {hasFee && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-accent,#2EE66A)]">
                      + LKR {(option.customerFee || 0).toLocaleString()}
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
