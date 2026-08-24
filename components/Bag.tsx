"use client";
import React, { useMemo, useEffect } from "react";
import DropShadow from "@/components/DropShadow";
import { motion } from "framer-motion";
import {
  IoCloseOutline,
  IoBagHandleOutline,
  IoArrowForward,
  IoTrashOutline,
} from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  hideBag,
  removeFromBag,
  removeCoupon,
  removePromotion,
} from "@/redux/bagSlice/bagSlice";
import { useRouter } from "next/navigation";
import {
  calculateSubTotal,
  calculateTotal,
  calculateTotalDiscount,
} from "@/utils/bagCalculations";
import { BagItem } from "@/interfaces/BagItem";
import Image from "next/image";
import usePromotions from "@/hooks/usePromotions";
import PromotionBanner from "@/components/PromotionBanner";
import axiosInstance from "@/actions/axiosInstance";

// --- Types ---
interface BundleGroup {
  comboId: string;
  comboName: string;
  items: BagItem[];
  totalPrice: number;
  totalDiscount: number;
}

// --- Sub-Components ---
const BundleGroupCard = ({
  bundle,
  onRemove,
}: {
  bundle: BundleGroup;
  onRemove: (item: BagItem) => void;
}) => {
  const netPrice = bundle.totalPrice - bundle.totalDiscount;

  return (
    <div className="v2-glass rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] overflow-hidden">
      {/* Bundle Header */}
      <div className="bg-[var(--v2-accent,#2EE66A)]/10 text-[var(--v2-accent,#2EE66A)] px-4 py-2.5 flex justify-between items-center border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-accent,#2EE66A)]">
          Bundle Deal
        </span>
        <span className="text-xs font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)]">
          {bundle.comboName}
        </span>
      </div>

      {/* Bundle Items */}
      <div className="divide-y divide-[var(--v2-glass-border,rgba(255,255,255,0.06))]">
        {bundle.items.map((item, idx) => (
          <div key={idx} className="flex gap-3 p-3 items-center">
            {/* Thumbnail */}
            <div className="relative w-14 h-14 bg-[#0A0A0A] shrink-0 rounded-2xl overflow-hidden border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] p-0.5">
              <Image
                src={item.thumbnail || ""}
                alt={item.name}
                fill
                className="object-cover rounded-xl"
              />
              <span className="absolute top-1 left-1 bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] text-[8px] font-black px-1 rounded-sm">
                {idx + 1}
              </span>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black uppercase truncate text-[var(--v2-text-primary,#F5F5F5)] m-0">
                {item.name}
              </p>
              <p className="text-[10px] text-[var(--v2-text-secondary,#A0A0A0)] uppercase font-bold m-0">
                Size: <span className="text-[var(--v2-text-primary,#F5F5F5)]">{item.size}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bundle Footer */}
      <div className="px-4 py-3 flex justify-between items-center bg-[var(--v2-glass-bg,rgba(255,255,255,0.02))] border-t border-[var(--v2-glass-border,rgba(255,255,255,0.06))]">
        <button
          onClick={() => bundle.items.forEach((item) => onRemove(item))}
          className="text-[10px] font-black uppercase tracking-wider text-[var(--v2-text-muted,#666666)] hover:text-rose-400 transition-colors border-none bg-transparent cursor-pointer p-0"
        >
          Remove Bundle
        </button>
        <div className="text-right">
          {bundle.totalDiscount > 0 && (
            <p className="text-[10px] text-[var(--v2-text-muted,#666666)] line-through m-0">
              LKR {bundle.totalPrice.toLocaleString()}
            </p>
          )}
          <p className="text-xs font-black text-[var(--v2-accent,#2EE66A)] m-0">
            LKR {netPrice.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

const SingleItemCard = ({
  item,
  onRemove,
}: {
  item: BagItem;
  onRemove: (item: BagItem) => void;
}) => {
  const totalPrice = item.price * item.quantity;
  const netPrice = totalPrice - item.discount;

  return (
    <div className="flex gap-4 w-full v2-glass p-3.5 rounded-2xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] hover:border-[var(--v2-accent,#2EE66A)] transition-all">
      {/* Image */}
      <div className="relative w-20 h-20 bg-[#0A0A0A] shrink-0 rounded-2xl overflow-hidden border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] p-0.5">
        <Image
          src={item.thumbnail || ""}
          alt={item.name}
          fill
          className="object-cover rounded-xl"
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between py-0.5">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-black text-xs uppercase leading-tight line-clamp-2 text-[var(--v2-text-primary,#F5F5F5)] m-0">
              {item.name}
            </h3>
            <div className="text-right shrink-0">
              {item.discount > 0 ? (
                <>
                  <p className="font-black text-xs text-[var(--v2-accent,#2EE66A)] m-0">
                    LKR {netPrice.toLocaleString()}
                  </p>
                  <p className="text-[9px] text-[var(--v2-text-muted,#666666)] line-through m-0">
                    LKR {totalPrice.toLocaleString()}
                  </p>
                </>
              ) : (
                <p className="font-black text-xs text-[var(--v2-accent,#2EE66A)] m-0">
                  LKR {totalPrice.toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="mt-1 text-[10px] text-[var(--v2-text-secondary,#A0A0A0)] font-extrabold uppercase space-y-0.5">
            {item.variantName && (
              <p className="m-0 text-[var(--v2-text-secondary,#A0A0A0)]">{item.variantName}</p>
            )}
            <p className="m-0">
              Size: <span className="text-[var(--v2-text-primary,#F5F5F5)]">{item.size}</span> | Qty:{" "}
              <span className="text-[var(--v2-text-primary,#F5F5F5)]">{item.quantity}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => onRemove(item)}
          className="text-[var(--v2-text-muted,#666666)] hover:text-rose-400 transition-colors border-none bg-transparent cursor-pointer p-0 mt-2 flex items-center gap-1 self-start"
          aria-label="Remove item"
        >
          <IoTrashOutline size={16} />
        </button>
      </div>
    </div>
  );
};

// --- Main Component ---
const Bag = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  usePromotions();

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

  const handleRemove = (item: BagItem) => {
    dispatch(removeFromBag(item));
  };

  useEffect(() => {
    if (bagItems.length === 0) {
      if (couponDiscount > 0) dispatch(removeCoupon());
      if (promotionDiscount > 0) dispatch(removePromotion());
    }
  }, [bagItems.length, couponDiscount, promotionDiscount, dispatch]);

  const [shippingCost, setShippingCost] = React.useState(0);
  const [loadingShipping, setLoadingShipping] = React.useState(false);

  useEffect(() => {
    const fetchShipping = async () => {
      if (bagItems.length === 0) {
        setShippingCost(0);
        return;
      }
      setLoadingShipping(true);
      try {
        const payload = {
          items: bagItems.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
          })),
        };
        const formData = new FormData();
        formData.append("data", JSON.stringify(payload));
        const res = await axiosInstance.post(
          "/web/shipping/calculate",
          formData,
        );
        if (res.data) {
          const data = res.data;
          setShippingCost(data.cost);
        }
      } catch (error) {
        console.error("Failed to fetch shipping", error);
      } finally {
        setLoadingShipping(false);
      }
    };
    fetchShipping();
  }, [bagItems]);

  const finalTotal =
    calculateSubTotal(bagItems, 0, shippingCost) -
    couponDiscount -
    promotionDiscount;

  return (
    <DropShadow containerStyle="flex justify-end">
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.3 }}
        className="w-full sm:w-[460px] bg-[var(--v2-bg-surface,#141414)] text-[var(--v2-text-primary,#F5F5F5)] h-screen flex flex-col shadow-2xl relative border-l border-[var(--v2-glass-border,rgba(255,255,255,0.08))]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Header --- */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
          <div>
            <span className="v2-section-label text-[9px] mb-0.5">SHOPPING BAG</span>
            <h2 className="text-xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0">
              Your Bag
            </h2>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--v2-text-secondary,#A0A0A0)] mt-0.5 m-0">
              {bagItems.length} Items
              {bundles.length > 0 &&
                ` · ${bundles.length} Bundle${bundles.length > 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={() => dispatch(hideBag())}
            className="w-10 h-10 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] hover:bg-[var(--v2-accent,#2EE66A)] hover:text-[#0A0A0A] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close Bag"
          >
            <IoCloseOutline size={22} />
          </button>
        </div>

        {/* --- Items List --- */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          <PromotionBanner variant="inline" className="mb-4" />

          {bagItems.length > 0 ? (
            <div className="space-y-4 animate-fade">
              {bundles.map((bundle) => (
                <BundleGroupCard
                  key={bundle.comboId}
                  bundle={bundle}
                  onRemove={handleRemove}
                />
              ))}
              {regularItems.map((item, index) => (
                <SingleItemCard
                  key={`${item.itemId}-${item.variantId}-${index}`}
                  item={item}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-16 h-16 rounded-full bg-[var(--v2-accent,#2EE66A)]/10 border border-[var(--v2-accent,#2EE66A)]/20 text-[var(--v2-accent,#2EE66A)] flex items-center justify-center mb-4">
                <IoBagHandleOutline size={32} />
              </div>
              <p className="font-black uppercase tracking-tight text-lg text-[var(--v2-text-primary,#F5F5F5)] m-0">
                Your Bag Is Empty
              </p>
              <p className="text-xs text-[var(--v2-text-secondary,#A0A0A0)] mt-1 mb-6 m-0">
                Explore our collections to add sneakers &amp; clothing.
              </p>
              <button
                onClick={() => dispatch(hideBag())}
                className="px-8 py-3.5 bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] font-black uppercase tracking-widest text-xs rounded-full hover:opacity-90 transition-all shadow-lg cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* --- Summary Footer --- */}
        {bagItems.length > 0 && (
          <div className="border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))] p-6 bg-[var(--v2-glass-bg,rgba(255,255,255,0.02))] space-y-4">
            <div className="space-y-2 text-xs font-bold uppercase tracking-wider">
              <div className="flex justify-between text-[var(--v2-text-secondary,#A0A0A0)]">
                <span>Subtotal</span>
                <span className="font-black text-[var(--v2-text-primary,#F5F5F5)]">
                  LKR {calculateTotal(bagItems).toLocaleString()}
                </span>
              </div>

              {(calculateTotalDiscount(bagItems) > 0 ||
                promotionDiscount > 0 ||
                couponDiscount > 0) && (
                <div className="space-y-1.5 text-[var(--v2-accent,#2EE66A)]">
                  {calculateTotalDiscount(bagItems) > 0 && (
                    <div className="flex justify-between">
                      <span>Discount</span>
                      <span className="font-black">
                        - LKR {calculateTotalDiscount(bagItems).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {promotionDiscount > 0 && (
                    <div className="flex justify-between">
                      <span>Promotion</span>
                      <span className="font-black">
                        - LKR {promotionDiscount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {couponDiscount > 0 && (
                    <div className="flex justify-between">
                      <span>Coupon Applied</span>
                      <span className="font-black">
                        - LKR {couponDiscount.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between text-[var(--v2-text-secondary,#A0A0A0)]">
                <span>Shipping</span>
                <span className="font-black text-[var(--v2-text-primary,#F5F5F5)]">
                  {loadingShipping ? (
                    <span className="animate-pulse">...</span>
                  ) : shippingCost === 0 ? (
                    <span className="text-[var(--v2-accent,#2EE66A)]">FREE</span>
                  ) : (
                    `LKR ${shippingCost.toLocaleString()}`
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))] pt-4">
              <span className="text-xs font-black uppercase tracking-widest text-[var(--v2-text-primary,#F5F5F5)]">
                Total Due
              </span>
              <span className="font-black text-2xl tracking-tight text-[var(--v2-accent,#2EE66A)]">
                LKR {Math.max(0, finalTotal).toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => {
                dispatch(hideBag());
                router.push("/checkout");
              }}
              className="w-full py-4 rounded-full bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] font-black uppercase tracking-widest text-xs flex items-center justify-between px-6 hover:opacity-90 transition-all shadow-lg cursor-pointer"
            >
              <span className="text-[#0A0A0A] font-black">Checkout Now</span>
              <div className="w-8 h-8 rounded-full bg-[#0A0A0A] text-[var(--v2-accent,#2EE66A)] flex items-center justify-center">
                <IoArrowForward size={16} />
              </div>
            </button>
          </div>
        )}
      </motion.div>
    </DropShadow>
  );
};

export default Bag;
