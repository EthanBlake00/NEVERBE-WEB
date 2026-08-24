"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingBag } from "lucide-react";
import { KOKOLogo } from "@/assets/images";
import { Product } from "@/interfaces/Product";
import { ProductVariant } from "@/interfaces/ProductVariant";
import {
  ProductVariantTarget,
  PromotionCondition,
} from "@/interfaces/Promotion";
import { usePromotionsContext } from "@/components/PromotionsProvider";
import { useQuickView } from "@/components/QuickViewProvider";
import {
  calculateFinalPrice,
  hasDiscount as checkHasDiscount,
} from "@/utils/pricing";
import { isVariantEligibleForPromotion } from "@/utils/promotionUtils";
import { motion } from "framer-motion";

interface ItemCardProps {
  item: Product;
  priority?: boolean;
}

export default function ItemCard({ item, priority = false }: ItemCardProps) {
  const [outOfStocks, setOutOfStocks] = useState(false);
  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(
    null
  );
  const { openQuickView } = useQuickView();
  const { getPromotionForProduct, getPromotionsForProduct } =
    usePromotionsContext();

  useEffect(() => {
    if (!item?.inStock) {
      setOutOfStocks(true);
    }
    if (item?.variants?.length > 0) {
      setActiveVariant(item.variants[0]);
    }
  }, [item]);

  const activePromo = getPromotionForProduct(
    item?.id,
    activeVariant?.variantId
  );
  const allPromos = getPromotionsForProduct(item?.id);
  const discountedPrice = calculateFinalPrice(item, activePromo);
  const hasDiscount = checkHasDiscount(item, activePromo);

  const displayImage =
    activeVariant?.images?.[0]?.url ||
    item?.thumbnail?.url ||
    (typeof item?.thumbnail === "string" ? item.thumbnail : "") ||
    "/collection-placeholder.png";

  const getVariantPromotion = (variantId: string) => {
    const promo = getPromotionForProduct(item?.id, variantId);
    if (!promo) return null;

    const isEligible = isVariantEligibleForPromotion(
      item?.id,
      variantId,
      promo.applicableProductVariants as ProductVariantTarget[] | undefined,
      promo.conditions as PromotionCondition[] | undefined
    );
    return isEligible ? promo : null;
  };

  const badgeText = item?.isRestockingSoon
    ? "Restock Soon"
    : outOfStocks
    ? "Sold Out"
    : item?.isNewArrival
    ? "New Arrival"
    : activePromo
    ? activePromo.name?.length < 20
      ? activePromo.name
      : activePromo.type === "BOGO"
      ? "Buy 1 Get 1"
      : "Special Offer"
    : item?.discount > 0
    ? `${item.discount}% Off`
    : null;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative w-full h-full flex flex-col justify-between rounded-[16px] bg-[var(--v2-bg-card,#181818)] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] hover:border-[var(--v2-accent,#2EE66A)] transition-all duration-400 hover:shadow-2xl overflow-hidden"
    >
      {/* IMAGE CONTAINER — Compact & Wide Aspect Ratio */}
      <div className="relative aspect-[4/3.4] w-full shrink-0 overflow-hidden bg-[var(--v2-bg-elevated,#1E1E1E)]">
        <Link href={`/collections/products/${item?.id}`} className="block w-full h-full">
          <Image
            src={displayImage}
            alt={item?.name || "Product"}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            priority={priority}
            className={`object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 ${
              outOfStocks ? "opacity-60 grayscale" : ""
            }`}
          />
        </Link>

        {/* FLOATING BADGE */}
        {badgeText && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full shadow-md backdrop-blur-md border ${
                outOfStocks
                  ? "bg-red-500/80 text-white border-red-400/30"
                  : item?.isRestockingSoon
                  ? "bg-amber-500/80 text-white border-amber-400/30"
                  : "bg-[var(--v2-accent,#2EE66A)] text-[var(--v2-accent-text,#0A0A0A)] border-[var(--v2-accent,#2EE66A)]"
              }`}
            >
              {badgeText}
            </span>
          </div>
        )}

        {/* QUICK VIEW HOVER ACTION */}
        <div className="absolute inset-x-0 bottom-2.5 z-20 flex justify-center px-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openQuickView(item);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[var(--v2-accent,#2EE66A)] text-[var(--v2-accent-text,#0A0A0A)] font-extrabold text-[10px] uppercase tracking-wider shadow-xl hover:scale-105 transition-transform cursor-pointer"
          >
            <Eye size={13} />
            Quick View
          </button>
        </div>
      </div>

      {/* CONTENT DETAILS */}
      <div className="p-2 sm:p-4 flex flex-col justify-between flex-1">
        <div>
          {/* TITLE & CATEGORY */}
          <Link href={`/collections/products/${item?.id}`}>
            <h3 className="text-[11px] sm:text-[13px] font-bold text-[var(--v2-text-primary,#F5F5F5)] uppercase tracking-wide group-hover:text-[var(--v2-accent,#2EE66A)] transition-colors line-clamp-2 min-h-[28px] sm:min-h-[36px] mb-0.5 leading-snug">
              {item?.name}
            </h3>
          </Link>
          <p className="text-[9px] sm:text-[11px] font-semibold text-[var(--v2-text-muted,#666666)] capitalize mb-1.5">
            {item?.category?.replace("-", " ") || "Lifestyle"}
          </p>

          {/* VARIANT SWATCHES (Fixed height slot for uniform card heights) */}
          <div className="min-h-[28px] sm:min-h-[34px] h-[28px] sm:h-[34px] flex items-center gap-1 overflow-x-auto hide-scrollbar mb-1.5 py-0.5">
            {item?.variants?.length > 1 &&
              item.variants.map((variant) => {
                const variantPromo = getVariantPromotion(variant.variantId);
                const isSelected = activeVariant?.variantId === variant.variantId;
                const variantName =
                  variant.variantName || variant.name || variant.size || variant.color || "Option";
                return (
                  <button
                    key={variant.variantId}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveVariant(variant);
                    }}
                    className={`shrink-0 relative cursor-pointer focus:outline-none px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider rounded-md transition-all duration-200 ${
                      isSelected
                        ? "bg-[var(--v2-accent,#2EE66A)] text-[var(--v2-accent-text,#0A0A0A)] border border-[var(--v2-accent,#2EE66A)] shadow-sm scale-105"
                        : "bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] text-[var(--v2-text-secondary,#A0A0A0)] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] hover:border-[var(--v2-accent,#2EE66A)] hover:text-[var(--v2-text-primary,#F5F5F5)]"
                    }`}
                  >
                    <span className="truncate max-w-[70px] sm:max-w-[100px] block">
                      {variantName}
                    </span>
                    {variantPromo && (
                      <span className="absolute -top-1 -right-1 z-10 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-amber-400 text-[#0A0A0A] text-[6px] sm:text-[7px] font-black rounded-full flex items-center justify-center shadow-sm">
                        %
                      </span>
                    )}
                  </button>
                );
              })}
          </div>

          {/* PRICING */}
          <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap mb-1">
            <span className="text-[12px] sm:text-[15px] font-black text-[var(--v2-accent,#2EE66A)]">
              LKR {(discountedPrice || 0).toLocaleString("en-LK")}
            </span>
            {hasDiscount && (
              <span className="text-[9px] sm:text-[12px] font-semibold text-[var(--v2-text-muted,#666666)] line-through">
                LKR {((item?.marketPrice && item.marketPrice > item?.sellingPrice) ? item.marketPrice : item?.sellingPrice || 0).toLocaleString("en-LK")}
              </span>
            )}
          </div>

          {/* PROMOTION TAGS */}
          {allPromos.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1.5">
              {allPromos.map((promo) => (
                <span
                  key={promo.id}
                  className="px-1 py-0.5 text-[7.5px] sm:text-[9px] font-extrabold uppercase tracking-wide bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-md"
                >
                  {promo.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* KOKO INSTALMENTS BAR (Rounded integer formatting prevents truncation) */}
        <div className="mt-1.5 pt-1.5 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))] flex items-center justify-between gap-1">
          <span className="text-[8.5px] sm:text-[10px] font-bold text-[var(--v2-text-secondary,#A0A0A0)] whitespace-nowrap">
            3 x LKR {Math.round((discountedPrice || 0) / 3).toLocaleString("en-LK")}
          </span>
          <div className="w-6 sm:w-8 h-2.5 sm:h-3 relative opacity-80 shrink-0">
            <Image src={KOKOLogo} alt="KOKO Pay" fill className="object-contain" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
