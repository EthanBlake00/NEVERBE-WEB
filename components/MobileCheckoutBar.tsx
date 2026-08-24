"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowForward, IoBagOutline } from "react-icons/io5";
import { Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { RootState, AppDispatch } from "@/redux/store";
import { calculateSubTotal } from "@/utils/bagCalculations";
import { hideBag } from "@/redux/bagSlice/bagSlice";
import usePromotions from "@/hooks/usePromotions";

/**
 * MobileCheckoutBar - NEVERBE Premium Theme
 * A global sticky bar for mobile that shows the current bag total
 * and a direct link to checkout.
 */
const MobileCheckoutBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch: AppDispatch = useDispatch();
  const bagItems = useSelector((state: RootState) => state.bag.bag);
  const couponDiscount =
    useSelector((state: RootState) => state.bag.couponDiscount) || 0;
  const promotionDiscount =
    useSelector((state: RootState) => state.bag.promotionDiscount) || 0;
  const showBag = useSelector((state: RootState) => state.bag.showBag);
  
  // Attach active promotion calculation engine 
  usePromotions();

  // Filter visibility: Hide on specific pages
  const isHiddenPage =
    pathname?.startsWith("/checkout") ||
    pathname?.startsWith("/account") ||
    pathname?.startsWith("/policies");

  // We only show this bar on mobile (lg:hidden) and when bag has items
  const shouldShow = bagItems.length > 0 && !isHiddenPage;

  // Simple total calculation for the quick-view bar
  const totalDue =
    calculateSubTotal(bagItems, 0, 0) - couponDiscount - promotionDiscount;

  if (!shouldShow) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      >
        <div className="bg-dark/80 backdrop-blur-xl border-t border-white/10 px-5 py-3 shadow-[0_-8px_30px_rgb(0,0,0,0.3)]">
          <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
            {/* Total Value Info - with intelligent contrast logic */}
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-widest text-accent">
                Bag Total
              </span>
              <span className="text-lg font-display font-black text-inverse tracking-tighter mix-blend-difference">
                Rs. {Math.max(0, totalDue).toLocaleString()}
              </span>
            </div>

            {/* Ultra Compact Checkout Button */}
            <Button
              type="primary"
              onClick={() => {
                if (showBag) dispatch(hideBag());
                router.push("/checkout");
              }}
              className="shrink-0 h-auto py-1.5 px-4 bg-[var(--v2-accent,#2EE66A)] text-[var(--v2-accent-text,#0A0A0A)] border-none rounded-full font-display font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-1 shadow-custom active:scale-95 transition-all w-auto"
            >
              Checkout
              <div className="bg-dark text-inverse rounded-full p-0.5 flex items-center justify-center">
                <IoArrowForward size={9} />
              </div>
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileCheckoutBar;
