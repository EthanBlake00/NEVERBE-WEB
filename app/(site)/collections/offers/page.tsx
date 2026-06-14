import {
  getActivePromotions,
  getActiveCoupons,
} from "@/actions/promotionAction";
import { getDealsProducts } from "@/actions/productAction";
import CouponCard from "./components/CouponCard";
import DealsProducts from "./components/DealsProducts";
import CampaignCarousel from "./components/CampaignCarousel";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "antd";

const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  color: "var(--color-primary-dark)",
  display: "block",
  marginBottom: 12,
};

export const metadata: Metadata = {
  title: "Exclusive Deals, Coupons & Promotions | NEVERBE Sri Lanka",
  description:
    "Unlock exclusive promotions, seasonal coupons and markdown deals at NEVERBE. Best discounts on sneakers, clothing & apparel in Sri Lanka. Cash on Delivery available.",
  alternates: { canonical: "https://neverbe.lk/collections/offers" },
  keywords: [
    "shoe deals sri lanka",
    "clothing deals sri lanka",
    "discount sneakers colombo",
    "apparel sale sri lanka",
    "coupon codes sri lanka",
    "neverbe promotions",
    "footwear sale sri lanka",
    "clothing sale sri lanka",
    "markdown deals shoes",
  ],
  openGraph: {
    title: "Deals & Promotions | NEVERBE Sri Lanka",
    description:
      "Exclusive promotions, coupons and markdown deals on sneakers, clothing & apparel in Sri Lanka.",
    url: "https://neverbe.lk/collections/offers",
    type: "website",
    siteName: "NEVERBE",
    locale: "en_LK",
    images: [
      {
        url: "/offers-og.png",
        width: 1200,
        height: 630,
        alt: "NEVERBE Offers & Deals - Shoes & Clothing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Deals & Promotions | NEVERBE",
    description: "Exclusive coupons & markdown deals on sneakers & clothing in Sri Lanka.",
    images: ["/offers-og.png"],
  },
};

export const revalidate = 600;

const OffersPage = async () => {
  const [promotions, coupons] = await Promise.all([
    getActivePromotions(),
    getActiveCoupons(),
  ]);

  const bannerPromotions = promotions.filter(
    (p: any) => p.bannerUrl && p.isActive,
  );

  let dealsList: any[] = [];
  try {
    const dealsResult = await getDealsProducts({ page: 1, size: 30 });
    dealsList = dealsResult?.dataList || [];
  } catch (e) {
    console.error("Error fetching deal items:", e);
  }

  const offersSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://neverbe.lk",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Offers",
            item: "https://neverbe.lk/collections/offers",
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: "Offers & Deals - NEVERBE Sri Lanka",
        description:
          "Exclusive deals and discounts on premium footwear at NEVERBE.",
        url: "https://neverbe.lk/collections/offers",
        inLanguage: "en-LK",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: dealsList.length,
          itemListElement: dealsList
            .slice(0, 15)
            .map((product: any, index: number) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Product",
                name: product?.name,
                image: product?.thumbnail?.url,
                url: `https://neverbe.lk/collections/products/${product?.id}`,
                description: product?.description || `Shop ${product?.name} online in Sri Lanka at NEVERBE.`,
                brand: {
                  "@type": "Brand",
                  name: product?.brand || "NEVERBE",
                },
                offers: {
                  "@type": "Offer",
                  priceCurrency: "LKR",
                  price: product?.discount > 0
                    ? Math.round((product.sellingPrice - (product.sellingPrice * product.discount) / 100) / 10) * 10
                    : product?.sellingPrice || "0.00",
                  priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
                  availability: "https://schema.org/InStock",
                  shippingDetails: {
                    "@type": "OfferShippingDetails",
                    shippingDestination: {
                      "@type": "DefinedRegion",
                      addressCountry: "LK",
                    },
                    shippingRate: {
                      "@type": "MonetaryAmount",
                      value: "425.00",
                      currency: "LKR",
                    },
                    deliveryTime: {
                      "@type": "ShippingDeliveryTime",
                      handlingTime: {
                        "@type": "QuantitativeValue",
                        minValue: 1,
                        maxValue: 2,
                        unitCode: "DAY",
                      },
                      transitTime: {
                        "@type": "QuantitativeValue",
                        minValue: 1,
                        maxValue: 3,
                        unitCode: "DAY",
                      },
                    },
                  },
                  hasMerchantReturnPolicy: {
                    "@type": "MerchantReturnPolicy",
                    applicableCountry: "LK",
                    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
                    merchantReturnDays: 7,
                    returnMethod: "https://schema.org/ReturnByMail",
                    returnFees: "https://schema.org/ReturnFeesCustomerPaying",
                  },
                },
              },
            })),
        },
      },
    ],
  };

  return (
    <main className="w-full min-h-screen" style={{ background: "#f8faf5" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema) }}
      />

      {/* Page Header */}
      <div className="w-full max-w-content mx-auto px-4 md:px-12 pt-8 pb-6">
        <nav
          style={{
            fontSize: 12,
            color: "var(--color-primary-dark)",
            marginBottom: 16,
          }}
        >
          <Link href="/" style={{ color: "var(--color-primary-dark)" }}>
            Home
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span>Offers</span>
        </nav>
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            margin: 0,
            marginBottom: 8,
            color: "var(--color-primary-dark)",
          }}
        >
          Offers &amp; Deals
        </h1>
        <p
          style={{
            color: "var(--color-primary-dark)",
            fontSize: 14,
            margin: 0,
          }}
        >
          Exclusive campaigns, seasonal coupons &amp; markdown deals.
        </p>
      </div>

      <div
        className="w-full max-w-content mx-auto px-4 md:px-12 pb-20"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "clamp(2rem, 4vw, 4rem)",
        }}
      >
        {/* Active Campaigns */}
        {bannerPromotions.length > 0 && (
          <CampaignCarousel promotions={bannerPromotions} />
        )}

        {/* Coupons */}
        {coupons.length > 0 && (
          <section>
            <p
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--color-primary-dark)",
                marginBottom: 20,
              }}
            >
              Available Coupons
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coupon: any) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </section>
        )}

        {/* Markdown Deals */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "-0.02em",
                  fontWeight: 900,
                  margin: 0,
                  marginBottom: 4,
                }}
              >
                Markdown Deals
              </h2>
              <p style={{ color: "var(--color-primary-dark)", fontSize: 13 }}>
                Best prices on premium products.
              </p>
            </div>
            <Link
              href="/collections/combos"
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "var(--color-accent)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                whiteSpace: "nowrap",
              }}
            >
              View Bundle Deals →
            </Link>
          </div>
          <DealsProducts items={dealsList} />
        </section>
      </div>

      {/* SEO Footer */}
      <div
        style={{
          borderTop: "1px solid var(--color-default)",
          padding: "48px 0",
          marginTop: 24,
        }}
      >
        <div className="max-w-content mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <span style={sectionLabel}>Member Benefits</span>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-primary-dark)",
                  margin: 0,
                }}
              >
                Sign up to unlock early access, exclusive deals, and the best
                prices on premium products in Sri Lanka.
              </p>
            </div>
            <div>
              <span style={sectionLabel}>Ways to Save</span>
              <ul
                style={{
                  fontSize: 13,
                  color: "var(--color-primary-dark)",
                  lineHeight: 2,
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                }}
              >
                <li>Seasonal Markdown Deals</li>
                <li>Exclusive Coupon Codes</li>
                <li>Bundle &amp; Save Combos</li>
              </ul>
            </div>
            <div>
              <span style={sectionLabel}>Price Match Promise</span>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-primary-dark)",
                  margin: 0,
                }}
              >
                Found a better price elsewhere? Let us know and we&apos;ll do
                our best to match it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OffersPage;
