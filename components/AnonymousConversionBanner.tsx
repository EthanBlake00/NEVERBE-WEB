"use client";
import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { User } from "lucide-react";

const AnonymousConversionBanner: React.FC = () => {
  const user = useSelector((state: RootState) => state.authSlice.user);

  if (user && !user.isAnonymous) return null;

  return (
    <div className="bg-[var(--v2-bg-surface,#141414)] text-[var(--v2-text-primary,#F5F5F5)] px-4 py-3 border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))] flex items-center justify-center transition-all">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 max-w-[1400px] w-full justify-center">
        <div className="flex items-center gap-2">
          <User size={14} className="text-[var(--v2-accent,#2EE66A)]" />
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--v2-text-secondary,#A0A0A0)] m-0">
            Shopping as guest?{" "}
            <span className="text-[var(--v2-text-primary,#F5F5F5)] font-black">
              Sign in to save orders &amp; wishlist.
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest">
          <Link
            href="/account/register?redirect=/checkout"
            className="text-[var(--v2-accent,#2EE66A)] hover:underline transition-colors"
          >
            Create Account
          </Link>
          <span className="text-[var(--v2-text-muted,#666666)]">|</span>
          <Link
            href="/account/login?redirect=/checkout"
            className="text-[var(--v2-text-primary,#F5F5F5)] hover:text-[var(--v2-accent,#2EE66A)] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnonymousConversionBanner;
