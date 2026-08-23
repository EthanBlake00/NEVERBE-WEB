"use client";
import "@/app/globals.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[var(--v2-bg-surface,#141414)] text-[var(--v2-text-primary,#F5F5F5)] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Grid Effect */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--v2-accent,#2EE66A) 1px, transparent 1px), linear-gradient(90deg, var(--v2-accent,#2EE66A) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <main className="relative z-10 w-full max-w-content mx-auto flex flex-col items-center text-center">
        {/* Status Chip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 px-4 py-1.5 border border-[var(--v2-accent,#2EE66A)]/30 rounded-full bg-[var(--v2-accent,#2EE66A)]/5 flex items-center gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--v2-accent,#2EE66A)] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--v2-accent,#2EE66A)]">
            System Protocol 2026
          </span>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl sm:text-7xl md:text-[10rem] font-display font-black uppercase tracking-tighter leading-none mb-4 text-[var(--v2-accent,#2EE66A)] drop-shadow-xl"
        >
          Neverbe
        </motion.h1>

        {/* Loading Bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="w-full max-w-sm h-1.5 bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] overflow-hidden mb-10 -skew-x-12 border border-[var(--v2-glass-border,rgba(255,255,255,0.08))]"
        >
          <motion.div
            className="h-full bg-[var(--v2-accent,#2EE66A)] w-full origin-left shadow-md"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Status Text Block */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-4 max-w-lg"
        >
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0">
            System Upgrade In Progress
          </h2>
          <p className="text-[var(--v2-text-secondary,#A0A0A0)] font-medium text-xs md:text-sm leading-relaxed m-0">
            We are fine-tuning our engine to deliver a faster, more vibrant shopping experience. The store will be back online shortly. Stay tuned!
          </p>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10"
        >
          <a
            href="mailto:support@neverbe.lk"
            className="group relative flex items-center gap-3 px-8 py-3.5 bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-lg hover:opacity-90 active:scale-95"
          >
            <span>Contact Support</span>
            <FaArrowRightLong
              size={14}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </a>
        </motion.div>
      </main>

      {/* Footer Branded Legal */}
      <footer className="absolute bottom-8 w-full text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-px bg-[var(--v2-glass-border,rgba(255,255,255,0.08))]" />
          <p className="text-[10px] font-extrabold uppercase text-[var(--v2-text-muted,#666666)] tracking-[0.3em] m-0">
            &copy; {new Date().getFullYear()} Neverbe Sri Lanka
          </p>
        </div>
      </footer>
    </div>
  );
}
