"use client";
import "@/app/globals.css";
import { FaArrowRightLong } from "react-icons/fa6";
import { motion } from "framer-motion";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-dark text-inverse flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Performance Grid Effect */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-accent) 1px, transparent 1px), linear-gradient(90deg, var(--color-accent) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <main className="relative z-10 w-full max-w-content mx-auto flex flex-col items-center text-center">
        {/* Status Chip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 px-4 py-1.5 border border-accent/30 rounded-full bg-accent/5 flex items-center gap-2"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_8px_var(--color-accent)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">
            System Protocol 4.0
          </span>
        </motion.div>

        {/* Brand Name - Massive & Performance Styled */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-7xl md:text-[12rem] font-display font-black uppercase tracking-tighter leading-none mb-4 text-accent drop-shadow-[0_0_30px_rgba(46, 158, 91,0.2)]"
        >
          Neverbe
        </motion.h1>

        {/* Technical Loading Bar - Skewed Performance Style */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="w-full max-w-sm h-1.5 bg-surface-3 overflow-hidden mb-12 -skew-x-12 border border-white/5"
        >
          <motion.div
            className="h-full bg-accent w-full origin-left shadow-[0_0_15px_var(--color-accent)]"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        {/* Status Text Block */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-6 max-w-lg"
        >
          <h2 className="text-xl md:text-2xl font-display font-black uppercase tracking-tight text-inverse">
            Performance Upgrade In Progress
          </h2>
          <p className="text-muted font-medium text-sm md:text-base leading-relaxed">
            We are fine-tuning our digital engine to deliver a faster, more
            vibrant shopping experience. The store will be back online shortly.
            Stay locked.
          </p>
        </motion.div>

        {/* Action Button - Pill Style */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16"
        >
          <a
            href="mailto:support@neverbe.lk"
            className="group relative flex items-center gap-4 px-8 py-4 bg-accent text-primary-dark rounded-full font-display font-black uppercase tracking-widest text-xs transition-all hover:shadow-hover hover:scale-105 active:scale-95"
          >
            Contact Control
            <FaArrowRightLong
              size={16}
              className="group-hover:translate-x-2 transition-transform duration-300"
            />
          </a>
        </motion.div>
      </main>

      {/* Footer Branded Legal */}
      <footer className="absolute bottom-12 w-full text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-px bg-accent/20" />
          <p className="text-[10px] font-black uppercase text-muted tracking-[0.4em]">
            &copy; {new Date().getFullYear()} Neverbe Performance Clothing Labs
          </p>
        </div>
      </footer>
    </div>
  );
}
