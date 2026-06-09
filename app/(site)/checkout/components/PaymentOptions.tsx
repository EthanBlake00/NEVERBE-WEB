"use client";
import React from "react";
import { PaymentMethod } from "@/interfaces";
import { IoCheckmark } from "react-icons/io5";

interface PaymentOptionsProps {
  paymentOptions: PaymentMethod[];
  paymentType: string;
  setPaymentType: React.Dispatch<React.SetStateAction<string>>;
  setPaymentTypeId: React.Dispatch<React.SetStateAction<string>>;
  setPaymentFee: React.Dispatch<React.SetStateAction<number>>;
  setMerchantFee?: React.Dispatch<React.SetStateAction<number>>;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
  paymentOptions,
  paymentType,
  setPaymentType,
  setPaymentTypeId,
  setPaymentFee,
  setMerchantFee,
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

        return (
          <div
            key={option.paymentId}
            onClick={() => handleSelect(option)}
            className={`
              relative group cursor-pointer border p-3 md:p-4 transition-all duration-300 rounded-xl overflow-hidden text-primary-dark
              ${
                isSelected
                  ? "bg-bg-secondary border-accent shadow-sm scale-[1.01] ring-1 ring-accent"
                  : "bg-surface border-default hover:border-strong hover:shadow-sm"
              }
            `}
          >
            <div className="flex items-start gap-4">
              {/* NEVERBE Style Radio Button */}
              <div
                className={`
                  flex items-center justify-center h-5 w-5 shrink-0 border-2 rounded-full transition-all
                  ${
                    isSelected
                      ? "border-accent bg-accent text-white"
                      : "border-default group-hover:border-accent bg-transparent"
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
                      <div className="relative w-8 h-8 rounded-md overflow-hidden bg-white border border-gray-100 flex items-center justify-center p-0.5 shrink-0 shadow-sm">
                        <img
                          src={option.imageUrl}
                          alt={option.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <p
                      className={`text-sm font-display font-black uppercase tracking-wider ${
                        isSelected ? "text-primary-dark" : "text-primary-dark"
                      }`}
                    >
                      {option.name}
                    </p>
                  </div>

                  {/* Fee Indicator Tag */}
                  {hasFee ? (
                    <span
                      className={`
                        text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest
                        ${
                          isSelected
                            ? "bg-accent text-white"
                            : "bg-surface-2 text-primary-dark"
                        }
                      `}
                    >
                      +Rs.{option.customerFee}
                    </span>
                  ) : (
                    <span
                      className={`
                        text-[10px] font-black uppercase tracking-widest
                        ${isSelected ? "text-accent" : "text-muted"}
                       `}
                    >
                      No Fee
                    </span>
                  )}
                </div>

                {option.description && (
                  <p
                    className={`
                      text-[10px] font-medium uppercase tracking-wide mt-1.5
                      ${isSelected ? "text-accent" : "text-muted"}
                    `}
                  >
                    {option.description}
                  </p>
                )}
              </div>
            </div>

            {/* Corner Accent for Selected State */}
            {isSelected && (
              <div className="absolute top-0 right-0 w-4 h-4 bg-accent rounded-bl-xl" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PaymentOptions;
