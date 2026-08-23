"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck, CheckCircle2, ArrowUpRight } from "lucide-react";

interface Review {
  id: string;
  name: string;
  avatarBg: string;
  rating: number;
  product: string;
  text: string;
  location: string;
  date: string;
  verified: boolean;
}

const reviews: Review[] = [
  {
    id: "1",
    name: "Kasun Perera",
    avatarBg: "from-emerald-500 to-teal-700",
    rating: 5,
    product: "Jordan 4 Retro - Rice Wine Red",
    text: "Best sneakers I've ever bought in Sri Lanka! The build quality is 100% authentic and islandwide COD delivery arrived within 48 hours.",
    location: "Colombo",
    date: "2 days ago",
    verified: true,
  },
  {
    id: "2",
    name: "Amaya Silva",
    avatarBg: "from-purple-500 to-indigo-700",
    rating: 5,
    product: "Air Force 1 Low - Pure White",
    text: "Ordered 3 pairs for the family and all of them exceeded expectations. Sizing is spot on and customer service helped me pick the right fit!",
    location: "Kandy",
    date: "1 week ago",
    verified: true,
  },
  {
    id: "3",
    name: "Dinesh Rajapaksha",
    avatarBg: "from-blue-500 to-cyan-700",
    rating: 5,
    product: "Ankle Socks (5-Pack Black)",
    text: "Cash on delivery made it super convenient. Package arrived in perfect condition with double boxing. Will definitely order again!",
    location: "Galle",
    date: "2 weeks ago",
    verified: true,
  },
  {
    id: "4",
    name: "Sachini Fernando",
    avatarBg: "from-pink-500 to-rose-700",
    rating: 5,
    product: "Essential Oversized Hoodie",
    text: "Great quality activewear & clothing. Heavyweight cotton fabric feels extremely premium for gym sessions and daily street wear.",
    location: "Negombo",
    date: "3 weeks ago",
    verified: true,
  },
  {
    id: "5",
    name: "Tharindu Mendis",
    avatarBg: "from-amber-500 to-orange-700",
    rating: 5,
    product: "Yeezy Slide - Onyx Black",
    text: "Neverbe is my go-to store for streetwear in LK. Always on point with the freshest drops. Premium packaging and fast response on WhatsApp.",
    location: "Kurunegala",
    date: "1 month ago",
    verified: true,
  },
  {
    id: "6",
    name: "Nethmi Jayasinghe",
    avatarBg: "from-emerald-600 to-green-800",
    rating: 5,
    product: "Running Sneakers - Triple Black",
    text: "Amazing customer service! Had to exchange size and they handled the pickup and replacement island-wide within 3 days hassle-free.",
    location: "Gampaha",
    date: "1 month ago",
    verified: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function SocialProof() {
  return (
    <section className="bg-[var(--v2-bg-surface,#141414)] py-16 md:py-24 overflow-hidden border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))] text-[var(--v2-text-primary,#F5F5F5)]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="v2-section-label">WHAT CUSTOMERS SAY</span>
            <h2 className="v2-section-title text-[clamp(1.8rem,4vw,2.8rem)]">
              REAL REVIEWS
            </h2>
          </div>

          <a
            href="https://neverbe.lk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] hover:border-[var(--v2-accent,#2EE66A)] text-[12px] font-extrabold uppercase tracking-wider text-[var(--v2-text-primary,#F5F5F5)] transition-all group"
          >
            <span>View 500+ Google Reviews</span>
            <ArrowUpRight size={14} className="text-[var(--v2-accent,#2EE66A)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* HERO RATING OVERVIEW CARD */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
          {/* Left Column: Big Score */}
          <div className="md:col-span-5 p-6 md:p-8 rounded-[24px] bg-[var(--v2-bg-card,#181818)] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--v2-accent,#2EE66A)] opacity-5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl font-black font-display tracking-tight text-[var(--v2-text-primary,#F5F5F5)]">
                4.9
              </span>
              <div className="flex flex-col gap-1">
                <div className="flex gap-1 text-[var(--v2-accent,#2EE66A)]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" />
                  ))}
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--v2-text-muted,#666666)]">
                  Overall Rating
                </span>
              </div>
            </div>

            <p className="text-xs font-semibold text-[var(--v2-text-secondary,#A0A0A0)] leading-relaxed mb-4">
              Based on over 500+ verified customer purchases across Sri Lanka. 98.4% of buyers recommend Neverbe.
            </p>

            <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--v2-accent,#2EE66A)] uppercase tracking-wider pt-3 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
              <span className="w-2 h-2 rounded-full bg-[var(--v2-accent,#2EE66A)] animate-pulse" />
              <span>Google Verified Store • Islandwide Delivery</span>
            </div>
          </div>

          {/* Right Column: Rating Distribution Progress Bars */}
          <div className="md:col-span-7 p-6 md:p-8 rounded-[24px] bg-[var(--v2-bg-card,#181818)] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] flex flex-col justify-center gap-3">
            {[
              { stars: 5, pct: 94, count: "482" },
              { stars: 4, pct: 5, count: "26" },
              { stars: 3, pct: 1, count: "4" },
            ].map((row) => (
              <div key={row.stars} className="flex items-center gap-4">
                <span className="text-[12px] font-extrabold text-[var(--v2-text-secondary,#A0A0A0)] w-12 shrink-0">
                  {row.stars} Stars
                </span>
                <div className="flex-1 h-2 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.06))] overflow-hidden relative">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--v2-accent,#2EE66A)] to-emerald-400 transition-all duration-1000"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-[var(--v2-text-muted,#666666)] w-10 text-right shrink-0">
                  {row.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* REVIEWS GRID (Asymmetric Luxury Card Arrangement) */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              className="group relative flex flex-col justify-between p-6 rounded-[24px] bg-[var(--v2-bg-card,#181818)] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] hover:border-[var(--v2-accent,#2EE66A)] transition-all duration-400 hover:shadow-2xl"
            >
              <div>
                {/* USER AVATAR & VERIFIED BADGE */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${review.avatarBg} text-white font-extrabold text-xs flex items-center justify-center shadow-md`}>
                      {review.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h4 className="text-[13px] font-extrabold uppercase tracking-wide text-[var(--v2-text-primary,#F5F5F5)]">
                        {review.name}
                      </h4>
                      <span className="text-[11px] font-semibold text-[var(--v2-text-muted,#666666)]">
                        {review.location}
                      </span>
                    </div>
                  </div>

                  {review.verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-[var(--v2-accent,#2EE66A)] text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/20">
                      <CheckCircle2 size={12} />
                      Verified
                    </span>
                  )}
                </div>

                {/* PRODUCT PURCHASE TAG */}
                <div className="mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] text-[var(--v2-text-secondary,#A0A0A0)] inline-block">
                    {review.product}
                  </span>
                </div>

                {/* STAR RATING */}
                <div className="flex gap-1 text-[var(--v2-accent,#2EE66A)] mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>

                {/* REVIEW TEXT */}
                <p className="text-[13px] text-[var(--v2-text-secondary,#A0A0A0)] leading-relaxed mb-6 font-medium">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>

              {/* FOOTER DATE */}
              <div className="pt-3 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))] flex items-center justify-between text-[11px] font-bold text-[var(--v2-text-muted,#666666)]">
                <span>100% Recommended</span>
                <span>{review.date}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
