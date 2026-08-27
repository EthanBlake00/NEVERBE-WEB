"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  IoCubeOutline,
  IoSettingsOutline,
  IoTimeOutline,
  IoChevronForward,
  IoLocationOutline,
  IoHeartOutline,
} from "react-icons/io5";
import { Row, Col } from "antd";

interface UserProfile {
  name?: string;
  memberSince?: string | Date;
  isAnonymous?: boolean;
}

interface ProfileOverviewProps {
  user: UserProfile;
  setActiveTab: (tab: string) => void;
  ordersCount: number;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({
  user,
  setActiveTab,
  ordersCount,
}) => {
  const memberDate = React.useMemo(() => {
    return user?.memberSince
      ? new Date(user.memberSince).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })
      : user?.isAnonymous
        ? "Guest Session"
        : "New Member";
  }, [user?.memberSince]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))] pb-6">
        <span className="v2-section-label mb-1">DASHBOARD</span>
        <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0">
          Account Overview
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <IoTimeOutline className="text-[var(--v2-accent,#2EE66A)]" size={16} />
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--v2-text-secondary,#A0A0A0)]">
            {user?.isAnonymous ? (
              <span className="text-amber-400">Temporary Session</span>
            ) : (
              <>Member since <span className="text-[var(--v2-text-primary,#F5F5F5)] font-extrabold">{memberDate}</span></>
            )}
          </span>
        </div>
      </div>

      {/* Grid */}
      <Row gutter={[20, 20]}>
        {/* Orders Tile */}
        <Col xs={24} md={12}>
          <motion.div
            whileHover={{ y: -4 }}
            onClick={() => setActiveTab("orders")}
            className="v2-glass p-8 rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] hover:border-[var(--v2-accent,#2EE66A)] transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[240px]"
          >
            <div className="absolute top-0 right-0 p-6 text-[var(--v2-accent,#2EE66A)]/10 group-hover:scale-110 transition-transform">
              <IoCubeOutline size={120} />
            </div>

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[var(--v2-accent,#2EE66A)]/10 border border-[var(--v2-accent,#2EE66A)]/20 text-[var(--v2-accent,#2EE66A)] flex items-center justify-center mb-4">
                <IoCubeOutline size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] mb-2">
                Order History
              </h3>
              <p className="text-xs text-[var(--v2-text-secondary,#A0A0A0)] leading-relaxed m-0">
                View your past orders, invoice receipts &amp; active shipments.
              </p>
            </div>

            <div className="relative z-10 pt-6 flex items-center justify-between border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
              <span className="text-xs font-black uppercase tracking-widest text-[var(--v2-accent,#2EE66A)]">
                {ordersCount} {ordersCount === 1 ? "Order" : "Orders"} Placed
              </span>
              <div className="w-8 h-8 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] group-hover:bg-[var(--v2-accent,#2EE66A)] group-hover:!text-[var(--v2-accent-text)] flex items-center justify-center transition-all text-[var(--v2-text-primary,#F5F5F5)]">
                <IoChevronForward size={16} />
              </div>
            </div>
          </motion.div>
        </Col>

        {/* Addresses Tile */}
        <Col xs={24} md={12}>
          <motion.div
            whileHover={{ y: -4 }}
            onClick={() => setActiveTab("addresses")}
            className="v2-glass p-8 rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] hover:border-[var(--v2-accent,#2EE66A)] transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[240px]"
          >
            <div className="absolute top-0 right-0 p-6 text-[var(--v2-accent,#2EE66A)]/10 group-hover:scale-110 transition-transform">
              <IoLocationOutline size={120} />
            </div>

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[var(--v2-accent,#2EE66A)]/10 border border-[var(--v2-accent,#2EE66A)]/20 text-[var(--v2-accent,#2EE66A)] flex items-center justify-center mb-4">
                <IoLocationOutline size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] mb-2">
                Saved Addresses
              </h3>
              <p className="text-xs text-[var(--v2-text-secondary,#A0A0A0)] leading-relaxed m-0">
                Manage your delivery locations for fast 1-click checkout.
              </p>
            </div>

            <div className="relative z-10 pt-6 flex items-center justify-between border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
              <span className="text-xs font-black uppercase tracking-widest text-[var(--v2-accent,#2EE66A)]">
                Manage Destinations
              </span>
              <div className="w-8 h-8 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] group-hover:bg-[var(--v2-accent,#2EE66A)] group-hover:!text-[var(--v2-accent-text)] flex items-center justify-center transition-all text-[var(--v2-text-primary,#F5F5F5)]">
                <IoChevronForward size={16} />
              </div>
            </div>
          </motion.div>
        </Col>

        {/* Settings Tile */}
        <Col xs={24} md={12}>
          <motion.div
            whileHover={{ y: -4 }}
            onClick={() => setActiveTab("details")}
            className="v2-glass p-8 rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] hover:border-[var(--v2-accent,#2EE66A)] transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[240px]"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[var(--v2-accent,#2EE66A)]/10 border border-[var(--v2-accent,#2EE66A)]/20 text-[var(--v2-accent,#2EE66A)] flex items-center justify-center mb-4">
                <IoSettingsOutline size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] mb-2">
                Account Settings
              </h3>
              <p className="text-xs text-[var(--v2-text-secondary,#A0A0A0)] leading-relaxed m-0">
                Update personal details, phone number &amp; security password.
              </p>
            </div>

            <div className="relative z-10 pt-6 flex items-center justify-between border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
              <span className="text-xs font-black uppercase tracking-widest text-[var(--v2-accent,#2EE66A)]">
                Security &amp; Profile
              </span>
              <div className="w-8 h-8 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] group-hover:bg-[var(--v2-accent,#2EE66A)] group-hover:!text-[var(--v2-accent-text)] flex items-center justify-center transition-all text-[var(--v2-text-primary,#F5F5F5)]">
                <IoChevronForward size={16} />
              </div>
            </div>
          </motion.div>
        </Col>

        {/* Wishlist Tile */}
        <Col xs={24} md={12}>
          <motion.div
            whileHover={{ y: -4 }}
            onClick={() => (window.location.href = "/account/wishlist")}
            className="v2-glass p-8 rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] hover:border-[var(--v2-accent,#2EE66A)] transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[240px]"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-[var(--v2-accent,#2EE66A)]/10 border border-[var(--v2-accent,#2EE66A)]/20 text-[var(--v2-accent,#2EE66A)] flex items-center justify-center mb-4">
                <IoHeartOutline size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] mb-2">
                My Wishlist
              </h3>
              <p className="text-xs text-[var(--v2-text-secondary,#A0A0A0)] leading-relaxed m-0">
                View your saved favorite sneakers and clothing items.
              </p>
            </div>

            <div className="relative z-10 pt-6 flex items-center justify-between border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
              <span className="text-xs font-black uppercase tracking-widest text-[var(--v2-accent,#2EE66A)]">
                Saved Items
              </span>
              <div className="w-8 h-8 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] group-hover:bg-[var(--v2-accent,#2EE66A)] group-hover:!text-[var(--v2-accent-text)] flex items-center justify-center transition-all text-[var(--v2-text-primary,#F5F5F5)]">
                <IoChevronForward size={16} />
              </div>
            </div>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileOverview;
