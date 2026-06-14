"use client";
import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";
import { socialMedia } from "@/constants";
import { Typography, Row, Col, Space } from "antd";

const { Title, Text } = Typography;

const SocialMediaSection = () => {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = encodeURIComponent(
    "Hello Neverbe, I’d like to get in touch.",
  );

  // Helper to map icons based on URL or logic
  const getIcon = (url: string) => {
    if (url.includes("facebook")) return <FaFacebookF size={18} />;
    if (url.includes("instagram")) return <FaInstagram size={18} />;
    if (url.includes("tiktok")) return <FaTiktok size={18} />;
    return null;
  };

  return (
    <section className="flex flex-col gap-8 mt-8 pt-8 border-t border-default">
      <Title
        level={2}
        style={{
          fontSize: "1.25rem",
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "-0.02em",
          margin: 0,
        }}
      >
        Follow Us
      </Title>

      <Row gutter={[16, 16]}>
        {/* WhatsApp - Primary Action */}
        <Col span={24}>
          <Link
            href={`https://wa.me/${whatsappNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-primary text-white px-6 py-4 hover:bg-primary-600 transition-all active:scale-[0.98]"
            style={{ width: "100%" }}
          >
            <FaWhatsapp size={20} />
            <Text
              style={{
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontSize: 12,
                color: "white",
              }}
            >
              Chat on WhatsApp
            </Text>
          </Link>
        </Col>

        {/* Social Grid */}
        {socialMedia.map((media, idx) => (
          <Col span={12} key={idx}>
            <Link
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 border border-default px-6 py-4 hover:border-primary hover:bg-surface-2 transition-all group"
              style={{ width: "100%", height: "100%" }}
            >
              <span className="text-muted group-hover:text-primary-dark transition-colors">
                {media.icon ? <media.icon size={18} /> : getIcon(media.url)}
              </span>
              <Text
                className="group-hover:text-primary-dark"
                style={{
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontSize: 12,
                  color: "var(--color-primary-300)",
                }}
              >
                {media.name}
              </Text>
            </Link>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default SocialMediaSection;
