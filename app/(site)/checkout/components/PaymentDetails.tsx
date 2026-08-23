"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Form, Button } from "antd";
import { RootState } from "@/redux/store";
import { IoArrowForward, IoLockClosedOutline } from "react-icons/io5";
import BagItemCard from "@/components/BagItemCard";
import CouponInput from "@/components/CouponInput";
import PromotionBanner from "@/components/PromotionBanner";
import {
  calculateFee,
  calculateSubTotal,
  calculateTotal,
  calculateTotalDiscount,
} from "@/utils/bagCalculations";
import { PaymentMethod } from "@/interfaces";
import { BagItem } from "@/interfaces/BagItem";
import PaymentOptions from "./PaymentOptions";
import Image from "next/image";
import axiosInstance from "@/actions/axiosInstance";

interface PaymentDetailsProps {
  paymentType: string;
  setPaymentType: React.Dispatch<React.SetStateAction<string>>;
  setPaymentTypeId: React.Dispatch<React.SetStateAction<string>>;
  setPaymentFee: React.Dispatch<React.SetStateAction<number>>;
  setMerchantFee?: React.Dispatch<React.SetStateAction<number>>;
  selectedPaymentFee: number;
  shippingCost: number;
  isHighRisk?: boolean;
}

interface BundleGroup {
  comboId: string;
  comboName: string;
  items: BagItem[];
  totalPrice: number;
  totalDiscount: number;
}

