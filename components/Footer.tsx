"use client";
import Link from "next/link";
import {
  address,
  contactInfo,
  informationLinks,
  payHere,
  socialMedia,
} from "@/constants";
import Image from "next/image";
import { GoLocation } from "react-icons/go";
import { NavigationItem, SocialMediaItem } from "@/actions/websiteAction";
import { IoLogoFacebook, IoLogoInstagram } from "react-icons/io";
import { IoLogoTiktok, IoLogoYoutube, IoLogoTwitter } from "react-icons/io5";
import { IconType } from "react-icons";
import { Row, Col, Typography, Flex, Divider, Input, Button } from "antd";
import {
  SendOutlined,
  SafetyCertificateOutlined,
  CarOutlined,
  DollarCircleOutlined,
  ReloadOutlined,
  StarOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

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
      className="w-full rounded-none! border-x-0! border-b-0!"
      style={{
        background: "#f8faf5",
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      {/* Green gradient top separator */}
      <div className="green-separator" />

      <div
        className="max-w-content mx-auto px-6 lg:px-12"
        style={{ paddingTop: 64 }}
      >
        {/* --- Newsletter Section --- */}
        <div className="flex flex-col items-center gap-8 mb-16 text-center">
          <div className="flex flex-col items-center gap-2">
            <Text
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "var(--color-accent)",
              }}
            >
              Stay Updated
            </Text>
            <Title
              level={4}
              style={{
                margin: 0,
                color: "var(--color-primary-dark)",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
              }}
            >
              Get The Latest Drops
            </Title>
            <Text
              style={{
                color: "var(--color-primary-dark)",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Subscribe for exclusive offers and new arrivals
            </Text>
          </div>
          <div className="flex items-center w-full max-w-[500px] md:max-w-[600px] lg:max-w-[800px] bg-white rounded-full p-2 shadow-sm border border-default focus-within:border-accent focus-within:ring-1 focus-within:ring-accent transition-all">
            <Input
              placeholder="Enter your email address"
              variant="borderless"
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: "var(--color-primary-dark)",
                backgroundColor: "transparent",
              }}
              className="flex-1 px-4 placeholder:text-muted"
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              style={{
                background: "var(--color-accent)",
                border: "none",
                borderRadius: 99,
                fontWeight: 800,
                color: "#fff",
                height: 46,
                padding: "0 32px",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                fontSize: 13,
              }}
              className="hover:scale-105 transition-transform shadow-[0_4px_12px_rgba(46,158,91,0.2)]"
            >
              Subscribe
            </Button>
          </div>
        </div>

        <Divider
          style={{
            borderColor: "rgba(46, 158, 91, 0.15)",
            margin: "0 0 48px 0",
          }}
        />

        {/* --- Primary Navigation Grid --- */}
        <Row gutter={[32, 48]} className="mb-16">
          {/* Column 1: Brand & Key Utility */}
          <Col xs={24} md={12} lg={6}>
            <Flex vertical gap={24}>
              <Link
                href="/"
                className="inline-block transition-transform hover:scale-105"
              >
                <Image
                  src="/logo.png"
                  alt="Neverbe"
                  width={150}
                  height={50}
                  className="object-contain"
                />
              </Link>

              <Flex vertical gap={12}>
                <Title
                  level={5}
                  style={{
                    fontSize: 12,
                    fontWeight: 900,
                    margin: 0,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "var(--color-primary-dark)",
                  }}
                >
                  Store Location
                </Title>
                <Link
                  href={address.map}
                  target="_blank"
                  className="group flex items-start gap-3"
                >
                  <GoLocation
                    size={18}
                    className="mt-0.5 text-muted group-hover:text-accent transition-colors"
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--color-primary-dark)",
                      textTransform: "uppercase",
                      lineHeight: 1.6,
                      transition: "color 0.3s ease",
                    }}
                    className="group-hover:text-accent!"
                  >
                    {address.address}
                  </Text>
                </Link>
              </Flex>
            </Flex>
          </Col>

          {/* Column 2: Information Lists */}
          <Col xs={24} md={12} lg={6}>
            <Flex vertical gap={24}>
              <Title
                level={5}
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--color-primary-dark)",
                }}
              >
                Get Help
              </Title>
              <Flex vertical gap={14}>
                {helpLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.link}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--color-primary-dark)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      transition: "color 0.3s ease",
                    }}
                    className="hover:text-accent!"
                  >
                    {link.title}
                  </Link>
                ))}
              </Flex>
            </Flex>
          </Col>

          {/* Column 3: Contact Utility */}
          <Col xs={24} md={12} lg={6}>
            <Flex vertical gap={24}>
              <Title
                level={5}
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--color-primary-dark)",
                }}
              >
                Contact Us
              </Title>
              <Flex vertical gap={14}>
                {contactInfo.map((info, idx) => (
                  <Link
                    key={idx}
                    href={info.link}
                    target="_blank"
                    className="flex items-center gap-3 group"
                  >
                    <info.icon
                      size={16}
                      style={{
                        color: "var(--color-primary-dark)",
                        transition: "color 0.3s ease",
                      }}
                      className="group-hover:text-accent!"
                    />
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--color-primary-dark)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        transition: "color 0.3s ease",
                      }}
                      className="group-hover:text-accent!"
                    >
                      {info.content}
                    </Text>
                  </Link>
                ))}
              </Flex>
            </Flex>
          </Col>

          {/* Column 4: Social Icons */}
          <Col xs={24} md={12} lg={6}>
            <Flex vertical gap={24} className="lg:items-end">
              <Title
                level={5}
                className="lg:hidden"
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--color-primary-dark)",
                }}
              >
                Follow Us
              </Title>
              <Flex gap={12}>
                {socialLinksToRender.map((media, idx) => (
                  <Link
                    key={idx}
                    href={media.url}
                    target="_blank"
                    style={{
                      padding: 12,
                      borderRadius: 16,
                      background: "rgba(46, 158, 91, 0.08)",
                      border: "1px solid rgba(46, 158, 91, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      color: "var(--color-primary-dark)",
                    }}
                    className="hover:bg-accent! hover:text-inverse! hover:border-accent!"
                  >
                    <media.Icon size={20} />
                  </Link>
                ))}
              </Flex>
            </Flex>
          </Col>
        </Row>

        {/* --- Trust Badges Row --- */}
        <Divider
          style={{
            borderColor: "rgba(46, 158, 91, 0.15)",
            margin: "0 0 28px 0",
          }}
        />
        <Flex justify="center" gap={12} wrap style={{ marginBottom: 40 }}>
          {[
            { Icon: SafetyCertificateOutlined, label: "Secure Checkout" },
            { Icon: CarOutlined, label: "Island-wide Delivery" },
            { Icon: DollarCircleOutlined, label: "Cash on Delivery" },
            { Icon: ReloadOutlined, label: "Easy Returns" },
            { Icon: StarOutlined, label: "100% Quality Guaranteed" },
          ].map((badge) => (
            <span key={badge.label} className="trust-badge">
              <badge.Icon
                style={{ color: "var(--color-accent)", fontSize: 14 }}
              />
              {badge.label}
            </span>
          ))}
        </Flex>

        {/* --- Bottom Legal & Credits Row --- */}
        <Divider
          style={{
            borderColor: "rgba(46, 158, 91, 0.15)",
            margin: "0",
          }}
        />
        <Flex
          vertical
          justify="space-between"
          align="center"
          gap={32}
          className="lg:flex-row"
          style={{ padding: "24px 0" }}
        >
          <Flex vertical align="center" gap={24} className="md:flex-row">
            <Text
              style={{
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "var(--color-primary-dark)",
              }}
            >
              © {new Date().getFullYear()} Neverbe, Inc.
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "var(--color-primary-dark)",
              }}
            >
              | Developed by{" "}
              <a
                href="https://vx9studio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-colors underline"
              >
                VX9Studio
              </a>
            </Text>
          </Flex>

          <Flex
            vertical
            align="center"
            justify="center"
            gap={32}
            className="md:flex-row"
          >
            {/* Payment Partners */}
            <Link
              href={payHere.payHereLink}
              target="_blank"
              className="hover:opacity-80 transition-opacity duration-300"
            >
              <Image
                src={payHere.longWhiteBanner}
                width={180}
                height={40}
                alt="Secure Payments"
                className="object-contain h-5 w-auto"
              />
            </Link>

            {/* reCAPTCHA Disclaimer */}
            <Text
              style={{
                fontSize: 10,
                color: "var(--color-primary-dark)",
                textAlign: "center",
              }}
            >
              This site is protected by reCAPTCHA and the Google{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent transition-colors underline underline-offset-2"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noreferrer"
                className="hover:text-accent transition-colors underline underline-offset-2"
              >
                Terms of Service
              </a>{" "}
              apply.
            </Text>
          </Flex>
        </Flex>
      </div>
    </footer>
  );
};

export default Footer;
