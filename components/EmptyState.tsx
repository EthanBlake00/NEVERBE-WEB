"use client";
import React from "react";
import { IoBagHandleOutline } from "react-icons/io5";
import { Button } from "antd";

interface EmptyStateProps {
  heading: string;
  subHeading?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = ({
  heading,
  subHeading,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="flex w-full justify-center items-center py-12 md:py-20 px-4 animate-fade">
      <div className="flex flex-col items-center text-center max-w-md">
        {/* Icon Wrapper */}
        <div className="mb-6 p-6 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] text-[var(--v2-accent,#2EE66A)] relative group">
          <div className="absolute inset-0 bg-[var(--v2-accent,#2EE66A)]/10 rounded-full blur-xl group-hover:bg-[var(--v2-accent,#2EE66A)]/20 transition-all duration-500" />
          <IoBagHandleOutline
            size={48}
            className="relative z-10"
            strokeWidth={1.5}
          />
        </div>

        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] mb-3">
          {heading}
        </h2>

        {/* Subheading */}
        <p className="text-xs md:text-sm font-medium leading-relaxed text-[var(--v2-text-secondary,#A0A0A0)] mb-8 max-w-sm mx-auto m-0">
          {subHeading ||
            "We couldn't find any items matching your criteria. Try clearing your filters or check back later."}
        </p>

        {/* Action Button */}
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="px-8 py-3.5 bg-[var(--v2-accent,#2EE66A)] !text-[var(--v2-accent-text)] text-xs font-black uppercase tracking-widest rounded-full hover:opacity-90 active:scale-95 transition-all shadow-lg cursor-pointer"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
