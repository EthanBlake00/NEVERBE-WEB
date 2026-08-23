"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {
  IoHeartOutline,
  IoHeart,
  IoAddOutline,
  IoRemoveOutline,
} from "react-icons/io5";
import { FaWhatsapp, FaTruckFast, FaArrowRotateLeft } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { AppDispatch, RootState } from "@/redux/store";
import { addToBag } from "@/redux/bagSlice/bagSlice";
import {
  toggleWishlist,
  hydrateWishlist,
  WishlistItem,
} from "@/redux/wishlistSlice/wishlistSlice";
import { Product } from "@/interfaces/Product";
import { ProductVariant } from "@/interfaces/ProductVariant";
import { KOKOLogo } from "@/assets/images";
import SizeGuideDialog from "@/components/SizeGuideDialog";
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
  hasConditions,
} from "@/utils/pricing";
import StockBadge from "@/components/StockBadge";
import ShareButtons from "@/components/ShareButtons";
import SizeGrid from "@/components/SizeGrid";
import axiosInstance from "@/actions/axiosInstance";

const ProductHero = ({ item }: { item: Product }) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const bagItems = useSelector((state: RootState) => state.bag.bag);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const { getPromotionForProduct } = usePromotionsContext();

  useEffect(() => {
    dispatch(hydrateWishlist());
  }, [dispatch]);

  const [selectedImage, setSelectedImage] = useState(item.thumbnail);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    item.variants[0],
  );
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [sizeStock, setSizeStock] = useState<Record<string, number>>({});
  const [stockLoading, setStockLoading] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [allVariantStock, setAllVariantStock] = useState<
    Record<string, number>
  >({});

  const activePromo = getPromotionForProduct(
    item.id,
    selectedVariant.variantId,
  );

  const discountedPrice = calculateFinalPrice(item, activePromo);
  const originalPrice = getOriginalPrice(item);
  const hasAnyDiscount = checkHasDiscount(item, activePromo);
  const totalSavings = Math.max(0, originalPrice - discountedPrice);
  const isPromoDiscount = !!activePromo && !hasConditions(activePromo);

  const getVariantPromotion = (variantId: string) => {
    const promo = getPromotionForProduct(item.id, variantId);
    if (!promo) return null;

    const isEligible = isVariantEligibleForPromotion(
      item.id,
      variantId,
      promo.applicableProductVariants as ProductVariantTarget[] | undefined,
      promo.conditions as PromotionCondition[] | undefined,
    );

    return isEligible ? promo : null;
  };

  useEffect(() => {
    if (selectedVariant.images?.length) {
      setSelectedImage(selectedVariant.images[0]);
    }
  }, [selectedVariant]);

  useEffect(() => {
    if (!item.variants?.length) return;

    const loadAllVariantStock = async () => {
      const stockMap: Record<string, number> = {};

      const promises = item.variants.map(async (variant) => {
        if (!variant.sizes?.length) {
          stockMap[variant.variantId] = 0;
          return;
        }

        try {
          const res = await axiosInstance.get(
            `/web/inventory/batch?productId=${item.id}&variantId=${
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
  }, [item.id]);

  useEffect(() => {
    const fetchStock = async () => {
      setStockLoading(true);
      try {
        const res = await axiosInstance.get(
          `/web/inventory/batch?productId=${item.id}&variantId=${
            selectedVariant.variantId
          }&sizes=${selectedVariant.sizes.join(",")}`,
        );
        const data = res.data;
        setSizeStock(data.stock || {});
      } catch (e) {
        console.error(e);
      } flex: {
        setStockLoading(false);
      }
    };
    fetchStock();
  }, [selectedVariant.variantId, item.id]);

  const availableStock = selectedSize ? sizeStock[selectedSize] ?? 0 : 0;
  const bagQty =
    bagItems.find(
      (b) =>
        b.itemId === item.id &&
        b.variantId === selectedVariant.variantId &&
        b.size === selectedSize,
    )?.quantity || 0;
  const isLimitReached =
    selectedSize !== "" && availableStock > 0 && bagQty + qty > availableStock;

  const isInWishlist = wishlistItems.some(
    (w) => w.productId === item.id && w.variantId === selectedVariant.variantId,
  );

  const handleToggleWishlist = () => {
    const wishlistItem: WishlistItem = {
      productId: item.id,
      variantId: selectedVariant.variantId,
      name: item.name,
      thumbnail: selectedVariant.images[0]?.url || item.thumbnail.url,
      price: item.sellingPrice,
      addedAt: new Date().toISOString(),
    };
    dispatch(toggleWishlist(wishlistItem));
  };

  const handleAddToBag = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    const productDiscount =
      Math.round(((item.discount / 100) * item.sellingPrice * qty) / 10) * 10;
    dispatch(
      addToBag({
        itemId: item.id,
        variantId: selectedVariant.variantId,
        size: selectedSize,
        quantity: qty,
        price: item.sellingPrice,
        name: item.name,
        thumbnail: selectedVariant.images[0]?.url || item.thumbnail.url,
        itemType: "product",
        variantName: selectedVariant.variantName,
        discount: productDiscount,
        maxQuantity: 10,
        category: item.category || "",
        brand: item.brand || "",
        weight: item.weight || 1000,
      } as any),
    );
    toast.success(`Added ${qty} item${qty > 1 ? "s" : ""} to bag`);
    setQty(1);
  };

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-6 md:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
      {/* --- LEFT COLUMN: IMAGES --- */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        <div className="relative aspect-square bg-[#0A0A0A] rounded-3xl overflow-hidden border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] p-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedImage.url}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full relative"
            >
              <Image
                src={selectedImage.url}
                alt={item.name}
                fill
                priority
                className="object-cover rounded-2xl"
              />
            </motion.div>
          </AnimatePresence>

          {item.discount > 0 && (
            <div className="absolute top-4 left-4 bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">
              {item.discount}% Off
            </div>
          )}
        </div>

        {/* Thumbnail gallery */}
        <div className="grid grid-cols-6 gap-3">
          {selectedVariant.images.map((img, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`relative aspect-square bg-[#0A0A0A] rounded-2xl overflow-hidden border transition-all p-0.5 h-auto w-full cursor-pointer ${
                selectedImage.url === img.url
                  ? "border-[var(--v2-accent,#2EE66A)] ring-2 ring-[var(--v2-accent,#2EE66A)]/30"
                  : "border-[var(--v2-glass-border,rgba(255,255,255,0.1))] opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                className="object-cover rounded-xl"
              />
            </button>
          ))}
        </div>
      </div>

      {/* --- RIGHT COLUMN: DETAILS --- */}
      <div className="lg:col-span-5 relative">
        <div className="lg:sticky lg:top-28 flex flex-col gap-6">
          {activePromo && (
            <div className="bg-[var(--v2-accent,#2EE66A)]/10 text-[var(--v2-accent,#2EE66A)] border border-[var(--v2-accent,#2EE66A)]/30 p-4 rounded-2xl flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider">
                {activePromo.name || "Special Offer"}
              </span>
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-[var(--v2-accent,#2EE66A)]">
                Limited Time
              </span>
            </div>
          )}

          <header>
            <span className="v2-section-label text-[10px] mb-1 block">
              {item.brand?.replace("-", " ")}
            </span>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] leading-tight m-0 mb-4">
              {item.name}
            </h1>

            <div className="flex items-baseline gap-4 flex-wrap mb-6">
              <span className="text-3xl font-black text-[var(--v2-accent,#2EE66A)]">
                LKR {discountedPrice.toLocaleString()}
              </span>

              {hasAnyDiscount && originalPrice > discountedPrice && (
                <span className="text-sm text-[var(--v2-text-muted,#666666)] line-through">
                  LKR {originalPrice.toLocaleString()}
                </span>
              )}

              {hasAnyDiscount && totalSavings > 0 && (
                <span className="bg-[var(--v2-accent,#2EE66A)]/10 text-[var(--v2-accent,#2EE66A)] border border-[var(--v2-accent,#2EE66A)]/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Save LKR {totalSavings.toLocaleString()}
                </span>
              )}

              {selectedSize && (
                <StockBadge stockCount={availableStock} className="mt-1" />
              )}
            </div>

            {/* Delivery Ticker */}
            <div className="flex items-center gap-6 border-y border-[var(--v2-glass-border,rgba(255,255,255,0.08))] py-3.5 text-xs font-bold uppercase tracking-wider text-[var(--v2-text-secondary,#A0A0A0)]">
              <div className="flex items-center gap-2">
                <FaTruckFast className="text-[var(--v2-accent,#2EE66A)]" size={16} />
                <span>Standard Delivery 2-3 Days</span>
              </div>
              <div className="flex items-center gap-2">
                <FaArrowRotateLeft className="text-[var(--v2-accent,#2EE66A)]" size={16} />
                <span>7-Day Exchange</span>
              </div>
            </div>
          </header>

          {/* Color Selection */}
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[var(--v2-text-primary,#F5F5F5)] block mb-3">
              Select Color
            </span>
            <div className="flex flex-wrap gap-2.5">
              {item.variants.map((v) => {
                const variantPromo = getVariantPromotion(v.variantId);
                const variantTotalStock = allVariantStock[v.variantId];
                const isVariantOutOfStock =
                  variantTotalStock !== undefined && variantTotalStock <= 0;

                return (
                  <button
                    type="button"
                    key={v.variantId}
                    onClick={() => {
                      setSelectedVariant(v);
                      setSelectedSize("");
                    }}
                    className={`relative w-14 h-14 bg-[#0A0A0A] rounded-2xl overflow-hidden border p-0.5 transition-all cursor-pointer ${
                      selectedVariant.variantId === v.variantId
                        ? "border-[var(--v2-accent,#2EE66A)] ring-2 ring-[var(--v2-accent,#2EE66A)]/30"
                        : "border-[var(--v2-glass-border,rgba(255,255,255,0.1))] opacity-60 hover:opacity-100"
                    } ${isVariantOutOfStock ? "opacity-40" : ""}`}
                    title={v.variantName}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={v.images[0].url}
                        alt={v.variantName}
                        fill
                        className="object-cover rounded-xl"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black uppercase tracking-widest text-[var(--v2-text-primary,#F5F5F5)]">
                Select Size
              </span>
              <button
                type="button"
                onClick={() => setShowSizeGuide(true)}
                className="text-xs text-[var(--v2-accent,#2EE66A)] font-bold uppercase tracking-wider underline border-none bg-transparent cursor-pointer p-0"
              >
                Size Guide
              </button>
            </div>
            <SizeGrid
              sizes={selectedVariant.sizes}
              selectedSize={selectedSize}
              onSelectSize={setSelectedSize}
              stockMap={sizeStock}
              stockLoading={stockLoading}
            />
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-[var(--v2-text-primary,#F5F5F5)]">
                Quantity
              </span>
              <div className="flex items-center gap-3 bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] rounded-full px-3 py-1">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={qty <= 1}
                  className="text-[var(--v2-text-primary,#F5F5F5)] hover:text-[var(--v2-accent,#2EE66A)] bg-transparent border-none cursor-pointer p-1"
                >
                  <IoRemoveOutline size={16} />
                </button>
                <span className="text-sm font-black text-[var(--v2-text-primary,#F5F5F5)] px-2">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(Math.min(10, qty + 1))}
                  disabled={qty >= 10}
                  className="text-[var(--v2-text-primary,#F5F5F5)] hover:text-[var(--v2-accent,#2EE66A)] bg-transparent border-none cursor-pointer p-1"
                >
                  <IoAddOutline size={16} />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleAddToBag}
                disabled={
                  !item.inStock ||
                  !selectedSize ||
                  availableStock === 0 ||
                  isLimitReached
                }
                className={`flex-1 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all border-none cursor-pointer shadow-lg ${
                  !item.inStock || (selectedSize && availableStock === 0) || isLimitReached
                    ? "bg-rose-500/20 text-rose-400 cursor-not-allowed"
                    : !selectedSize
                    ? "bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] text-[var(--v2-text-muted,#666666)] cursor-not-allowed border border-[var(--v2-glass-border,rgba(255,255,255,0.1))]"
                    : "bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] hover:opacity-90 active:scale-95"
                }`}
              >
                {!item.inStock || (availableStock === 0 && selectedSize)
                  ? "Sold Out"
                  : isLimitReached
                  ? "Inventory Maxed"
                  : !selectedSize
                  ? "Select Size to Add"
                  : "Add to Bag"}
              </button>

              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                  isInWishlist
                    ? "bg-[var(--v2-accent,#2EE66A)] border-[var(--v2-accent,#2EE66A)] text-[#0A0A0A]"
                    : "bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] hover:border-[var(--v2-accent,#2EE66A)]"
                }`}
              >
                {isInWishlist ? <IoHeart size={22} /> : <IoHeartOutline size={22} />}
              </button>
            </div>

            {/* Koko Payment Banner */}
            <div className="flex items-center justify-center gap-2 p-3 bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] rounded-2xl">
              <span className="text-[11px] font-bold text-[var(--v2-text-secondary,#A0A0A0)] uppercase tracking-wider">
                Or 3 interest-free payments of LKR {(discountedPrice / 3).toFixed(0)} with
              </span>
              <Image src={KOKOLogo} alt="KOKO" width={45} height={16} className="object-contain" />
            </div>
          </div>

          {/* Share & Support */}
          <div className="pt-4 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))] flex items-center justify-between text-xs font-bold uppercase tracking-wider">
            <ShareButtons
              title={item.name}
              url={`/collections/products/${item.id}`}
            />
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-[var(--v2-text-secondary,#A0A0A0)] hover:text-[var(--v2-accent,#2EE66A)] transition-colors"
            >
              <FaWhatsapp size={16} className="text-[var(--v2-accent,#2EE66A)]" />
              <span>Chat with Specialist</span>
            </a>
          </div>
        </div>
      </div>

      {/* Description */}
      {item.description && (
        <div className="lg:col-span-12 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))] pt-8 mt-6">
          <span className="v2-section-label text-[10px] mb-2 block">DETAILS &amp; SPECS</span>
          <h3 className="text-xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] mb-4 m-0">
            About This Product
          </h3>
          <div className="text-sm text-[var(--v2-text-secondary,#A0A0A0)] leading-relaxed space-y-3">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                p: ({ children }) => (
                  <p className="mb-3 text-sm text-[var(--v2-text-secondary,#A0A0A0)] leading-relaxed m-0">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-[var(--v2-text-primary,#F5F5F5)]">
                    {children}
                  </strong>
                ),
                li: ({ children }) => (
                  <li className="flex items-start gap-2 text-sm text-[var(--v2-text-secondary,#A0A0A0)]">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--v2-accent,#2EE66A)] shrink-0" />
                    <span>{children}</span>
                  </li>
                ),
              }}
            >
              {item.description}
            </ReactMarkdown>
          </div>
        </div>
      )}

      <SizeGuideDialog
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
      />
    </section>
  );
};

export default ProductHero;
