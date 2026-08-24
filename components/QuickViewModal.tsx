"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoAdd, IoRemove, IoFlash } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { AppDispatch, RootState } from "@/redux/store";
import { addToBag } from "@/redux/bagSlice/bagSlice";
import { Product } from "@/interfaces/Product";
import { ProductVariant } from "@/interfaces/ProductVariant";
import { usePromotionsContext } from "@/components/PromotionsProvider";
import {
  ProductVariantTarget,
  PromotionCondition,
} from "@/interfaces/Promotion";
import { isVariantEligibleForPromotion } from "@/utils/promotionUtils";
import {
  calculateFinalPrice,
  getOriginalPrice,
  hasDiscount as checkHasDiscount,
} from "@/utils/pricing";
import SizeGrid from "@/components/SizeGrid";
import axiosInstance from "@/actions/axiosInstance";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const bagItems = useSelector((state: RootState) => state.bag.bag);
  const { getPromotionForProduct } = usePromotionsContext();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [sizeStock, setSizeStock] = useState<Record<string, number>>({});
  const [stockLoading, setStockLoading] = useState(false);
  const [allVariantStock, setAllVariantStock] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    if (product) {
      const defaultVariant = product.variants?.[0] || null;
      setSelectedVariant(defaultVariant);
      setSelectedSize("");
      setQty(1);
      setSizeStock({});
      setAllVariantStock({});
    }
  }, [product]);

  useEffect(() => {
    if (!product || !isOpen || !product.variants?.length) return;

    const loadAllVariantStock = async () => {
      const stockMap: Record<string, number> = {};

      const promises = product.variants.map(async (variant) => {
        if (!variant.sizes?.length) {
          stockMap[variant.variantId] = 0;
          return;
        }

        try {
          const res = await axiosInstance.get(
            `/web/inventory/batch?productId=${product.id}&variantId=${
              variant.variantId
            }&sizes=${variant.sizes.join(",")}`,
          );
          const data = res.data;
          const totalStock = Object.values(data.stock || {}).reduce(
            (sum: number, qty: unknown) => sum + (Number(qty) || 0),
            0,
          );
          stockMap[variant.variantId] = totalStock;
        } catch {
          stockMap[variant.variantId] = 0;
        }
      });

      await Promise.all(promises);
      setAllVariantStock(stockMap);
    };

    loadAllVariantStock();
  }, [product, isOpen]);

  useEffect(() => {
    if (!product || !selectedVariant) return;

    const fetchStock = async () => {
      if (!selectedVariant.sizes?.length) return;

      setStockLoading(true);
      try {
        const res = await axiosInstance.get(
          `/web/inventory/batch?productId=${product.id}&variantId=${
            selectedVariant.variantId
          }&sizes=${selectedVariant.sizes.join(",")}`,
        );
        const data = res.data;
        setSizeStock(data.stock || {});
      } catch {
        setSizeStock({});
      } finally {
        setStockLoading(false);
      }
    };

    fetchStock();
  }, [product, selectedVariant]);

  if (!product) return null;

  const currentVariant = selectedVariant || product.variants?.[0];
  const activeImage = currentVariant?.images?.[0]?.url || "";

  const activePromo = getPromotionForProduct(product.id, currentVariant?.variantId);

  const isVariantEligible = currentVariant
    ? isVariantEligibleForPromotion(activePromo, currentVariant.variantId)
    : true;

  const effectivePromo = isVariantEligible ? activePromo : null;

  const { finalPrice, isPromoDiscount } = calculateFinalPrice(
    product,
    currentVariant,
    effectivePromo,
  );
  const originalPrice = getOriginalPrice(product, currentVariant);
  const hasAnyDiscount = checkHasDiscount(product, currentVariant, effectivePromo);
  const discountedPrice = finalPrice;
  const totalSavings = originalPrice - discountedPrice;

  const availableStock = selectedSize ? sizeStock[selectedSize] || 0 : 0;
  const bagItem = bagItems.find(
    (item) =>
      item.itemId === product.id &&
      item.variantId === currentVariant?.variantId &&
      item.size === selectedSize,
  );
  const bagQty = bagItem ? bagItem.quantity : 0;

  const isOutOfStock = selectedSize ? availableStock <= 0 : false;
  const isLimitReached = selectedSize ? bagQty >= availableStock : false;

  const handleAddToBag = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (isOutOfStock) {
      toast.error("This size is out of stock");
      return;
    }
    if (isLimitReached) {
      toast.error(`You have already added maximum available stock (${availableStock}) to bag`);
      return;
    }

    if (!currentVariant) return;

    dispatch(
      addToBag({
        itemId: product.id,
        variantId: currentVariant.variantId,
        variantName: currentVariant.variantName,
        name: product.name,
        price: originalPrice,
        discount: totalSavings,
        quantity: qty,
        size: selectedSize,
        thumbnail: activeImage,
      }),
    );

    toast.success(`Added ${qty} × ${product.name} (${selectedSize}) to bag`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 v2-dialog-backdrop"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-4xl bg-[var(--v2-bg-surface,#141414)] text-[var(--v2-text-primary,#F5F5F5)] rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col md:flex-row my-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-[var(--v2-accent,#2EE66A)] text-[var(--v2-accent-text,#0A0A0A)] border border-[var(--v2-accent,#2EE66A)] hover:opacity-90 flex items-center justify-center transition-all cursor-pointer shadow-md"
              aria-label="Close modal"
            >
              <IoClose size={20} className="text-[var(--v2-accent-text,#0A0A0A)]" />
            </button>

            {/* LEFT: IMAGE & VARIANTS */}
            <div className="w-full md:w-1/2 p-6 bg-[#0A0A0A] flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-4">
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Variant Selector */}
              {product.variants && product.variants.length > 1 && (
                <div className="flex gap-2 overflow-x-auto max-w-full p-1">
                  {product.variants.map((v) => {
                    const isSelected = currentVariant?.variantId === v.variantId;
                    const stock = allVariantStock[v.variantId];
                    const isOutOfStock = stock !== undefined && stock <= 0;

                    return (
                      <button
                        key={v.variantId}
                        onClick={() => {
                          setSelectedVariant(v);
                          setSelectedSize("");
                        }}
                        disabled={isOutOfStock}
                        className={`relative w-12 h-12 rounded-xl overflow-hidden border p-0.5 transition-all cursor-pointer bg-[#0A0A0A] ${
                          isSelected
                            ? "border-[var(--v2-accent,#2EE66A)] ring-2 ring-[var(--v2-accent,#2EE66A)]/30"
                            : "border-[var(--v2-glass-border,rgba(255,255,255,0.1))]"
                        } ${isOutOfStock ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={v.images[0]?.url || ""}
                            alt={v.variantName}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT: DETAILS */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
              {/* Promo Banner */}
              {activePromo && (
                <div className="bg-[var(--v2-accent,#2EE66A)]/10 text-[var(--v2-accent,#2EE66A)] border border-[var(--v2-accent,#2EE66A)]/30 p-3 rounded-2xl mb-4 flex items-center gap-2">
                  <IoFlash size={16} className="animate-pulse shrink-0" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    {activePromo.name || "Special Offer"}
                  </span>
                </div>
              )}

              <span className="v2-section-label text-[9px] mb-1">
                {product.brand?.replace("-", " ")}
              </span>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0 mb-3">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl font-black text-[var(--v2-accent,#2EE66A)]">
                  LKR {discountedPrice.toLocaleString()}
                </span>
                {hasAnyDiscount && originalPrice > discountedPrice && (
                  <span className="text-xs text-[var(--v2-text-muted,#666666)] line-through">
                    LKR {originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Size Grid */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-[var(--v2-text-primary,#F5F5F5)]">
                    Select Size
                  </span>
                </div>
                <SizeGrid
                  sizes={currentVariant?.sizes || []}
                  selectedSize={selectedSize}
                  onSelectSize={setSelectedSize}
                  stockMap={sizeStock}
                  stockLoading={stockLoading}
                />
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-black uppercase tracking-widest text-[var(--v2-text-primary,#F5F5F5)]">
                  Quantity
                </span>
                <div className="flex items-center gap-3 bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] rounded-full px-3 py-1">
                  <button
                    onClick={() => setQty((p) => Math.max(1, p - 1))}
                    disabled={qty <= 1}
                    className="text-[var(--v2-text-primary,#F5F5F5)] hover:text-[var(--v2-accent,#2EE66A)] bg-transparent border-none cursor-pointer p-1"
                  >
                    <IoRemove size={16} />
                  </button>
                  <span className="text-sm font-black text-[var(--v2-text-primary,#F5F5F5)] px-2">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((p) => Math.min(10, p + 1))}
                    disabled={qty >= 10}
                    className="text-[var(--v2-text-primary,#F5F5F5)] hover:text-[var(--v2-accent,#2EE66A)] bg-transparent border-none cursor-pointer p-1"
                  >
                    <IoAdd size={16} />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-auto space-y-3">
                <button
                  onClick={handleAddToBag}
                  disabled={!product.inStock || !selectedSize || isOutOfStock}
                  className={`w-full py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all border-none cursor-pointer shadow-lg ${
                    !product.inStock || isOutOfStock
                      ? "bg-rose-500/20 text-rose-400 cursor-not-allowed"
                      : !selectedSize
                      ? "bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] text-[var(--v2-text-muted,#666666)] cursor-not-allowed"
                      : "bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] hover:opacity-90 active:scale-95"
                  }`}
                >
                  {!product.inStock || isOutOfStock
                    ? "Sold Out"
                    : !selectedSize
                    ? "Select Size to Add"
                    : "Add to Bag"}
                </button>

                <Link
                  href={`/collections/products/${product.id}`}
                  onClick={onClose}
                  className="block text-center w-full py-3.5 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] font-black text-xs uppercase tracking-widest hover:border-[var(--v2-accent,#2EE66A)] transition-all"
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
