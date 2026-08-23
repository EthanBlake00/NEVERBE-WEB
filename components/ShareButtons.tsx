"use client";
import React from "react";
import { IoLogoWhatsapp } from "react-icons/io5";
import { FaFacebookF, FaLink } from "react-icons/fa";
import toast from "react-hot-toast";

interface ShareButtonsProps {
  title: string;
  url: string;
  image?: string;
  className?: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({
  title,
  url,
  className = "",
}) => {
  const fullUrl =
    typeof window !== "undefined" ? window.location.origin + url : url;

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out ${title} on Neverbe!\n${fullUrl}`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareToFacebook = () => {
    const shareUrl = encodeURIComponent(fullUrl);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      "_blank",
      "width=600,height=400",
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-secondary,#A0A0A0)] mr-2">
        Share:
      </span>

      {/* WhatsApp */}
      <button
        type="button"
        onClick={shareToWhatsApp}
        className="w-9 h-9 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] hover:text-[#25D366] hover:border-[#25D366] flex items-center justify-center transition-all cursor-pointer"
        aria-label="Share on WhatsApp"
      >
        <IoLogoWhatsapp size={16} />
      </button>

      {/* Facebook */}
      <button
        type="button"
        onClick={shareToFacebook}
        className="w-9 h-9 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] hover:text-[#1877F2] hover:border-[#1877F2] flex items-center justify-center transition-all cursor-pointer"
        aria-label="Share on Facebook"
      >
        <FaFacebookF size={14} />
      </button>

      {/* Copy Link */}
      <button
        type="button"
        onClick={copyLink}
        className="w-9 h-9 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] hover:text-[var(--v2-accent,#2EE66A)] hover:border-[var(--v2-accent,#2EE66A)] flex items-center justify-center transition-all cursor-pointer"
        aria-label="Copy link"
      >
        <FaLink size={14} />
      </button>
    </div>
  );
};

export default ShareButtons;
