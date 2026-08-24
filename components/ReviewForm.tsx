"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoStar, IoStarOutline, IoCloseOutline, IoCloudUploadOutline } from "react-icons/io5";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axiosInstance from "@/actions/axiosInstance";
import { auth } from "@/firebase/firebaseClient";
import toast from "react-hot-toast";

interface ReviewFormProps {
  productId?: string;
  initialValues?: {
    reviewId: string;
    rating: number;
    review: string;
  } | null;
  onSuccess: () => void;
  onCancel: () => void;
  open: boolean;
}

const ReviewForm = ({
  productId,
  initialValues,
  onSuccess,
  onCancel,
  open,
}: ReviewFormProps) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    if (initialValues) {
      setRating(initialValues.rating || 5);
      setReviewText(initialValues.review || "");
    } else {
      setRating(5);
      setReviewText("");
      setFiles([]);
    }
  }, [initialValues, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const validFiles = selectedFiles.filter((file) => {
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
          toast.error(`${file.name} is larger than 5MB!`);
        }
        return isLt5M;
      });
      setFiles((prev) => [...prev, ...validFiles].slice(0, 5));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    setLoading(true);
    try {
      if (!executeRecaptcha) {
        toast.error("reCAPTCHA not initialized");
        return;
      }

      const captchaToken = await executeRecaptcha("submit_review");
      const token = await auth.currentUser?.getIdToken();
      const formData = new FormData();

      const payload = {
        rating,
        review: reviewText,
        captchaToken,
        ...(productId && { itemId: productId }),
      };

      formData.append("data", JSON.stringify(payload));
      files.forEach((file) => {
        formData.append("images", file);
      });

      if (initialValues) {
        await axiosInstance.patch(
          `/web/reviews/${initialValues.reviewId}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Review updated successfully!");
      } else {
        await axiosInstance.post("/web/reviews", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Review submitted! It will appear once approved.");
      }

      onSuccess();
    } catch (error: any) {
      console.error("Failed to submit review", error);
      toast.error(error.response?.data?.error || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 v2-dialog-backdrop overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-lg bg-[var(--v2-bg-surface,#141414)] text-[var(--v2-text-primary,#F5F5F5)] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6 pb-4 border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
            <div>
              <span className="v2-section-label text-[9px] mb-1 block">
                SHARE YOUR EXPERIENCE
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0">
                {initialValues ? "Edit Review" : "Write a Review"}
              </h2>
            </div>
            <button
              onClick={onCancel}
              className="w-9 h-9 rounded-full bg-[var(--v2-accent,#2EE66A)] text-[var(--v2-accent-text,#0A0A0A)] border border-[var(--v2-accent,#2EE66A)] hover:opacity-90 flex items-center justify-center transition-all cursor-pointer shadow-md"
              aria-label="Close"
            >
              <IoCloseOutline size={20} className="text-[var(--v2-accent-text,#0A0A0A)]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Rating Stars */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[var(--v2-text-secondary,#A0A0A0)] mb-2">
                Your Rating *
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = star <= (hoverRating || rating);
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-2xl transition-transform hover:scale-110 cursor-pointer bg-transparent border-none focus:outline-none"
                    >
                      {active ? (
                        <IoStar className="text-[var(--v2-accent,#2EE66A)]" />
                      ) : (
                        <IoStarOutline className="text-[var(--v2-text-muted,#666666)]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Review Textarea */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[var(--v2-text-secondary,#A0A0A0)] mb-2">
                Your Review *
              </label>
              <textarea
                rows={4}
                required
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Describe your experience with this product..."
                className="w-full rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] p-4 text-xs font-medium placeholder:text-[var(--v2-text-muted,#666666)] outline-none focus:border-[var(--v2-accent,#2EE66A)] transition-colors resize-none"
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-[var(--v2-text-secondary,#A0A0A0)] mb-2">
                Upload Photos (Optional, Max 5MB)
              </label>
              <div className="flex flex-wrap gap-3 items-center">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="relative w-16 h-16 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] flex items-center justify-center overflow-hidden group"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="upload"
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <IoCloseOutline size={18} />
                    </button>
                  </div>
                ))}

                {files.length < 5 && (
                  <label className="w-16 h-16 rounded-2xl border-2 border-dashed border-[var(--v2-glass-border,rgba(255,255,255,0.15))] hover:border-[var(--v2-accent,#2EE66A)] flex flex-col items-center justify-center text-[var(--v2-text-secondary,#A0A0A0)] hover:text-[var(--v2-accent,#2EE66A)] transition-colors cursor-pointer p-1 text-center">
                    <IoCloudUploadOutline size={18} />
                    <span className="text-[8px] font-black uppercase mt-1">
                      Add Photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] font-black text-xs uppercase tracking-wider cursor-pointer hover:border-[var(--v2-accent,#2EE66A)] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-full bg-[var(--v2-accent,#2EE66A)] text-white dark:text-[#0A0A0A] font-black text-xs uppercase tracking-wider border-none cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-lg"
              >
                {loading
                  ? "Submitting..."
                  : initialValues
                  ? "Update Review"
                  : "Submit Review"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReviewForm;
