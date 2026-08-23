"use client";
import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { socialMedia } from "@/constants";
import { Row, Col } from "antd";

const SocialMediaSection = () => {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = encodeURIComponent(
    "Hello Neverbe, I’d like to get in touch.",
  );

  const getIcon = (url: string) => {
    if (url.includes("facebook")) return <FaFacebookF size={18} />;
    if (url.includes("instagram")) return <FaInstagram size={18} />;
    if (url.includes("tiktok")) return <FaTiktok size={18} />;
    return null;
  };

  return (
    <section className="flex flex-col gap-6 mt-8 pt-8 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
      <h2 className="text-xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0">
        Follow Us
      </h2>

      <Row gutter={[16, 16]}>
        {/* WhatsApp */}
        <Col span={24}>
          <Link
            href={`https://wa.me/${whatsappNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] px-6 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:opacity-90 transition-all shadow-lg"
          >
            <FaWhatsapp size={20} />
            <span>Chat on WhatsApp</span>
          </Link>
        </Col>

        {/* Social Grid */}
        {socialMedia.map((media, idx) => (
          <Col span={12} key={idx}>
            <Link
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="v2-glass p-4 rounded-2xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] hover:border-[var(--v2-accent,#2EE66A)] flex items-center justify-center gap-3 group transition-all"
            >
              <span className="text-[var(--v2-text-secondary,#A0A0A0)] group-hover:text-[var(--v2-accent,#2EE66A)] transition-colors">
                {media.icon ? <media.icon size={18} /> : getIcon(media.url)}
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-[var(--v2-text-primary,#F5F5F5)] group-hover:text-[var(--v2-accent,#2EE66A)] transition-colors">
                {media.name}
              </span>
            </Link>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default SocialMediaSection;
