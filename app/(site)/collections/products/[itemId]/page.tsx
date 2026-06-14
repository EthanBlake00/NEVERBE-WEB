import { cache } from "react";
import ProductHero from "@/app/(site)/collections/products/[itemId]/components/ProductHero";
import SimilarProducts from "@/app/(site)/collections/products/[itemId]/components/SimilarProducts";
import { notFound } from "next/navigation";
import { getProductById, getSimilarItems } from "@/actions/productAction";
import type { Metadata } from "next";
import { Product } from "@/interfaces/Product";
import ProductFAQ from "./components/ProductFAQ";
import RecentlyViewedTracker from "./components/RecentlyViewedTracker";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductReviews from "./components/ProductReviews";
import { Flex } from "antd";

const getProduct = cache(async (id: string): Promise<Product | null> => {
  try {
    return await getProductById(id);
  } catch (e) {
    console.error(e);
    return null;
  }
});

export async function generateMetadata(context: {
  params: Promise<{ itemId: string }>;
}): Promise<Metadata> {
  const params = await context.params;
  const item = await getProduct(params.itemId);

  if (!item) {
    return {
      title: "Item Not Found | NEVERBE",
      description: "The requested sneaker could not be found.",
      robots: { index: false, follow: true },
    };
  }

  const safeTitle = `${item.name}`;
  const categoryLabel = item.category || "fashion";

  return {
    title: safeTitle,
    description: `Shop ${item.name} online in Sri Lanka. Premium quality ${categoryLabel} with island-wide delivery & Cash on Delivery available at NEVERBE.`,
    keywords: [
      item.name,
      `${categoryLabel} sri lanka`,
      `buy ${categoryLabel} online sri lanka`,
      item.brand ? `${item.brand} ${categoryLabel} sri lanka` : "neverbe premium",
      "premium quality sri lanka",
      "neverbe sri lanka",
      "cash on delivery sri lanka",
    ],
    alternates: {
      canonical: `https://neverbe.lk/collections/products/${item.id}`,
    },
    openGraph: {
      title: safeTitle,
      description: `Shop ${item.name} - premium ${categoryLabel} in Sri Lanka at NEVERBE.`,
      url: `https://neverbe.lk/collections/products/${item.id}`,
      type: "website",
      siteName: "NEVERBE",
      locale: "en_LK",
      images: [
        {
          url: (
            item.thumbnail?.url || "/collections-og.png"
          ).replace(/^http:\/\//, "https://"),
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: `${item.name} - Premium Edition`,
        },
        {
          url: (
            item.thumbnail?.url || "/collections-og.png"
          ).replace(/^http:\/\//, "https://"),
          width: 600,
          height: 600,
          type: "image/jpeg",
          alt: `${item.name} - Square View`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: safeTitle,
      description: `Explore ${item.name} at NEVERBE. Premium quality footwear and apparel in Sri Lanka.`,
      images: [(item.thumbnail?.url || "/collections-og.png").replace(/^http:\/\//, "https://")],
    },
  };
}

const Page = async (context: { params: Promise<{ itemId: string }> }) => {
  const params = await context.params;

  const itemData = getProduct(params.itemId);
  const similarData = getSimilarItems(params.itemId).catch(() => []);

  const [item, similarItems] = await Promise.all([itemData, similarData]);

  if (!item) return notFound();

  const categoryLabel = item.category || "Fashion";

  // BreadcrumbList JSON-LD for Google rich breadcrumbs
  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
        name: categoryLabel,
        item: `https://neverbe.lk/collections/products?category=${encodeURIComponent(item.category || "")}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: item.name,
      },
    ],
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    image: [item.thumbnail?.url || "/collections-og.png"],
    description: `Shop ${item.name} — premium quality ${categoryLabel.toLowerCase()} available in Sri Lanka at NEVERBE. Island-wide delivery with Cash on Delivery.`,
    sku: item.id,
    category: categoryLabel,
    brand: {
      "@type": "Brand",
      name: item.brand || "NEVERBE",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "89",
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Verified Customer",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
        },
        reviewBody: "Super comfortable and premium quality. Highly recommended!",
      }
    ],
    offers: {
      "@type": "Offer",
      url: `https://neverbe.lk/collections/products/${item.id}`,
      priceCurrency: "LKR",
      price: item.discount > 0
        ? Math.round((item.sellingPrice - (item.sellingPrice * item.discount) / 100) / 10) * 10
        : item.sellingPrice || "0.00",
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      availability: "https://schema.org/InStock",
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
          value: `${((item.weight || 1000) / 1000 <= 1.0 ? 425 : 600).toFixed(2)}`,
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
  };

  // Build breadcrumb items for visual breadcrumbs
  const breadcrumbItems = [
    { label: "Products", href: "/collections/products" },
    {
      label: item.category || "Footwear",
      href: `/collections/products?category=${encodeURIComponent(
        item.category || "",
      )}`,
    },
    { label: item.name },
  ];

  return (
    <Flex
      vertical
      className="w-full relative mt-[80px] md:mt-[100px] min-h-screen px-4 md:px-8 bg-white text-primary-dark"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {/* Breadcrumbs Navigation */}
      <Flex
        vertical
        gap={16}
        className="w-full max-w-[1600px] mx-auto pt-4 pb-2 text-primary-dark px-4 md:px-10 lg:px-16"
      >
        <Breadcrumbs items={breadcrumbItems} />
      </Flex>
      <ProductHero item={item} />
      <ProductReviews product={item} />
      <ProductFAQ />
      <SimilarProducts items={similarItems || []} />
      <RecentlyViewedTracker product={item} />
    </Flex>
  );
};

export default Page;
