"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  hydrateWishlist,
  removeFromWishlist,
} from "@/redux/wishlistSlice/wishlistSlice";
import Link from "next/link";
import Image from "next/image";
import { IoHeartDislike, IoTrashOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { Row, Col } from "antd";

const WishlistPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  useEffect(() => {
    dispatch(hydrateWishlist());
  }, [dispatch]);

  const handleRemove = (productId: string, variantId: string) => {
    dispatch(removeFromWishlist({ productId, variantId }));
  };

  return (
    <main className="w-full min-h-screen bg-[var(--v2-bg-surface,#141414)] text-[var(--v2-text-primary,#F5F5F5)] pt-28 pb-20">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mb-10">
        <span className="v2-section-label mb-2">SAVED FAVORITES</span>
        <h1 className="v2-section-title text-[clamp(2.5rem,6vw,4.5rem)] font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] mb-2">
          Your Wishlist
        </h1>
        <p className="text-[15px] font-medium text-[var(--v2-text-secondary,#A0A0A0)] m-0">
          {wishlistItems.length > 0
            ? `${wishlistItems.length} saved ${
                wishlistItems.length === 1 ? "item" : "items"
              }`
            : "Save your favorites to shop later."}
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {wishlistItems.length === 0 ? (
          /* Empty State */
          <div className="py-12 md:py-20 text-center max-w-xl mx-auto flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] text-[var(--v2-accent,#2EE66A)] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] flex items-center justify-center mx-auto mb-6">
              <IoHeartDislike size={36} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black uppercase text-[var(--v2-text-primary,#F5F5F5)] mb-2">
              Your Wishlist Is Empty
            </h2>
            <p className="text-xs md:text-sm font-medium text-[var(--v2-text-secondary,#A0A0A0)] mb-8 m-0 max-w-sm">
              Browse our collection and save your favorite items.
            </p>
            <Link
              href="/collections/products"
              className="inline-block px-8 py-3.5 rounded-full bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] font-black uppercase tracking-widest text-xs shadow-lg hover:opacity-90 transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <Row gutter={[16, 24]}>
            <AnimatePresence>
              {wishlistItems.map((item) => (
                <Col
                  key={`${item.productId}-${item.variantId}`}
                  xs={12}
                  md={8}
                  lg={6}
                >
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="v2-glass rounded-3xl p-3 border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] hover:border-[var(--v2-accent,#2EE66A)] transition-all group relative flex flex-col justify-between h-full"
                  >
                    <div>
                      {/* Image Container */}
                      <Link href={`/collections/products/${item.productId}`}>
                        <div className="relative aspect-square bg-[#0A0A0A] overflow-hidden rounded-2xl mb-3">
                          <Image
                            src={item.thumbnail}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="px-1 mb-4">
                        <span className="text-[9px] font-black uppercase tracking-wider text-[var(--v2-text-muted,#666666)] block mb-1">
                          {item.variantName || "STANDARD EDITION"}
                        </span>
                        <Link href={`/collections/products/${item.productId}`}>
                          <h3 className="text-xs font-black text-[var(--v2-text-primary,#F5F5F5)] uppercase tracking-tight line-clamp-2 hover:text-[var(--v2-accent,#2EE66A)] transition-colors m-0 mb-2">
                            {item.name}
                          </h3>
                        </Link>
                        <span className="text-xs font-black text-[var(--v2-accent,#2EE66A)]">
                          LKR {item.price?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
                      <Link
                        href={`/collections/products/${item.productId}`}
                        className="flex-1 py-2.5 rounded-full bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] font-black uppercase tracking-wider text-[10px] text-center hover:opacity-90 transition-all"
                      >
                        View Product
                      </Link>
                      <button
                        onClick={() => handleRemove(item.productId, item.variantId)}
                        className="w-9 h-9 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] hover:bg-rose-500/20 text-[var(--v2-text-muted,#666666)] hover:text-rose-400 border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] flex items-center justify-center transition-all cursor-pointer"
                        aria-label="Remove item"
                      >
                        <IoTrashOutline size={16} />
                      </button>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </AnimatePresence>
          </Row>
        )}
      </div>
    </main>
  );
};

export default WishlistPage;
