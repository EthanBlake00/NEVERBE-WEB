import { Metadata } from "next";
import { getPaginatedCombos } from "@/actions/promotionAction";
import Link from "next/link";
import CombosGrid from "./components/CombosGrid";
import EmptyState from "@/components/EmptyState";

const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  color: "var(--color-primary-dark)",
  display: "block",
  marginBottom: 12,
};

// OPTIMIZATION: Cache for 1 hour (ISR)
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Bundle Deals & Combos | Shoes & Clothing Offers | NEVERBE",
  description:
    "Exclusive BOGO deals, multi-buy discounts and combo packs on sneakers, clothing & apparel. Save more when you bundle at NEVERBE Sri Lanka.",
  keywords: [
    "combo deals sri lanka",
    "bundle shoe offers",
    "bogo sneakers sri lanka",
    "clothing bundle deals sri lanka",
    "buy one get one free shoes",
    "multi buy discount footwear",
    "save on shoes sri lanka",
    "apparel combo deals",
  ],
  alternates: { canonical: "https://neverbe.lk/collections/combos" },
  openGraph: {
    title: "Bundle Deals & Combos | NEVERBE Sri Lanka",
    description:
      "BOGO deals and multi-buy discounts on premium sneakers & clothing. Save more when you bundle.",
    url: "https://neverbe.lk/collections/combos",
    type: "website",
    siteName: "NEVERBE",
    locale: "en_LK",
    images: [
      {
        url: "/offers-og.png",
        width: 1200,
        height: 630,
        alt: "NEVERBE Bundle Deals - Shoes & Clothing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bundle Deals | NEVERBE Sri Lanka",
    description: "BOGO & multi-buy discounts on sneakers & clothing in Sri Lanka.",
    images: ["/offers-og.png"],
  },
  metadataBase: new URL("https://neverbe.lk"),
};

const CombosPage = async ({
  searchParams,
}: {
  searchParams: { page?: string };
}) => {
  const page = Number(searchParams?.page) || 1;
  const pageSize = 6;
  let combos: any[] = [];
  let total = 0;
  let totalPages = 0;

  try {
    const data = await getPaginatedCombos({ page, pageSize });
    combos = data.combos || data.dataList || [];
    total = data.total || 0;
    totalPages = data.totalPages || Math.ceil(total / pageSize);
  } catch (e) {
    console.error("Error fetching combos:", e);
    combos = [];
  }

  /* Structured Data with BreadcrumbList for SEO */
  const combosSchema = {
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
            name: "Bundle Deals",
            item: "https://neverbe.lk/collections/combos",
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: "Bundle Deals & Combo Offers",
        description:
          "Exclusive combo deals, BOGO offers, and bundle discounts on premium footwear in Sri Lanka.",
        url: `https://neverbe.lk/collections/combos`,
        inLanguage: "en-LK",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: combos.length,
          itemListElement: combos.map((combo: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Product",
              name: combo?.name,
              image:
                combo?.previewThumbnail || "/offers-og.png",
              description:
                combo?.description || "Bundle deal at NEVERBE Sri Lanka.",
              url: `https://neverbe.lk/collections/combos/${combo?.id}`,
              brand: { "@type": "Brand", name: "NEVERBE" },
              offers: {
                "@type": "Offer",
                priceCurrency: "LKR",
                price: combo?.comboPrice || "0.00",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combosSchema) }}
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
          <span>Bundle Deals</span>
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
          Bundle Deals
        </h1>
        <p
          style={{ color: "var(--color-primary-dark)", fontSize: 14, margin: 0 }}
        >
          BOGO offers &amp; exclusive combo packs — save more when you buy
          together.
        </p>
      </div>

      <div className="w-full max-w-content mx-auto px-4 md:px-12 pb-20">
        {combos.length > 0 ? (
          <CombosGrid
            combos={combos}
            currentPage={page}
            totalPages={totalPages}
          />
        ) : (
          <div className="pt-20">
            <EmptyState
              heading="No bundle deals active right now."
              subHeading="Check back later for new combo offers."
            />
          </div>
        )}
      </div>

      {/* SEO Footer */}
      <div
        style={{
          borderTop: "1px solid var(--color-default)",
          padding: "48px 0",
        }}
      >
        <div className="max-w-content mx-auto px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <span style={sectionLabel}>Stack &amp; Save</span>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-primary-dark)",
                  margin: 0,
                }}
              >
                Our bundle deals give you maximum value — BOGO or multi-buy, you
                always get premium quality for less.
              </p>
            </div>
            <div>
              <span style={sectionLabel}>Popular Bundles</span>
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
                <li>Buy 2 Pairs, Get 15% Off</li>
                <li>Essential Socks Packs</li>
                <li>Complete Gym Kits</li>
              </ul>
            </div>
            <div>
              <span style={sectionLabel}>Limited Time</span>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-primary-dark)",
                  margin: 0,
                }}
              >
                Most bundle deals are available for a limited time only. Grab
                your favorites before the campaign ends.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CombosPage;
