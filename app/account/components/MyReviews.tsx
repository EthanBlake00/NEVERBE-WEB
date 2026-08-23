"use client";

import React, { useEffect, useState } from "react";
import { Rate, Modal } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axiosInstance from "@/actions/axiosInstance";
import { auth } from "@/firebase/firebaseClient";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import ReviewForm from "@/components/ReviewForm";
import EmptyState from "@/components/EmptyState";
import { motion } from "framer-motion";

const { confirm } = Modal;

interface Review {
  reviewId: string;
  itemId: string;
  rating: number;
  review: string;
  status: string;
  createdAt: string;
}

const MyReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await axiosInstance.get("/web/customers/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(res.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = (reviewId: string) => {
    confirm({
      title: "Are you sure you want to delete this review?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const token = await auth.currentUser?.getIdToken();
          await axiosInstance.delete(`/web/reviews/${reviewId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          toast.success("Review deleted successfully");
          fetchReviews();
        } catch (error) {
          console.error("Failed to delete review", error);
          toast.error("Failed to delete review");
        }
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))] pb-6">
        <span className="v2-section-label mb-1">FEEDBACK</span>
        <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0">
          My Reviews &amp; Ratings
        </h2>
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          heading="No reviews submitted"
          subHeading="Once you purchase items and share your experience, your reviews will appear here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <motion.div
              key={r.reviewId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="v2-glass p-6 rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] hover:border-[var(--v2-accent,#2EE66A)] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <Rate disabled defaultValue={r.rating} style={{ fontSize: 14, color: "var(--v2-accent,#2EE66A)" }} />
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      r.status === "APPROVED"
                        ? "bg-[var(--v2-accent,#2EE66A)]/10 text-[var(--v2-accent,#2EE66A)] border border-[var(--v2-accent,#2EE66A)]/30"
                        : r.status === "PENDING"
                        ? "bg-amber-400/10 text-amber-400 border border-amber-400/30"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>

                <p className="text-xs text-[var(--v2-text-primary,#F5F5F5)] leading-relaxed m-0 mb-4 font-medium">
                  "{r.review}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.06))] text-[10px] font-extrabold uppercase tracking-widest text-[var(--v2-text-muted,#666666)]">
                <span>
                  {r.createdAt ? formatDistanceToNow(new Date(r.createdAt), { addSuffix: true }) : "Recently"}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setEditingReview(r);
                      setIsModalOpen(true);
                    }}
                    className="text-[var(--v2-text-secondary,#A0A0A0)] hover:text-[var(--v2-accent,#2EE66A)] transition-colors border-none bg-transparent cursor-pointer p-0"
                  >
                    <EditOutlined />
                  </button>
                  <button
                    onClick={() => handleDelete(r.reviewId)}
                    className="text-rose-400 hover:text-rose-300 transition-colors border-none bg-transparent cursor-pointer p-0"
                  >
                    <DeleteOutlined />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Review Modal */}
      <Modal
        title={
          <span className="font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)]">
            Edit Review
          </span>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingReview(null);
        }}
        footer={null}
        destroyOnClose
        centered
        className="v2-landing"
      >
        {editingReview && (
          <ReviewForm
            itemId={editingReview.itemId}
            existingReview={editingReview}
            onSuccess={() => {
              setIsModalOpen(false);
              setEditingReview(null);
              fetchReviews();
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default MyReviews;
