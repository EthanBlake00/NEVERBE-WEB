import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getProductsByCategory } from "@/actions/productAction";
import Products from "@/app/(site)/collections/products/components/Products";
import {
  getCategoryBySlug,
  CATEGORY_MAPPINGS,
} from "@/utils/categorySlug";

const getProductsForCategory = cache(
  async (categoryLabel: string, page: number = 1) => {
    try {
      return await getProductsByCategory(categoryLabel, {
        page: String(page),
        size: "30",
      });
    } catch (e) {
      console.error(e);
      return { dataList: [], total: 0 };
    }
  },
);

// Generate static params for all known categories
export async function generateStaticParams() {
  return CATEGORY_MAPPINGS.map((c) => ({
    category: c.slug,
  }));
}

export async function generateMetadata(context: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const params = await context.params;
  const mapping = getCategoryBySlug(params.category);

  if (!mapping) {
    return {
      title: "Category Not Found | NEVERBE",
      description: "The requested category could not be found.",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `${mapping.title} | NEVERBE`,
    description: mapping.description,
    keywords: mapping.keywords,
    alternates: {
      canonical: `https://neverbe.lk/collections/${mapping.slug}`,
    },
    openGraph: {
      title: `${mapping.title} | NEVERBE`,
      description: mapping.description,
      url: `https://neverbe.lk/collections/${mapping.slug}`,
      type: "website",
      siteName: "NEVERBE",
      locale: "en_LK",
      images: [
        {
          url: "/collections-og.png",
          width: 1200,
          height: 630,
          alt: `${mapping.h1} - NEVERBE Sri Lanka`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${mapping.h1} | NEVERBE Sri Lanka`,
      description: mapping.description,
      images: ["/collections-og.png"],
    },
    metadataBase: new URL("https://neverbe.lk"),
  };
}

export const revalidate = 3600;

const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 800,
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
  color: "var(--color-primary-dark)",
  display: "block",
  marginBottom: 12,
};

const CategoryPage = async (context: {
  params: Promise<{ category: string }>;
}) => {
  const params = await context.params;
  const mapping = getCategoryBySlug(params.category);

  if (!mapping) return notFound();

  const items = await getProductsForCategory(mapping.label);
  const productList = items?.dataList || [];

  const categorySchema = {
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
            name: "Products",
            item: "https://neverbe.lk/collections/products",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: mapping.h1,
            item: `https://neverbe.lk/collections/${mapping.slug}`,
          },
        ],
      },
      {
        "@type": "CollectionPage",
        name: `${mapping.h1} - NEVERBE Sri Lanka`,
        description: mapping.description,
        url: `https://neverbe.lk/collections/${mapping.slug}`,
        inLanguage: "en-LK",
        isPartOf: {
          "@id": "https://neverbe.lk/#website",
        },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: productList.length,
          itemListElement: productList
            .slice(0, 20)
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
                  price: product?.sellingPrice || "0.00",
                  priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
                  availability: product?.inStock
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                  itemCondition: "https://schema.org/NewCondition",
                  seller: {
                    "@type": "Organization",
                    name: "NEVERBE",
                  },
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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categorySchema),
        }}
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
          <Link
            href="/collections/products"
            style={{ color: "var(--color-primary-dark)" }}
          >
            Products
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span>{mapping.h1}</span>
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
          {mapping.h1}
        </h1>
        <p
          style={{
            color: "var(--color-primary-dark)",
            fontSize: 14,
            margin: 0,
          }}
        >
          {mapping.subtitle}
        </p>
      </div>

      {/* Product Grid */}
      <div className="max-w-content mx-auto px-4 md:px-12 pb-20">
        <Products items={productList} />
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
              <span style={sectionLabel}>
                {mapping.h1} in Sri Lanka
              </span>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-primary-dark)",
                  margin: 0,
                }}
              >
                {mapping.description}
              </p>
            </div>
            <div>
              <span style={sectionLabel}>Browse More</span>
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
                {CATEGORY_MAPPINGS.filter(
                  (c) => c.slug !== mapping.slug,
                )
                  .slice(0, 4)
                  .map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/collections/${c.slug}`}
                        style={{ color: "var(--color-primary-dark)" }}
                      >
                        {c.h1}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <span style={sectionLabel}>Quality Guaranteed</span>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-primary-dark)",
                  margin: 0,
                }}
              >
                Free size exchanges within 7 days. Cash on Delivery
                island-wide. Every product is premium quality — durability
                and comfort guaranteed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CategoryPage;
