import React from "react";
import Link from "next/link";

const SEOContent = () => {
  const categories = [
    "Men's Sneakers",
    "Women's Running Shoes",
    "Sports Shoes",
    "Casual Slides",
    "High-Ankle Boots",
    "Gym Footwear",
    "Men's Clothing",
    "Women's Clothing",
    "Sports Apparel",
    "Activewear",
    "Accessories",
    "Socks & Undergarments",
  ];

  const searchLinks = [
    {
      label: "Running Shoes Sri Lanka",
      href: "/collections/running-shoes",
    },
    {
      label: "Men's Sandals & Slides",
      href: "/collections/slides-sandals",
    },
    {
      label: "Activewear & Gym Wear",
      href: "/collections/activewear",
    },
    { label: "Shoe Sale", href: "/collections/offers" },
    {
      label: "Best Sneakers 2026",
      href: "/collections/sneakers",
    },
    {
      label: "Sports Apparel",
      href: "/collections/sports-apparel",
    },
    {
      label: "Men's Clothing",
      href: "/collections/mens-clothing",
    },
    {
      label: "Boots",
      href: "/collections/boots",
    },
    {
      label: "Accessories",
      href: "/collections/accessories",
    },
  ];

  return (
    <div
      style={{
        padding: "48px 0",
      }}
    >
      <div className="max-w-content w-full mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT COLUMN: Main Keywords */}
          <div className="flex flex-col gap-4">
            <h2
              style={{
                fontWeight: 800,
                margin: 0,
                fontSize: 14,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--v2-text-primary, var(--color-primary-dark))",
              }}
            >
              Premium Fashion & Footwear in Sri Lanka
            </h2>
            <p
              style={{
                color: "var(--v2-text-secondary, var(--color-primary-dark))",
                fontSize: 12,
                marginBottom: 0,
                lineHeight: 1.8,
              }}
            >
              Neverbe is Sri Lanka&apos;s premier online destination to{" "}
              <strong style={{ color: "var(--v2-accent, inherit)" }}>
                buy shoes, clothing, and fashion accessories
              </strong>
              . We bridge the gap between high-end street culture and
              affordability, offering a curated selection of{" "}
              <strong style={{ color: "var(--v2-accent, inherit)" }}>
                sneakers, activewear, sports apparel, and casual footwear
              </strong>
              . Whether you are in Colombo, Kandy, or Galle, our island-wide
              delivery ensures you get the latest drops right to your door.
            </p>
            <p
              style={{
                color: "var(--v2-text-secondary, var(--color-primary-dark))",
                fontSize: 12,
                marginBottom: 0,
                lineHeight: 1.8,
              }}
            >
              We specialize in <strong style={{ color: "var(--v2-accent, inherit)" }}>premium quality</strong> footwear,{" "}
              <strong style={{ color: "var(--v2-accent, inherit)" }}>men&apos;s and women&apos;s clothing</strong>, and fashion
              accessories, giving you the look and feel of major global brands
              at a fraction of the cost. From premium shoes to everyday{" "}
              <strong style={{ color: "var(--v2-accent, inherit)" }}>apparel and sportswear</strong> — experience iconic
              designs without the premium price tag. Browse our collection of{" "}
              <strong style={{ color: "var(--v2-accent, inherit)" }}>t-shirts, hoodies, joggers, gym wear</strong>, and more.
            </p>
          </div>

          {/* RIGHT COLUMN: Categories & Trust */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h2
                style={{
                  fontWeight: 800,
                  margin: 0,
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--v2-text-primary, var(--color-primary-dark))",
                }}
              >
                Shop by Category
              </h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      borderRadius: 99,
                      padding: "4px 14px",
                      fontSize: 11,
                      fontWeight: 600,
                      border: "1px solid var(--v2-glass-border, rgba(46, 158, 91, 0.15))",
                      background: "var(--v2-glass-bg, rgba(46, 158, 91, 0.05))",
                      color: "var(--v2-text-secondary, var(--color-primary-dark))",
                      cursor: "default",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <hr
              style={{
                margin: 0,
                border: "none",
                borderTop: "1px solid var(--v2-glass-border, rgba(46, 158, 91, 0.08))",
              }}
            />

            <div className="flex flex-col gap-3">
              <h2
                style={{
                  fontWeight: 800,
                  margin: 0,
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--v2-text-primary, var(--color-primary-dark))",
                }}
              >
                Why Buy Online with Neverbe?
              </h2>
              <p
                style={{
                  color: "var(--v2-text-secondary, var(--color-primary-dark))",
                  fontSize: 12,
                  marginBottom: 0,
                  lineHeight: 1.8,
                }}
              >
                Stop searching for &quot;shops near me&quot; and trust our
                secure online platform. We offer{" "}
                <strong style={{ color: "var(--v2-accent, inherit)" }}>Cash on Delivery (COD)</strong>, hassle-free exchanges,
                and dedicated customer support. Join thousands of satisfied
                customers across Sri Lanka who have upgraded their wardrobe —
                from <strong style={{ color: "var(--v2-accent, inherit)" }}>shoes and clothing to accessories</strong> — with
                Neverbe. Shop <strong style={{ color: "var(--v2-accent, inherit)" }}>men&apos;s t-shirts, women&apos;s
                activewear, gym clothing, sportswear</strong>, and{" "}
                <strong style={{ color: "var(--v2-accent, inherit)" }}>premium sneakers</strong> all in one place.
              </p>
            </div>
          </div>
        </div>

        {/* SEO Navigation Links */}
        <div
          style={{
            marginTop: 48,
            paddingTop: 32,
            borderTop: "1px solid var(--v2-glass-border, rgba(46, 158, 91, 0.08))",
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "var(--v2-accent, var(--color-primary-dark))",
              display: "block",
              marginBottom: 16,
            }}
          >
            Popular Searches
          </span>
          <div className="flex flex-wrap gap-3 items-center">
            {searchLinks.map((link, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <span style={{ color: "var(--v2-text-dim, rgba(0,0,0,0.1))", fontSize: 12 }}>
                    /
                  </span>
                )}
                <Link
                  href={link.href}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--v2-text-secondary, var(--color-primary-dark))",
                    transition: "color 0.3s ease",
                  }}
                  className="hover:text-[var(--v2-accent)]!"
                >
                  {link.label}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOContent;
