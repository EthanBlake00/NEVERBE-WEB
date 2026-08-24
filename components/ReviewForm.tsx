import React, { useState } from "react";
import { Form, Rate, Modal, Upload, UploadFile } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import axiosInstance from "@/actions/axiosInstance";
import { auth } from "@/firebase/firebaseClient";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";

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

const ReviewForm = ({ productId, initialValues, onSuccess, onCancel, open }: ReviewFormProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmit = async (values: any) => {
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
        rating: values.rating,
        review: values.review,
        captchaToken,
        ...(productId && { itemId: productId }),
      };

      formData.append("data", JSON.stringify(payload));
      
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      if (initialValues) {
        await axiosInstance.patch(`/web/reviews/${initialValues.reviewId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Review updated successfully!");
      } else {
        await axiosInstance.post("/web/reviews", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Review submitted! It will appear once approved.");
      }
      
      form.resetFields();
      onSuccess();
    } catch (error: any) {
      console.error("Failed to submit review", error);
      toast.error(error.response?.data?.error || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex flex-col gap-0.5 pt-1">
          <span className="v2-section-label text-[9px] mb-0.5">SHARE YOUR EXPERIENCE</span>
          <span className="text-xl font-black uppercase tracking-tight text-[var(--v2-text-primary)]">
            {initialValues ? "Edit Review" : "Write a Review"}
          </span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose
      centered
      closeIcon={<FiX size={20} className="text-[var(--v2-text-secondary)] hover:text-[var(--v2-text-primary)] transition-colors" />}
      styles={{
        content: {
          background: "var(--v2-bg-surface)",
          border: "1px solid var(--v2-glass-border)",
          borderRadius: "28px",
          padding: "28px",
          color: "var(--v2-text-primary)",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.4)",
        },
        header: {
          background: "transparent",
          borderBottom: "none",
          marginBottom: "16px",
          padding: 0,
        },
        body: {
          background: "transparent",
          padding: 0,
        },
        mask: {
          backdropFilter: "blur(16px)",
          background: "rgba(0, 0, 0, 0.7)",
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues || { rating: 5, review: "" }}
        className="mt-2"
      >
        <Form.Item
          name="rating"
          label={
            <span className="text-xs font-black uppercase tracking-widest text-[var(--v2-text-secondary)]">
              Your Rating *
            </span>
          }
          rules={[{ required: true, message: "Please provide a rating" }]}
        >
          <Rate style={{ color: "var(--v2-accent)", fontSize: "20px" }} />
        </Form.Item>

        <Form.Item
          name="review"
          label={
            <span className="text-xs font-black uppercase tracking-widest text-[var(--v2-text-secondary)]">
              Your Review *
            </span>
          }
          rules={[{ required: true, message: "Please write your review" }]}
        >
          <textarea
            rows={4}
            placeholder="Describe your experience with this product..."
            onChange={(e) => form.setFieldValue("review", e.target.value)}
            defaultValue={initialValues?.review || ""}
            className="w-full rounded-2xl bg-[var(--v2-glass-bg)] border border-[var(--v2-glass-border)] text-[var(--v2-text-primary)] p-4 text-xs font-medium placeholder:text-[var(--v2-text-muted)] outline-none focus:border-[var(--v2-accent)] transition-colors resize-none"
          />
        </Form.Item>

        <Form.Item 
          label={
            <span className="text-xs font-black uppercase tracking-widest text-[var(--v2-text-secondary)]">
              Upload Photos (Optional, Max 5MB)
            </span>
          }
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={() => {}}
            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
            beforeUpload={(file) => {
              const isLt5M = file.size / 1024 / 1024 < 5;
              if (!isLt5M) {
                toast.error("Image must be smaller than 5MB!");
                return Upload.LIST_IGNORE;
              }
              return false;
            }}
            maxCount={5}
          >
            {fileList.length < 5 && (
              <div className="text-[var(--v2-text-secondary)] flex flex-col items-center justify-center">
                <PlusOutlined />
                <div className="text-[10px] font-bold uppercase mt-1">Add Photo</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">
          <button 
            type="button"
            onClick={onCancel} 
            className="px-6 py-3.5 rounded-full bg-[var(--v2-glass-bg)] border border-[var(--v2-glass-border)] text-[var(--v2-text-primary)] font-black text-xs uppercase tracking-wider cursor-pointer hover:border-[var(--v2-accent)] transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-3.5 rounded-full bg-[var(--v2-accent)] text-[var(--v2-bg-void,#0A0A0A)] font-black text-xs uppercase tracking-wider border-none cursor-pointer hover:opacity-90 active:scale-95 transition-all shadow-lg"
          >
            {loading ? "Submitting..." : initialValues ? "Update Review" : "Submit Review"}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default ReviewForm;
