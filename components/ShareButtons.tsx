"use client";
import React from "react";
import { IoLogoWhatsapp } from "react-icons/io5";
import { FaFacebookF, FaLink } from "react-icons/fa";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Button } from "antd";

interface ShareButtonsProps {
  title: string;
  url: string;
  image?: string;
  className?: string;
}

/**
 * ShareButtons - NEVERBE Brand Style
 * Optimized for the Sri Lankan market with a performance-driven UI.
 */
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
      toast.success("Blueprint link copied!", {
        style: {
          background: "var(--color-primary)",
          color: "var(--color-accent)",
          fontWeight: "bold",
          fontSize: "12px",
          textTransform: "uppercase",
        },
      });
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className={`flex flex-col gap-3 ${className} animate-fade`}>
      {/* Performance Label */}
      <span className="text-[10px] font-display font-black uppercase tracking-[0.2em] text-muted">
        Share the Gear
      </span>

      <div className="flex items-center gap-3">
        <Button
          type="text"
          shape="circle"
          onClick={shareToWhatsApp}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-lg border border-primary hover:bg-white hover:text-primary-dark hover:shadow-primary/40 hover:-translate-y-1 transition-all active:scale-90 p-0"
          aria-label="Share on WhatsApp"
          icon={<IoLogoWhatsapp size={24} />}
        />

        {/* Facebook */}
        <Button
          type="text"
          shape="circle"
          onClick={shareToFacebook}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-lg border border-primary hover:bg-white hover:text-primary-dark hover:shadow-primary/40 hover:-translate-y-1 transition-all active:scale-90 p-0"
          aria-label="Share on Facebook"
          icon={<FaFacebookF size={20} />}
        />

        {/* Copy Link - Branded Performance Style */}
        <Button
          type="text"
          shape="circle"
          onClick={copyLink}
          className="group flex items-center justify-center w-12 h-12 rounded-full bg-surface-2 text-accent border border-accent/20 shadow-custom hover:bg-accent hover:text-primary-dark hover:shadow-hover hover:-translate-y-1 transition-all active:scale-90 p-0"
          aria-label="Copy link"
          icon={
            <FaLink
              size={18}
              className="group-hover:rotate-12 transition-transform"
            />
          }
        />
      </div>
    </div>
  );
};

export default ShareButtons;
