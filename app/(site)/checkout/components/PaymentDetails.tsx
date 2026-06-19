"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Form,
  Input,
  Button,
  Typography,
  Flex,
  Divider,
  Space,
  Card,
  Badge,
} from "antd";
import { RootState } from "@/redux/store";
import { IoArrowForward, IoLockClosedOutline } from "react-icons/io5";
import BagItemCard from "@/components/BagItemCard";
import CouponInput from "@/components/CouponInput";
import PromotionBanner from "@/components/PromotionBanner";
import {
  calculateFee,
  calculateShippingCost,
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
}

interface BundleGroup {
  comboId: string;
  comboName: string;
  items: BagItem[];
  totalPrice: number;
  totalDiscount: number;
}

// Compact Bundle Card for Checkout - NEVERBE Style
const BundleCard = ({ bundle }: { bundle: BundleGroup }) => {
  const netPrice = bundle.totalPrice - bundle.totalDiscount;

  return (
    <div className="border border-default bg-surface rounded-xl overflow-hidden shadow-sm">
      <div className="bg-surface-2 text-primary-dark px-3 py-2 flex justify-between items-center border-b border-default">
        <span className="text-[9px] font-display font-black uppercase tracking-tighter">
          Bundle
        </span>
        <span className="text-[10px] font-bold">{bundle.comboName}</span>
      </div>

      <div className="divide-y divide-default">
        {bundle.items.map((item, idx) => (
          <div key={idx} className="flex gap-2 p-2">
            <div className="relative w-10 h-10 bg-surface-2 rounded-lg shrink-0">
              <Image
                src={item.thumbnail || ""}
                alt={item.name}
                fill
                className="object-cover mix-blend-multiply rounded-lg"
              />
              <span className="absolute -top-1 -left-1 bg-accent text-white text-[7px] font-black px-1 rounded-sm">
                {idx + 1}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase truncate text-primary-dark">
                {item.name}
              </p>
              <p className="text-[9px] text-muted uppercase">
                Size: {item.size}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-default px-3 py-2 flex justify-between items-center bg-surface-2">
        <span className="text-[9px] text-muted uppercase font-bold">
          {bundle.items.length} Items
        </span>
        <div className="text-right">
          {bundle.totalDiscount > 0 && (
            <span className="text-[9px] text-muted line-through mr-2">
              Rs. {bundle.totalPrice.toLocaleString()}
            </span>
          )}
          <span className="text-xs font-display font-black text-accent">
            Rs. {netPrice.toLocaleString()}
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
}) => {
  const bagItems = useSelector((state: RootState) => state.bag.bag);
  const couponDiscount =
    useSelector((state: RootState) => state.bag.couponDiscount) || 0;
  const promotionDiscount =
    useSelector((state: RootState) => state.bag.promotionDiscount) || 0;

  const [paymentOptions, setPaymentOptions] = useState<PaymentMethod[]>([]);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  // Group combo items by comboId
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

    return {
      bundles: Array.from(bundleMap.values()),
      regularItems: regular,
    };
  }, [bagItems]);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        setIsPaymentLoading(true);
        const res = await axiosInstance.get("/web/payment-methods");
        if (res.data) {
          const methods = res.data;
          setPaymentOptions(methods || []);
          if (methods.length > 0 && !paymentType) {
            setPaymentType(methods[0].name);
            setPaymentTypeId(methods[0].paymentId);
            setPaymentFee(methods[0].customerFee || 0);
            if (setMerchantFee) setMerchantFee(methods[0].fee || 0);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsPaymentLoading(false);
      }
    };
    fetchMethods();
  }, []);

  // Calculations
  const itemDiscount = calculateTotalDiscount(bagItems);
  const fee = calculateFee(selectedPaymentFee, bagItems);
  const rawSubTotal = calculateTotal(bagItems);

  // Reconstruct total with dynamic shipping
  const finalTotal =
    rawSubTotal -
    itemDiscount +
    shippingCost +
    fee -
    couponDiscount -
    promotionDiscount;

  const shipping = shippingCost;

  const bundleCount = bundles.length;
  const regularCount = regularItems.length;

  return (
    <div className="w-full flex justify-center items-center h-full sm:px-0">
      <Card
        bordered={false}
        styles={{
          body: {
            padding: "clamp(12px, 3vw, 32px)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          },
        }}
        className="w-full max-w-[450px] lg:max-w-none bg-transparent! lg:bg-white! border-none! lg:border! border-default! rounded-none! md:rounded-2xl! h-full shadow-none! lg:shadow-sm! flex flex-col mx-auto"
      >
        {/* Header */}
        <Flex vertical align="center" gap={8} className="mb-10">
          <Typography.Title
            level={4}
            className="uppercase tracking-tighter text-center w-full"
            style={{ margin: 0, fontWeight: 900 }}
          >
            Order Summary
          </Typography.Title>
          <Badge
            count={`${bagItems.length} Items${bundleCount > 0 ? ` · ${bundleCount} Bundle` : ""}`}
            style={{
              backgroundColor: "var(--color-primary)",
              color: "#ffffff",
              fontWeight: 800,
            }}
          />
        </Flex>

        {/* Promotion Banner */}
        <div className="mb-6 mt-3">
          <PromotionBanner variant="inline" />
        </div>

        {/* Items - Grouped by Bundles and Regular */}
        <Flex
          vertical
          gap={16}
          className="mb-6 max-h-[320px] overflow-y-auto pr-2 hide-scrollbar"
        >
          {/* Bundles First */}
          {bundles.map((bundle) => (
            <BundleCard key={bundle.comboId} bundle={bundle} />
          ))}

          {/* Regular Items */}
          {regularItems.map((item, index) => (
            <BagItemCard
              key={`${item.itemId}-${item.variantId}-${item.size}-${index}`}
              item={item}
              compact
              showRemove
            />
          ))}
        </Flex>

        <Divider style={{ margin: "24px 0", borderColor: "#f0f0f0" }} />

        {/* Payment Selection */}
        <div className="mb-6">
          <Typography.Text className="text-[10px] font-black uppercase tracking-widest text-muted block mb-3">
            Select Payment Method
          </Typography.Text>
          {isPaymentLoading ? (
            <div className="h-12 bg-surface-3 animate-pulse w-full rounded-xl"></div>
          ) : (
            <PaymentOptions
              paymentOptions={paymentOptions}
              paymentType={paymentType}
              setPaymentType={setPaymentType}
              setPaymentTypeId={setPaymentTypeId}
              setPaymentFee={setPaymentFee}
              setMerchantFee={setMerchantFee}
              bagItems={bagItems}
            />
          )}
        </div>

        <Divider style={{ margin: "24px 0", borderColor: "#f0f0f0" }} />

        {/* Coupon Section */}
        <div className="mb-6">
          <Typography.Text className="text-[10px] font-black uppercase tracking-widest text-muted block mb-3">
            Promo Code
          </Typography.Text>
          <CouponInput />
        </div>

        <Divider style={{ margin: "24px 0", borderColor: "#f0f0f0" }} />

        {/* Financial Breakdown */}
        <Flex vertical gap={12} className="mb-6">
          <Flex justify="space-between" align="center">
            <Typography.Text className="text-primary-dark font-medium">
              Subtotal
            </Typography.Text>
            <Typography.Text className="font-bold text-primary-dark font-mono">
              Rs. {rawSubTotal.toLocaleString()}
            </Typography.Text>
          </Flex>

          {itemDiscount > 0 && (
            <Flex
              justify="space-between"
              align="center"
              className="text-accent bg-accent/10 py-1.5 px-3 rounded-lg -mx-3"
            >
              <Typography.Text className="font-bold text-accent">
                Discounts
              </Typography.Text>
              <Typography.Text className="font-bold font-mono text-accent">
                - Rs. {itemDiscount.toLocaleString()}
              </Typography.Text>
            </Flex>
          )}

          {promotionDiscount > 0 && (
            <Flex
              justify="space-between"
              align="center"
              className="text-accent bg-accent/10 py-1.5 px-3 rounded-lg -mx-3"
            >
              <Typography.Text className="font-bold text-accent">
                Promotion
              </Typography.Text>
              <Typography.Text className="font-bold font-mono text-accent">
                - Rs. {promotionDiscount.toLocaleString()}
              </Typography.Text>
            </Flex>
          )}

          {couponDiscount > 0 && (
            <Flex
              justify="space-between"
              align="center"
              className="text-accent bg-accent/10 py-1.5 px-3 rounded-lg -mx-3"
            >
              <Typography.Text className="font-bold text-accent">
                Coupon
              </Typography.Text>
              <Typography.Text className="font-bold font-mono text-accent">
                - Rs. {couponDiscount.toLocaleString()}
              </Typography.Text>
            </Flex>
          )}

          <Flex justify="space-between" align="center">
            <Typography.Text className="text-primary-dark font-medium">
              Shipping
            </Typography.Text>
            <Typography.Text className="font-bold text-primary-dark font-mono">
              {shipping === 0 ? "FREE" : `Rs. ${shipping}`}
            </Typography.Text>
          </Flex>

          <Flex
            justify="space-between"
            align="center"
            className="bg-orange-50 py-1.5 px-3 rounded-lg -mx-3"
          >
            <Typography.Text className="text-orange-600 font-bold">
              Handling Fee
            </Typography.Text>
            <Typography.Text className="font-bold text-orange-600 font-mono">
              + Rs. {fee.toFixed(2)}
            </Typography.Text>
          </Flex>
        </Flex>

        {/* Total Section */}
        <div className="border-t-2 border-primary pt-4 mt-auto mb-8">
          <Flex justify="space-between" align="end">
            <Typography.Text className="text-sm font-black uppercase tracking-widest text-primary-dark">
              Total Due
            </Typography.Text>
            <Typography.Text className="text-3xl font-display font-black tracking-tighter text-primary-dark leading-none">
              Rs.{finalTotal.toLocaleString()}
            </Typography.Text>
          </Flex>
        </div>

        {/* Submit Button */}
        <Button
          type="primary"
          htmlType="submit"
          disabled={bagItems.length === 0 || !paymentType}
          style={{
            background:
              bagItems.length === 0 || !paymentType
                ? undefined
                : "var(--color-accent)",
            border: "none",
            borderRadius: 99,
            height: 64,
            padding: "0 24px",
          }}
          className="group w-full flex items-center justify-between text-white transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
        >
          <span className="font-display font-black uppercase tracking-widest text-sm">
            Complete Order
          </span>
          <div className="bg-white text-accent rounded-full p-2 transition-transform group-hover:translate-x-1">
            <IoArrowForward size={18} />
          </div>
        </Button>

        {/* Spacer for better mobile layout */}
        <div className="h-10" />

        {/* Security Footer */}
        <Flex vertical align="center" gap={8} className="text-center">
          <Flex align="center" gap={6} className="text-muted">
            <IoLockClosedOutline size={12} />
            <Typography.Text className="text-[10px] font-black uppercase tracking-widest text-muted">
              Secure Checkout
            </Typography.Text>
          </Flex>
          <Typography.Text className="text-[9px] text-muted leading-relaxed max-w-[250px]">
            By placing this order, you agree to the Terms of Service. Please do
            not close this window until the checkout is complete.
          </Typography.Text>
        </Flex>
      </Card>
    </div>
  );
};

export default PaymentDetails;
