"use client";
import React from "react";
import { ContactUs } from "@/constants";

const MapSection = () => {
  return (
    <section className="w-full h-full min-h-[400px] relative v2-glass rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] group overflow-hidden">
      {/* Label Overlay */}
      <div className="absolute top-6 left-6 z-10 v2-glass px-4 py-2 rounded-2xl border border-[var(--v2-glass-border,rgba(255,255,255,0.1))]">
        <h2 className="text-xs font-black uppercase tracking-widest text-[var(--v2-text-primary,#F5F5F5)] m-0">
          Store Location
        </h2>
      </div>

      <iframe
        src={ContactUs.embeddedMap}
        loading="eager"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-full grayscale invert opacity-70 group-hover:grayscale-0 group-hover:invert-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"
      ></iframe>
    </section>
  );
};

export default MapSection;
