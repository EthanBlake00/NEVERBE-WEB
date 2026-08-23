"use client";
import React, { useEffect, useState } from "react";
import { Rate, Skeleton } from "antd";
import axiosInstance from "@/actions/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import { FcGoogle } from "react-icons/fc";
import ReviewForm from "@/components/ReviewForm";
import { Product } from "@/interfaces/Product";
import { IoCreateOutline } from "react-icons/io5";

interface Review {
  reviewId: string;
  userName: string;
  rating: number;
  review: string;
  source?: "GOOGLE" | "WEB";
  createdAt: string;
}

interface ProductReviewsProps {
  product: Product;
}

const ProductReviews = ({ product }: ProductReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.authSlice);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/web/reviews?itemId=${product.id}&limit=20`);
      setReviews(res.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product.id]);

  const handleWriteReview = () => {
    if (!user) {
      toast.error("Please login to write a review");
      window.location.href = "/account/login";
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-20 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <span className="v2-section-label text-[10px] mb-1 block">VERIFIED FEEDBACK</span>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <Rate
              disabled
              allowHalf
              defaultValue={4.5}
              style={{ color: "var(--v2-accent, #2EE66A)", fontSize: 14 }}
            />
            <span className="text-xs font-black uppercase tracking-wider text-[var(--v2-text-secondary,#A0A0A0)]">
              {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
            </span>
          </div>
        </div>

        <button
          onClick={handleWriteReview}
          className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all border-none cursor-pointer shadow-lg w-full md:w-auto"
        >
          <IoCreateOutline size={18} />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Floating reviews container (no dashed box wrapper) */}
      <div className="w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 v2-glass rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
                <Skeleton active avatar paragraph={{ rows: 2 }} />
              </div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.reviewId}
                className="p-6 v2-glass rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] hover:border-[var(--v2-accent,#2EE66A)]/30 transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] font-black uppercase flex items-center justify-center text-xs shrink-0">
                    {review.userName?.[0] || "U"}
                  </div>
                  <div>
                    <span className="block text-sm font-black text-[var(--v2-text-primary,#F5F5F5)] m-0 leading-tight flex items-center gap-2">
                      {review.userName}
                      {review.source === "GOOGLE" && (
                        <FcGoogle size={14} />
                      )}
                    </span>
                    <span className="text-[10px] text-[var(--v2-text-muted,#666666)] uppercase tracking-wider font-extrabold block mt-0.5">
                      {review.source === "GOOGLE" ? "Verified Google Review" : formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <Rate disabled defaultValue={review.rating} style={{ color: "var(--v2-accent,#2EE66A)", fontSize: 12 }} className="mb-3 block" />
                <p className="text-xs text-[var(--v2-text-secondary,#A0A0A0)] leading-relaxed font-medium italic m-0">
                  "{review.review}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-sm font-bold text-[var(--v2-text-secondary,#A0A0A0)] uppercase tracking-wider mb-3 m-0">
              Be the first to review this product!
            </p>
            <button
              onClick={handleWriteReview}
              className="text-xs font-black uppercase tracking-widest text-[var(--v2-accent,#2EE66A)] hover:underline border-none bg-transparent cursor-pointer p-0"
            >
              Submit your experience &rarr;
            </button>
          </div>
        )}
      </div>

      <ReviewForm
        open={isModalOpen}
        productId={product.id}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          fetchReviews();
        }}
      />
    </div>
  );
};

export default ProductReviews;
