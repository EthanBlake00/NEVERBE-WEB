"use client";

import React from "react";
import Link from "next/link";
import { address, contactInfo, informationLinks, payHere, socialMedia } from "@/constants";
import { KOKOLogo } from "@/assets/images";
import Image from "next/image";
import { GoLocation } from "react-icons/go";
import { NavigationItem, SocialMediaItem } from "@/actions/websiteAction";
import { IoLogoFacebook, IoLogoInstagram } from "react-icons/io";
import { IoLogoTiktok, IoLogoYoutube, IoLogoTwitter } from "react-icons/io5";
import { IconType } from "react-icons";
import { SendOutlined } from "@ant-design/icons";

const SOCIAL_ICON_MAP: Record<string, IconType> = {
  facebook: IoLogoFacebook,
  instagram: IoLogoInstagram,
  tiktok: IoLogoTiktok,
  youtube: IoLogoYoutube,
  twitter: IoLogoTwitter,
};

interface FooterProps {
  footerNav?: NavigationItem[];
  socialLinks?: SocialMediaItem[];
}

const Footer = ({ footerNav = [], socialLinks = [] }: FooterProps) => {
  const helpLinks =
    footerNav.length > 0
      ? footerNav
      : informationLinks.map((item) => ({ title: item.title, link: item.url }));

  const socialLinksToRender =
    socialLinks.length > 0
      ? socialLinks.map((item) => ({
          name: item.name,
          url: item.url,
          Icon: SOCIAL_ICON_MAP[item.name.toLowerCase()] || IoLogoFacebook,
        }))
      : socialMedia.map((item) => ({
          name: item.name,
          url: item.url,
          Icon: item.icon,
        }));

  return (
    <footer
      id="footer"
      className="w-full bg-[var(--v2-bg-void,#0A0A0A)] text-[var(--v2-text-primary,#F5F5F5)] relative overflow-hidden transition-colors duration-300 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))]"
    >
      {/* Top Green Accent Separator */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--v2-accent,#2EE66A)] to-transparent opacity-50" />

      {/* Main Footer Container */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-16 pb-12">
        {/* 1. NEWSLETTER / CLUB CARD */}
        <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] bg-[var(--v2-bg-surface,#141414)] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] p-5 sm:p-8 md:p-14 mb-16 shadow-2xl">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-[var(--v2-accent,#2EE66A)]/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 flex flex-col gap-2.5">
              <h3 className="font-display font-black text-2xl sm:text-3xl md:text-5xl uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0 leading-tight">
                STAY AHEAD OF THE DROP
              </h3>
              <p className="text-[13px] sm:text-[14px] text-[var(--v2-text-secondary,#A0A0A0)] m-0 max-w-md">
                Subscribe for exclusive releases, secret discounts &amp; early access to Sri Lanka&apos;s biggest shoe drops.
              </p>
            </div>

            {/* Right Input Form */}
            <div className="lg:col-span-6 w-full">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="w-full flex flex-col sm:flex-row items-center gap-2.5 p-2 bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] rounded-2xl sm:rounded-full focus-within:border-[var(--v2-accent,#2EE66A)] focus-within:ring-2 focus-within:ring-[var(--v2-accent,#2EE66A)]/20 transition-all"
              >
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full bg-transparent px-4 py-3 text-[13px] sm:text-[14px] text-[var(--v2-text-primary,#F5F5F5)] placeholder:text-[var(--v2-text-muted,#666666)] border-none outline-none font-medium text-center sm:text-left"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] font-extrabold text-[11px] sm:text-[12px] uppercase tracking-wider rounded-xl sm:rounded-full hover:bg-[#3AF07A] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[var(--v2-accent,#2EE66A)]/20 cursor-pointer"
                >
                  <span>Subscribe</span>
                  <SendOutlined />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 2. GIANT BRAND WATERMARK SIGNATURE */}
        <div className="w-full overflow-hidden my-4 select-none pointer-events-none">
          <p className="font-display font-black text-[clamp(4rem,17vw,14rem)] uppercase tracking-tighter text-[var(--v2-text-primary)] opacity-5 text-center leading-none m-0">
            NEVERBE
          </p>
        </div>

        {/* 3. FOUR-COLUMN NAVIGATION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 pt-4">
          {/* Col 1: Brand & Location */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-block shrink-0">
              <Image
                src="/logo.png"
                alt="Neverbe"
                width={140}
                height={45}
                className="object-contain"
              />
            </Link>
            <p className="text-[13px] text-[var(--v2-text-secondary,#A0A0A0)] leading-relaxed m-0">
              Sri Lanka&apos;s premier destination for high-end sneakers, streetwear, and activewear. Cash on delivery island-wide.
            </p>
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
              <GoLocation className="text-[var(--v2-accent,#2EE66A)] text-xl shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[var(--v2-text-primary,#F5F5F5)]">
                  FLAGSHIP STORE
                </span>
                <a
                  href={address.map}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[12px] text-[var(--v2-text-secondary,#A0A0A0)] hover:text-[var(--v2-accent,#2EE66A)] transition-colors leading-normal"
                >
                  {address.address}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[12px] font-extrabold uppercase tracking-widest text-[var(--v2-accent,#2EE66A)] m-0">
              COLLECTIONS
            </h4>
            <ul className="flex flex-col gap-2.5 p-0 m-0 list-none text-[13px] font-medium text-[var(--v2-text-secondary,#A0A0A0)]">
              <li>
                <Link href="/collections/new-arrivals" className="hover:text-[var(--v2-text-primary,#F5F5F5)] transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/collections/products" className="hover:text-[var(--v2-text-primary,#F5F5F5)] transition-colors">
                  Sneakers &amp; Shoes
                </Link>
              </li>
              <li>
                <Link href="/collections/combos" className="hover:text-[var(--v2-text-primary,#F5F5F5)] transition-colors">
                  Bundle Offers
                </Link>
              </li>
              <li>
                <Link href="/collections/offers" className="hover:text-[var(--v2-text-primary,#F5F5F5)] transition-colors">
                  Clearance Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[12px] font-extrabold uppercase tracking-widest text-[var(--v2-accent,#2EE66A)] m-0">
              CUSTOMER CARE
            </h4>
            <ul className="flex flex-col gap-2.5 p-0 m-0 list-none text-[13px] font-medium text-[var(--v2-text-secondary,#A0A0A0)]">
              {helpLinks.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.link} className="hover:text-[var(--v2-text-primary,#F5F5F5)] transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Social */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h4 className="text-[12px] font-extrabold uppercase tracking-widest text-[var(--v2-accent,#2EE66A)] m-0">
                GET IN TOUCH
              </h4>
              <div className="flex flex-col gap-2 text-[13px] text-[var(--v2-text-secondary,#A0A0A0)]">
                <a href={`mailto:${contactInfo.email}`} className="hover:text-[var(--v2-text-primary,#F5F5F5)] transition-colors">
                  {contactInfo.email}
                </a>
                <a href={`tel:${contactInfo.phone1}`} className="hover:text-[var(--v2-text-primary,#F5F5F5)] transition-colors font-mono">
                  {contactInfo.phone1}
                </a>
                <a href={`tel:${contactInfo.phone2}`} className="hover:text-[var(--v2-text-primary,#F5F5F5)] transition-colors font-mono">
                  {contactInfo.phone2}
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinksToRender.map((social, idx) => {
                const IconComponent = social.Icon;
                return (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    className="w-10 h-10 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] flex items-center justify-center text-[var(--v2-text-secondary,#A0A0A0)] hover:text-[#0A0A0A] hover:bg-[var(--v2-accent,#2EE66A)] hover:border-[var(--v2-accent,#2EE66A)] transition-all hover:scale-110"
                  >
                    <IconComponent size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. BOTTOM BAR & PAYMENTS */}
        <div className="pt-8 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[12px] text-[var(--v2-text-muted,#666666)] m-0 text-center md:text-left">
            &copy; {new Date().getFullYear()} Neverbe Sri Lanka. All rights reserved. Built for 2026.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
            <a
              href={payHere.payHereLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--v2-accent,#2EE66A)] transition-all group"
            >
              <Image
                src={payHere.longWhiteBanner}
                alt="PayHere Secured Payments"
                width={140}
                height={24}
                className="object-contain max-h-[22px] w-auto"
              />
            </a>

            <div className="flex items-center px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--v2-accent,#2EE66A)] transition-all">
              <Image
                src={KOKOLogo}
                alt="KOKO Pay in 3"
                width={60}
                height={24}
                className="object-contain max-h-[22px] w-auto"
              />
            </div>

            <div className="flex items-center px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--v2-accent,#2EE66A)] transition-all">
              <Image
                src="/cod_badge.svg"
                alt="Cash on Delivery"
                width={140}
                height={28}
                className="object-contain max-h-[28px] w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