const BundleCard = ({ bundle }: { bundle: BundleGroup }) => {
  const netPrice = bundle.totalPrice - bundle.totalDiscount;

  return (
    <div className="v2-glass rounded-2xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] overflow-hidden">
      <div className="bg-[var(--v2-accent,#2EE66A)]/10 text-[var(--v2-accent,#2EE66A)] px-3 py-2 flex justify-between items-center border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
        <span className="text-[9px] font-black uppercase tracking-widest text-[var(--v2-accent,#2EE66A)]">
          Bundle
        </span>
        <span className="text-[10px] font-black uppercase tracking-wider text-[var(--v2-text-primary,#F5F5F5)]">
          {bundle.comboName}
        </span>
      </div>

      <div className="divide-y divide-[var(--v2-glass-border,rgba(255,255,255,0.06))]">
        {bundle.items.map((item, idx) => (
          <div key={idx} className="flex gap-2 p-2 items-center">
            <div className="relative w-10 h-10 bg-[#0A0A0A] rounded-xl shrink-0 border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] overflow-hidden p-0.5">
              <Image
                src={item.thumbnail || ""}
                alt={item.name}
                fill
                className="object-cover rounded-lg"
              />
              <span className="absolute top-0.5 left-0.5 bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] text-[7px] font-black px-1 rounded-sm">
                {idx + 1}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase truncate text-[var(--v2-text-primary,#F5F5F5)] m-0">
                {item.name}
              </p>
              <p className="text-[9px] text-[var(--v2-text-secondary,#A0A0A0)] uppercase font-bold m-0">
                Size: {item.size}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))] px-3 py-2 flex justify-between items-center bg-[var(--v2-glass-bg,rgba(255,255,255,0.02))]">
        <span className="text-[9px] text-[var(--v2-text-muted,#666666)] uppercase font-bold">
          {bundle.items.length} Items
        </span>
        <div className="text-right">
          {bundle.totalDiscount > 0 && (
            <span className="text-[9px] text-[var(--v2-text-muted,#666666)] line-through mr-2">
              LKR {bundle.totalPrice.toLocaleString()}
            </span>
          )}
          <span className="text-xs font-black text-[var(--v2-accent,#2EE66A)]">
            LKR {netPrice.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  paymentType,
  setPaymentType,
  setPaymentTypeId,
  setPaymentFee,
  setMerchantFee,
  selectedPaymentFee,
  shippingCost,
  isHighRisk,
}) => {
  const [paymentOptions, setPaymentOptions] = useState<PaymentMethod[]>([]);
  const [isPaymentLoading, setIsPaymentLoading] = useState(true);

  const bagItems = useSelector((state: RootState) => state.bag.bag);
  const couponDiscount =
    useSelector((state: RootState) => state.bag.couponDiscount) || 0;
  const promotionDiscount =
    useSelector((state: RootState) => state.bag.promotionDiscount) || 0;

  const { bundles, regularItems } = useMemo(() => {
    const bundleMap = new Map<string, BundleGroup>();
    const regular: BagItem[] = [];

    bagItems.forEach((item) => {
      if (item.isComboItem && item.comboId) {
        const existing = bundleMap.get(item.comboId);
        const itemTotal = item.price * item.quantity;

        if (existing) {
          existing.items.push(item);
          existing.totalPrice += itemTotal;
          existing.totalDiscount += item.discount;
        } else {
          bundleMap.set(item.comboId, {
            comboId: item.comboId,
            comboName: item.comboName || "Bundle Deal",
            items: [item],
            totalPrice: itemTotal,
            totalDiscount: item.discount,
          });
        }
      } else {
        regular.push(item);
      }
    });

    return { bundles: Array.from(bundleMap.values()), regularItems: regular };
  }, [bagItems]);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      setIsPaymentLoading(true);
      try {
        const response = await axiosInstance.get("/web/payments");
        if (response.data) {
          const list: PaymentMethod[] = response.data;
          setPaymentOptions(list);
          if (list.length > 0) {
            setPaymentType(list[0].name);
            setPaymentTypeId(list[0].paymentId);
            setPaymentFee(list[0].customerFee || 0);
            if (setMerchantFee) setMerchantFee(list[0].fee || 0);
          }
        }
      } catch (err) {
        console.error("Failed to fetch payment methods", err);
      } finally {
        setIsPaymentLoading(false);
      }
    };
    fetchPaymentMethods();
  }, [setPaymentType, setPaymentTypeId, setPaymentFee, setMerchantFee]);

  const rawSubTotal = calculateTotal(bagItems);
  const itemDiscount = calculateTotalDiscount(bagItems);
  const shipping = shippingCost;

  const fee = selectedPaymentFee;

  const subTotalAfterDiscount =
    calculateSubTotal(bagItems, 0, shipping) -
    couponDiscount -
    promotionDiscount;

  const finalTotal = subTotalAfterDiscount + fee;

  return (
    <div className="w-full">
      <div className="v2-glass p-6 md:p-8 rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
        {/* Header */}
        <div className="mb-6 border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))] pb-4">
          <span className="v2-section-label text-[9px] mb-0.5">ORDER SUMMARY</span>
          <h2 className="text-xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0">
            Payment &amp; Review
          </h2>
        </div>

        {/* Promotion Banner */}
        <PromotionBanner variant="inline" className="mb-6" />

        {/* Bag Items */}
        <div className="space-y-3 mb-6">
          {bundles.map((bundle) => (
            <BundleCard key={bundle.comboId} bundle={bundle} />
          ))}
          {regularItems.map((item, index) => (
            <BagItemCard
              key={`${item.itemId}-${item.variantId}-${item.size}-${index}`}
              item={item}
              compact
              showRemove
            />
          ))}
        </div>

        {/* Payment Selection */}
        <div className="mb-6 pt-4 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-secondary,#A0A0A0)] block mb-3">
            Select Payment Method
          </span>
          {isPaymentLoading ? (
            <div className="h-12 bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] animate-pulse w-full rounded-2xl"></div>
          ) : (
            <PaymentOptions
              paymentOptions={paymentOptions}
              paymentType={paymentType}
              setPaymentType={setPaymentType}
              setPaymentTypeId={setPaymentTypeId}
              setPaymentFee={setPaymentFee}
              setMerchantFee={setMerchantFee}
              bagItems={bagItems}
              isHighRisk={isHighRisk}
            />
          )}
        </div>

        {/* Coupon Section */}
        <div className="mb-6 pt-4 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-secondary,#A0A0A0)] block mb-3">
            Promo Code
          </span>
          <CouponInput />
        </div>

        {/* Financial Breakdown */}
        <div className="space-y-3 py-4 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))] text-xs font-bold uppercase tracking-wider">
          <div className="flex justify-between text-[var(--v2-text-secondary,#A0A0A0)]">
            <span>Subtotal</span>
            <span className="text-[var(--v2-text-primary,#F5F5F5)] font-black">
              LKR {rawSubTotal.toLocaleString()}
            </span>
          </div>

          {itemDiscount > 0 && (
            <div className="flex justify-between text-[var(--v2-accent,#2EE66A)]">
              <span>Discounts</span>
              <span className="font-black">- LKR {itemDiscount.toLocaleString()}</span>
            </div>
          )}

          {promotionDiscount > 0 && (
            <div className="flex justify-between text-[var(--v2-accent,#2EE66A)]">
              <span>Promotion</span>
              <span className="font-black">- LKR {promotionDiscount.toLocaleString()}</span>
            </div>
          )}

          {couponDiscount > 0 && (
            <div className="flex justify-between text-[var(--v2-accent,#2EE66A)]">
              <span>Coupon</span>
              <span className="font-black">- LKR {couponDiscount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between text-[var(--v2-text-secondary,#A0A0A0)]">
            <span>Shipping</span>
            <span className="text-[var(--v2-text-primary,#F5F5F5)] font-black">
              {shipping === 0 ? <span className="text-[var(--v2-accent,#2EE66A)]">FREE</span> : `LKR ${shipping}`}
            </span>
          </div>

          {fee > 0 && (
            <div className="flex justify-between text-amber-400">
              <span>Handling Fee</span>
              <span className="font-black">+ LKR {fee.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Total Section */}
        <div className="border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))] pt-4 mb-8 flex justify-between items-end">
          <span className="text-xs font-black uppercase tracking-widest text-[var(--v2-text-primary,#F5F5F5)]">
            Total Due
          </span>
          <span className="text-3xl font-black tracking-tight text-[var(--v2-accent,#2EE66A)] leading-none">
            LKR {finalTotal.toLocaleString()}
          </span>
        </div>

        {/* Submit Button */}
        <Button
          type="primary"
          htmlType="submit"
          disabled={bagItems.length === 0 || !paymentType}
          className="w-full h-14 rounded-full bg-[var(--v2-accent,#2EE66A)]! text-[#0A0A0A]! font-black uppercase tracking-widest text-xs border-none flex items-center justify-between px-6 cursor-pointer shadow-lg hover:opacity-90 active:scale-95 transition-all"
        >
          <span>Complete Order</span>
          <div className="w-8 h-8 rounded-full bg-[#0A0A0A] text-[var(--v2-accent,#2EE66A)] flex items-center justify-center">
            <IoArrowForward size={16} />
          </div>
        </Button>

        {/* Security Footer */}
        <div className="mt-6 text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 text-[var(--v2-text-muted,#666666)]">
            <IoLockClosedOutline size={12} />
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-muted,#666666)]">
              SSL Encrypted Checkout
            </span>
          </div>
          <p className="text-[9px] text-[var(--v2-text-muted,#666666)] leading-relaxed max-w-[280px] mx-auto m-0">
            By placing this order, you agree to Neverbe's Terms &amp; Conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
