"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

interface SizeGuideDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const menSizes = [
  { us: "7", uk: "6", eu: "40", cm: "25" },
  { us: "7.5", uk: "6.5", eu: "40.5", cm: "25.5" },
  { us: "8", uk: "7", eu: "41", cm: "26" },
  { us: "8.5", uk: "7.5", eu: "42", cm: "26.5" },
  { us: "9", uk: "8", eu: "42.5", cm: "27" },
  { us: "9.5", uk: "8.5", eu: "43", cm: "27.5" },
  { us: "10", uk: "9", eu: "44", cm: "28" },
  { us: "10.5", uk: "9.5", eu: "44.5", cm: "28.5" },
  { us: "11", uk: "10", eu: "45", cm: "29" },
  { us: "11.5", uk: "10.5", eu: "45.5", cm: "29.5" },
  { us: "12", uk: "11", eu: "46", cm: "30" },
];

const womenSizes = [
  { us: "5", uk: "2.5", eu: "35.5", cm: "22" },
  { us: "5.5", uk: "3", eu: "36", cm: "22.5" },
  { us: "6", uk: "3.5", eu: "36.5", cm: "23" },
  { us: "6.5", uk: "4", eu: "37.5", cm: "23.5" },
  { us: "7", uk: "4.5", eu: "38", cm: "24" },
  { us: "7.5", uk: "5", eu: "38.5", cm: "24.5" },
  { us: "8", uk: "5.5", eu: "39", cm: "25" },
  { us: "8.5", uk: "6", eu: "40", cm: "25.5" },
  { us: "9", uk: "6.5", eu: "40.5", cm: "26" },
  { us: "9.5", uk: "7", eu: "41", cm: "26.5" },
  { us: "10", uk: "7.5", eu: "42", cm: "27" },
];

const kidSizes = [
  { us: "10C", uk: "9.5", eu: "27", cm: "16" },
  { us: "11C", uk: "10.5", eu: "28", cm: "17" },
  { us: "12C", uk: "11.5", eu: "29.5", cm: "18" },
  { us: "13C", uk: "12.5", eu: "31", cm: "19" },
  { us: "1Y", uk: "13.5", eu: "32", cm: "20" },
  { us: "2Y", uk: "1.5", eu: "33.5", cm: "21" },
  { us: "3Y", uk: "2.5", eu: "35", cm: "22" },
  { us: "4Y", uk: "3.5", eu: "36", cm: "23" },
  { us: "5Y", uk: "4.5", eu: "37.5", cm: "23.5" },
  { us: "6Y", uk: "5.5", eu: "38.5", cm: "24" },
];

const SizeGuideDialog: React.FC<SizeGuideDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"men" | "women" | "kids">("men");

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 v2-dialog-backdrop"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative bg-[var(--v2-bg-surface,#141414)] text-[var(--v2-text-primary,#F5F5F5)] w-full max-w-2xl max-h-[85vh] rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] shadow-2xl overflow-hidden flex flex-col z-10 my-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))] shrink-0">
              <div className="flex flex-col">
                <span className="v2-section-label text-[9px] mb-0.5">SPECIFICATIONS</span>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0">
                  Size Guide &amp; Conversions
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-[var(--v2-accent,#2EE66A)] text-[var(--v2-accent-text,#0A0A0A)] border border-[var(--v2-accent,#2EE66A)] hover:opacity-90 flex items-center justify-center transition-all cursor-pointer shadow-md"
                aria-label="Close"
              >
                <IoClose className="text-[var(--v2-accent-text,#0A0A0A)]" size={20} />
              </button>
            </div>

            {/* Content Container */}
            <div className="p-6 overflow-y-auto hide-scrollbar">
              <p className="text-xs text-[var(--v2-text-secondary,#A0A0A0)] mb-6 font-medium leading-relaxed m-0">
                Ensure the perfect fit. If you are between sizes, we recommend ordering the next size up for optimal comfort.
              </p>

              {/* Tabs */}
              <div className="flex gap-4 mb-6 border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
                {(["men", "women", "kids"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-xs font-black uppercase tracking-widest transition-all relative border-none bg-transparent cursor-pointer ${
                      activeTab === tab
                        ? "text-[var(--v2-accent,#2EE66A)]"
                        : "text-[var(--v2-text-muted,#666666)] hover:text-[var(--v2-text-primary,#F5F5F5)]"
                    }`}
                  >
                    <span>{tab}</span>
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTabGuide"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--v2-accent,#2EE66A)]"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
                <table className="w-full text-xs text-left whitespace-nowrap border-collapse">
                  <thead className="bg-[#0A0A0A] text-[var(--v2-accent,#2EE66A)] border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
                    <tr>
                      <th className="px-5 py-3 font-black uppercase tracking-wider">US Size</th>
                      <th className="px-5 py-3 font-black uppercase tracking-wider">UK Size</th>
                      <th className="px-5 py-3 font-black uppercase tracking-wider">EU Size</th>
                      <th className="px-5 py-3 font-black uppercase tracking-wider">CM Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--v2-glass-border,rgba(255,255,255,0.06))]">
                    {(activeTab === "men"
                      ? menSizes
                      : activeTab === "women"
                      ? womenSizes
                      : kidSizes
                    ).map((row, idx) => (
                      <tr key={idx} className="hover:bg-[var(--v2-glass-bg,rgba(255,255,255,0.02))] transition-colors">
                        <td className="px-5 py-3 font-black text-[var(--v2-text-primary,#F5F5F5)]">{row.us}</td>
                        <td className="px-5 py-3 font-bold text-[var(--v2-text-secondary,#A0A0A0)]">{row.uk}</td>
                        <td className="px-5 py-3 font-bold text-[var(--v2-text-secondary,#A0A0A0)]">{row.eu}</td>
                        <td className="px-5 py-3 font-bold text-[var(--v2-text-secondary,#A0A0A0)]">{row.cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SizeGuideDialog;
