"use client";
import React from "react";
import { Typography, Row, Col, Space } from "antd";

const { Title, Paragraph, Text } = Typography;

const AboutUsClient = () => {
  return (
    <main className="w-full bg-surface text-primary-dark min-h-screen pt-8 md:pt-12">
      {/* 1. HERO MANIFESTO */}
      <section className="w-full px-4 md:px-8 mb-20">
        <div className="max-w-content mx-auto">
          <Title
            level={1}
            style={{
              fontSize: "clamp(3rem, 8vw, 6rem)",
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
              color: "var(--color-primary-dark)",
            }}
          >
            We Are <br /> Neverbe.
          </Title>
          <Paragraph
            style={{
              fontSize: "clamp(1rem, 2vw, 1.5rem)",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--color-primary-dark)",
            }}
          >
            Redefining sneaker culture in Sri Lanka. Premium quality. Unbeatable
            prices. No compromises.
          </Paragraph>
        </div>
      </section>

      {/* 2. THE STORY (Split Layout) */}
      <section className="w-full border-t border-strong px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-content mx-auto">
          <Row gutter={[48, 48]} justify="space-between">
            {/* Left: Headline */}
            <Col xs={24} md={8} lg={6}>
              <div className="sticky top-24 h-fit">
                <Title
                  level={2}
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "-0.02em",
                    marginBottom: 16,
                  }}
                >
                  The Mission
                </Title>
                <div
                  style={{
                    height: 8,
                    width: 80,
                    background: "var(--color-primary)",
                  }}
                ></div>
              </div>
            </Col>

            {/* Right: Content */}
            <Col xs={24} md={16} lg={14}>
              <Space direction="vertical" size={48} className="w-full">
                <div>
                  <Title
                    level={2}
                    className="mb-8"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "-0.02em",
                      color: "var(--color-primary-dark)",
                    }}
                  >
                    Who We Are
                  </Title>
                  <div className="max-w-3xl mx-auto space-y-6">
                    <p className="text-base md:text-lg text-primary-dark leading-relaxed">
                      Based in Sri Lanka, we recognized a gap in the market for
                      high-end, streetwear-inspired footwear that doesn't
                      compromise on quality. Our mission is simple: to provide
                      the local community with access to the global sneaker
                      culture through our carefully curated, masterpiece-quality
                      drops.
                    </p>
                    <p className="text-base md:text-lg text-primary-dark leading-relaxed">
                      At Neverbe, we don't just sell shoes; we curate a
                      lifestyle. We recognized a gap in the Sri Lankan market
                      for high-quality, trend-setting footwear that doesn't cost
                      a fortune. We bridge the gap between high-end streetwear
                      and affordability, offering Premium High-End shoes and
                      apparel that rival the originals in look, feel, and
                      durability.
                    </p>
                  </div>
                </div>

                <div>
                  <Title
                    level={3}
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: 16,
                      color: "var(--color-primary-dark)",
                    }}
                  >
                    Our Vision
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: "1rem",
                      lineHeight: 1.8,
                      fontWeight: 500,
                      color: "var(--color-primary-dark)",
                    }}
                  >
                    Our vision is to become the undisputed leader in the
                    alternative clothing and footwear market in Sri Lanka. We
                    operate with transparency, focusing on ethical customer
                    service and product quality. We believe style is a right,
                    not a luxury reserved for the few.
                  </Paragraph>
                </div>
              </Space>
            </Col>
          </Row>
        </div>
      </section>

      {/* 3. WHY US (Grid System) */}
      <section className="w-full bg-surface-2 px-4 md:px-8 py-20">
        <div className="max-w-content mx-auto">
          <Row gutter={[32, 48]}>
            {[
              {
                title: "Premium Quality",
                desc: "We stock only Premium High-End products. Heavy materials, correct stitching, and durable soles.",
              },
              {
                title: "Island-wide Delivery",
                desc: "From Colombo to Jaffna, we deliver to your doorstep safely and securely within 3-5 working days.",
              },
              {
                title: "Cash on Delivery",
                desc: "Shop with total confidence. Inspect your package upon arrival and pay only when you are satisfied.",
              },
              {
                title: "Dedicated Support",
                desc: "Our team is here to help with sizing, styling, and order tracking via WhatsApp and Email.",
              },
            ].map((item, i) => (
              <Col xs={24} sm={12} lg={6} key={i}>
                <div className="bg-surface-2 p-8 lg:p-12 border border-default hover:border-accent transition-colors">
                  <h3 className="text-xl font-display font-black uppercase tracking-tight text-primary-dark mb-4">
                    {item.title}
                  </h3>
                  <p className="text-sm text-primary-dark leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* 4. STATS STRIP */}
      <section className="w-full px-4 md:px-8 py-16 border-t border-default">
        <div className="max-w-content mx-auto">
          <Row gutter={[32, 32]} justify="space-between" align="middle">
            <Col xs={12} md={6}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "var(--color-primary-300)",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Established
              </Text>
              <Title
                level={2}
                style={{ fontSize: "2.5rem", fontWeight: 900, margin: 0 }}
              >
                2023
              </Title>
            </Col>
            <Col xs={12} md={6}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "var(--color-primary-300)",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Customers
              </Text>
              <Title
                level={2}
                style={{ fontSize: "2.5rem", fontWeight: 900, margin: 0 }}
              >
                5,000+
              </Title>
            </Col>
            <Col xs={12} md={6}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "var(--color-primary-300)",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Products
              </Text>
              <Title
                level={2}
                style={{ fontSize: "2.5rem", fontWeight: 900, margin: 0 }}
              >
                300+
              </Title>
            </Col>
            <Col xs={12} md={6}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "var(--color-primary-300)",
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Location
              </Text>
              <Title
                level={2}
                style={{ fontSize: "2.5rem", fontWeight: 900, margin: 0 }}
              >
                LK
              </Title>
            </Col>
          </Row>
        </div>
      </section>
    </main>
  );
};

export default AboutUsClient;
