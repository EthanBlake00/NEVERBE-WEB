"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, Truck, ShieldCheck, RotateCcw } from "lucide-react";

import { Slide } from "@/interfaces/Slide";

interface HeroProps {
  slides?: Slide[];
}

export default function Hero({ slides = [] }: HeroProps) {
  const heroImage = slides.length > 0 ? slides[0].url : null;

  return (
    <section className="relative w-full min-h-[100vh] bg-[var(--v2-bg-void)] flex flex-col md:flex-row overflow-hidden text-[var(--v2-text-primary)]">
      {/* MOBILE IMAGE: Shows at the top on mobile, hidden on desktop */}
      <div className="md:hidden relative w-full h-[55vh] rounded-b-[32px] overflow-hidden">
        {heroImage ? (
          <Image
            src={heroImage}
            alt="Neverbe 2026 Collection"
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--v2-bg-void)] to-transparent opacity-80" />
      </div>

      {/* LEFT SIDE: Text Content */}
      <div className="w-full md:w-[45%] flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 md:h-[100vh] z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Accent Label */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--v2-accent)] animate-pulse" />
            <span className="text-[11px] uppercase tracking-widest text-[var(--v2-accent)] font-medium">
              New Collection 2026
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display font-black uppercase tracking-[-0.04em] leading-[0.95] text-[clamp(2.5rem,10vw,4rem)] md:text-[clamp(3rem,7vw,7rem)] text-[var(--v2-text-primary)] mb-6">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            >
              NEVER
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8, ease: "easeOut" }}
            >
              BE THE
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            >
              SAME
            </motion.span>
          </h1>

          {/* Body Text */}
          <motion.p
            className="text-[16px] text-[var(--v2-text-secondary)] max-w-[420px] leading-[1.6] mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8 }}
          >
            Premium sneakers, clothing & lifestyle essentials. Delivered island-wide across Sri Lanka.
          </motion.p>

          {/* Buttons */}
          <motion.div
            className="flex flex-row items-center gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Link href="/collections/products" className="v2-btn-accent">
              Shop Now
            </Link>
            <Link href="/collections/products" className="v2-btn-ghost hidden md:flex items-center justify-center">
              View Collections
            </Link>
          </motion.div>

          {/* Trust Pills */}
          <motion.div
            className="grid grid-cols-2 md:flex md:flex-row md:flex-wrap gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div className="v2-pill flex items-center gap-2">
              <Truck size={14} className="text-[var(--v2-text-secondary)]" />
              <span className="text-[13px] text-[var(--v2-text-primary)]">Free Delivery</span>
            </div>
            <div className="v2-pill flex items-center gap-2">
              <ShieldCheck size={14} className="text-[var(--v2-text-secondary)]" />
              <span className="text-[13px] text-[var(--v2-text-primary)]">Cash on Delivery</span>
            </div>
            <div className="v2-pill flex items-center gap-2">
              <RotateCcw size={14} className="text-[var(--v2-text-secondary)]" />
              <span className="text-[13px] text-[var(--v2-text-primary)]">Easy Returns</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: Hero Image (Desktop only) */}
      <div className="hidden md:flex w-[55%] h-[100vh] p-6 pl-0 justify-center items-center">
        <motion.div
          className="relative w-full h-full rounded-[32px] overflow-hidden border border-[var(--v2-glass-border)] shadow-2xl bg-[var(--v2-bg-surface)]"
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
        >
          <div className="w-full h-full relative overflow-hidden">
            {heroImage ? (
              <motion.div
                className="w-full h-full relative"
                animate={{ scale: [1, 1.04, 1] }}
                transition={{
                  duration: 8,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              >
                <Image
                  src={heroImage}
                  alt="Neverbe 2026 Collection"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-black" />
            )}
            {/* Dark bottom & side vignette overlay for smooth blending */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-black/20 pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* SCROLL INDICATOR — Floating Glass Pill Button */}
      <motion.button
        onClick={() =>
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
        }
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-30 items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#0A0A0A]/85 backdrop-blur-md border border-white/15 hover:border-[var(--v2-accent)] shadow-2xl transition-all group cursor-pointer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--v2-text-secondary)] group-hover:text-white transition-colors">
          Scroll to explore
        </span>
        <ChevronDown
          size={14}
          className="text-[var(--v2-accent)] v2-animate-scroll-hint group-hover:scale-110 transition-transform"
        />
      </motion.button>
    </section>
  );
}
