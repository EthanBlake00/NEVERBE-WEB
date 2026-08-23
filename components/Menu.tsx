"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IoChevronForward,
  IoPersonOutline,
  IoHeartOutline,
  IoCloseOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { Truck } from "lucide-react";
import { Drawer, Collapse } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { toggleMenu } from "@/redux/headerSlice/headerSlice";
import { NavigationItem } from "@/actions/websiteAction";
import { useFilterData } from "@/hooks/useFilterData";
import ThemeToggle from "@/components/ThemeToggle";

const DEFAULT_LINKS: NavigationItem[] = [
  { title: "Home", link: "/" },
  { title: "New Arrivals", link: "/collections/new-arrivals" },
  { title: "Men", link: "/collections/products?gender=men" },
  { title: "Women", link: "/collections/products?gender=women" },
  { title: "Combos", link: "/collections/combos" },
  { title: "Offers", link: "/collections/offers" },
];

export default function Menu({ mainNav = [] }: { mainNav?: NavigationItem[] }) {
  const dispatch: AppDispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.headerSlice.showMenu);

  const { brands, categories } = useFilterData(true);

  let displayLinks = mainNav.length > 0 ? mainNav : DEFAULT_LINKS;
  if (!displayLinks.some((l) => l.link === "/")) {
    displayLinks = [{ title: "Home", link: "/" }, ...displayLinks];
  }

  const handleClose = () => dispatch(toggleMenu(false));

  const collapseItems = [
    {
      key: "categories",
      label: (
        <span className="text-[18px] font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)]">
          Categories
        </span>
      ),
      children: (
        <div className="flex flex-col space-y-2.5 pl-3 border-l-2 border-[var(--v2-accent,#2EE66A)]">
          {categories.map((item) => (
            <Link
              key={item.id}
              href={`/collections/products?category=${encodeURIComponent(item.label.toLowerCase())}`}
              className="text-xs font-bold uppercase tracking-wider text-[var(--v2-text-secondary,#A0A0A0)] hover:text-[var(--v2-accent,#2EE66A)] transition-all hover:translate-x-1"
              onClick={handleClose}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ),
    },
    {
      key: "brands",
      label: (
        <span className="text-[18px] font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)]">
          Brands
        </span>
      ),
      children: (
        <div className="flex flex-col space-y-2.5 pl-3 border-l-2 border-[var(--v2-accent,#2EE66A)]">
          {brands.map((item) => (
            <Link
              key={item.id}
              href={`/collections/products?brand=${encodeURIComponent(item.label.toLowerCase())}`}
              className="text-xs font-bold uppercase tracking-wider text-[var(--v2-text-secondary,#A0A0A0)] hover:text-[var(--v2-accent,#2EE66A)] transition-all hover:translate-x-1"
              onClick={handleClose}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Drawer
      open={isOpen}
      onClose={handleClose}
      placement="right"
      width={360}
      styles={{
        header: { display: "none" },
        body: {
          background: "var(--v2-bg-surface, #141414)",
          color: "var(--v2-text-primary, #F5F5F5)",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
        mask: { backdropFilter: "blur(12px)", background: "rgba(0,0,0,0.6)" },
        content: {
          background: "var(--v2-bg-surface, #141414)",
          borderRadius: "28px 0 0 28px",
          overflow: "hidden",
          borderLeft: "1px solid var(--v2-glass-border, rgba(255,255,255,0.1))",
        },
      }}
    >
      <div className="flex flex-col h-full v2-landing">
        {/* DRAWER HEADER BAR */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))] bg-[var(--v2-bg-surface,#141414)]">
          <Link href="/" onClick={handleClose} className="shrink-0">
            <Image src="/logo.png" alt="Neverbe" width={64} height={32} className="object-contain" />
          </Link>
          <button
            onClick={handleClose}
            aria-label="Close menu"
            className="w-9 h-9 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.05))] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] hover:border-[var(--v2-accent,#2EE66A)] flex items-center justify-center transition-all cursor-pointer"
          >
            <IoCloseOutline size={20} />
          </button>
        </div>

        {/* QUICK ACTIONS BAR (Account, Wishlist, Theme Toggle) */}
        <div className="px-6 py-4 grid grid-cols-2 gap-3 border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))] bg-[var(--v2-bg-void,#0A0A0A)]">
          <Link
            href="/account"
            onClick={handleClose}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] hover:border-[var(--v2-accent,#2EE66A)] transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.08))] flex items-center justify-center text-[var(--v2-accent,#2EE66A)]">
              <IoPersonOutline size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--v2-text-muted,#666666)]">Profile</span>
              <span className="text-[11px] font-bold text-[var(--v2-text-primary,#F5F5F5)] group-hover:text-[var(--v2-accent,#2EE66A)]">Account</span>
            </div>
          </Link>

          <Link
            href="/account/wishlist"
            onClick={handleClose}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] hover:border-[var(--v2-accent,#2EE66A)] transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.08))] flex items-center justify-center text-[var(--v2-accent,#2EE66A)]">
              <IoHeartOutline size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--v2-text-muted,#666666)]">Saved</span>
              <span className="text-[11px] font-bold text-[var(--v2-text-primary,#F5F5F5)] group-hover:text-[var(--v2-accent,#2EE66A)]">Wishlist</span>
            </div>
          </Link>

          {/* Theme Switcher Banner in Drawer */}
          <div className="col-span-2 flex items-center justify-between p-3 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.06))] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))]">
            <span className="text-[11px] font-black uppercase tracking-wider text-[var(--v2-text-primary,#F5F5F5)]">
              Appearance Theme
            </span>
            <ThemeToggle />
          </div>
        </div>

        {/* MAIN NAVIGATION LINKS */}
        <nav className="flex-1 overflow-y-auto px-6 py-4 hide-scrollbar">
          <div className="flex flex-col">
            {displayLinks.map((link) => (
              <Link
                key={link.title}
                href={link.link}
                onClick={handleClose}
                className="flex items-center justify-between py-3.5 border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))] group"
              >
                <span className="text-[20px] font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] group-hover:text-[var(--v2-accent,#2EE66A)] group-hover:translate-x-1.5 transition-all">
                  {link.title}
                </span>
                <IoChevronForward
                  size={16}
                  className="text-[var(--v2-text-muted,#666666)] group-hover:text-[var(--v2-accent,#2EE66A)] transition-colors"
                />
              </Link>
            ))}

            {/* COLLAPSIBLE CATEGORIES & BRANDS */}
            <div className="mt-4">
              <Collapse
                ghost
                expandIconPosition="end"
                expandIcon={({ isActive }) => (
                  <RightOutlined
                    rotate={isActive ? 90 : 0}
                    className={`transition-all duration-300 text-[12px] ${
                      isActive ? "text-[var(--v2-accent,#2EE66A)]" : "text-[var(--v2-text-muted,#666666)]"
                    }`}
                  />
                )}
                items={collapseItems}
              />
            </div>
          </div>
        </nav>

        {/* DRAWER FOOTER */}
        <div className="px-6 py-5 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))] bg-[var(--v2-bg-void,#0A0A0A)] mt-auto">
          <div className="flex items-center gap-4 mb-3">
            <Link
              href="/contact"
              onClick={handleClose}
              className="text-[11px] font-black uppercase tracking-wider text-[var(--v2-text-primary,#F5F5F5)] hover:text-[var(--v2-accent,#2EE66A)] transition-colors"
            >
              Contact Us
            </Link>
            <span className="text-[var(--v2-text-muted,#666666)]">•</span>
            <Link
              href="/contact"
              onClick={handleClose}
              className="text-[11px] font-black uppercase tracking-wider text-[var(--v2-text-primary,#F5F5F5)] hover:text-[var(--v2-accent,#2EE66A)] transition-colors"
            >
              Help &amp; Support
            </Link>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-black text-[var(--v2-accent,#2EE66A)] uppercase tracking-widest">
            <Truck size={14} />
            <span>Island-wide Cash on Delivery</span>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
