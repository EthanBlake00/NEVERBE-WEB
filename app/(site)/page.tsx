import Hero from "@/app/(site)/components/Hero";
import TrustStrip from "@/app/(site)/components/TrustStrip";
import { BentoShowcase } from "@/app/(site)/components/BentoShowcase";
import ProductShowcase from "@/app/(site)/components/ProductShowcase";
import BrandMarquee from "@/app/(site)/components/BrandMarquee";
import SocialProof from "@/app/(site)/components/SocialProof";
import CTABanner from "@/app/(site)/components/CTABanner";
import SmoothScroll from "@/app/(site)/components/SmoothScroll";

import { getHotProducts, getRecentItems } from "@/actions/productAction";
import { getSliders } from "@/actions/slideAction";
import { getBrands, getFeaturedCategories } from "@/actions/otherAction";

import type { Metadata } from "next";
import SEOContent from "./components/SEOContent";
import { getPaginatedCombos } from "@/actions/promotionAction";

export const metadata: Metadata = {
  title: {
    default:
      "Neverbe — Shoes & Clothing in Sri Lanka | Sneakers, Apparel & Fashion Online",
    template: "%s | Neverbe",
  },
  metadataBase: new URL("https://neverbe.lk"),
  alternates: {
    canonical: "https://neverbe.lk",
  },
  description:
    "Neverbe — Sri Lanka's #1 Online Store for Shoes, Clothing & Apparel. Shop Sneakers, T-Shirts, Activewear, Sportswear & Fashion Accessories. Island-wide Cash on Delivery.",
  applicationName: "Neverbe",
  keywords: [
    "shoes sri lanka",
    "clothing sri lanka",
    "buy shoes online sri lanka",
    "apparel online sri lanka",
    "sneakers sri lanka",
    "men's t-shirts sri lanka",
    "women's clothing sri lanka",
    "running shoes sri lanka",
    "activewear sri lanka",
    "online shoe store",
    "online fashion store sri lanka",
    "gym wear sri lanka",
    "sportswear sri lanka",
    "premium sneakers",
    "Neverbe",
  ],
  openGraph: {
    title: "Neverbe — Shoes & Clothing in Sri Lanka | Sneakers, Apparel & Fashion",
    description:
      "Sri Lanka's top shop for shoes, clothing & fashion. Sneakers, activewear, t-shirts, sportswear & more. Best prices with island-wide Cash on Delivery.",
    url: "https://neverbe.lk",
    siteName: "Neverbe",
    type: "website",
    locale: "en_LK",
    images: [
      {
        url: "/main-og.png",
        alt: "Neverbe - Shoes & Clothing in Sri Lanka",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export const revalidate = 3600;

const Page = async () => {
  const dataPromise = Promise.all([
    getRecentItems().catch(() => []),
    getSliders().catch(() => []),
    getHotProducts().catch(() => []),
    getBrands().catch(() => []),
    getPaginatedCombos(1).catch(() => ({ combos: [] })),
    getFeaturedCategories().catch(() => []),
  ]);

  const [arrivals, sliders, hotItems, brands, combosData, featuredCategories] =
    await dataPromise;

  /* STRUCTURED DATA: Organization + ShoeStore + WebSite + BreadcrumbList */
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://neverbe.lk/#organization",
        name: "Neverbe",
        legalName: "Neverbe",
        alternateName: "Neverbe Sri Lanka",
        url: "https://neverbe.lk",
        logo: {
          "@type": "ImageObject",
          url: "/main-og.png",
          width: 600,
          height: 600,
        },
        image: "/main-og.png",
        description:
          "Sri Lanka's #1 online shoe store. Shop sneakers, running shoes, slides & footwear with Cash on Delivery island-wide.",
        sameAs: [
          "https://www.facebook.com/share/1GaP5gJB2p/",
          "https://www.instagram.com/neverbe.196",
          "https://www.tiktok.com/@neverbe196",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+94-70-520-8999",
          contactType: "customer service",
          availableLanguage: ["English", "Sinhala"],
          areaServed: "LK",
        },
      },
      {
        "@type": ["ShoeStore", "ClothingStore"],
        "@id": "https://neverbe.lk/#shoestore",
        name: "Neverbe - Online Shoe & Clothing Store Sri Lanka",
        brand: "Neverbe",
        legalName: "Neverbe",
        alternateName: "Neverbe Shoe & Clothing Store",
        url: "https://neverbe.lk",
        image: "/main-og.png",
        description:
          "Buy shoes, clothing & apparel online in Sri Lanka. Sneakers, t-shirts, activewear, sportswear & fashion accessories at best prices. Cash on Delivery available.",
        telephone: "+94 70 520 8999",
        email: "info@neverbe.lk",
        address: {
          "@type": "PostalAddress",
          streetAddress: "330/4/10, New Kandy Road, Delgoda",
          addressLocality: "Delgoda",
          addressRegion: "Western Province",
          addressCountry: "LK",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "6.986933",
          longitude: "80.012659",
        },
        priceRange: "LKR 3,000 - LKR 25,000",
        currenciesAccepted: "LKR",
        paymentAccepted: "Cash, Card, Bank Transfer",
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: "00:00",
          closes: "23:59",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Neverbe Collection",
          itemListElement: [
            { "@type": "OfferCatalog", name: "Sneakers" },
            { "@type": "OfferCatalog", name: "Running Shoes" },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://neverbe.lk/#website",
        url: "https://neverbe.lk",
        name: "Neverbe",
        description: "Shoes & Clothing in Sri Lanka",
        publisher: { "@id": "https://neverbe.lk/#organization" },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://neverbe.lk/search?q={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://neverbe.lk/#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://neverbe.lk",
          },
        ],
      },
    ],
  };

  const promotions: Array<{
    id: string;
    name: string;
    bannerUrl?: string;
    isActive: boolean;
  }> = [];

  return (
    <div className="v2-landing min-h-screen w-full relative overflow-x-hidden bg-[var(--v2-bg-void)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <SmoothScroll>
        {/* 1. Cinematic Hero */}
        <Hero slides={sliders} />

        {/* 2. Trust & Benefits Strip */}
        <TrustStrip />

        {/* 3. Bento Grid — Categories & Promos */}
        <BentoShowcase
          categories={featuredCategories}
          promotions={promotions}
        />

        {/* 4. Product Showcase — Popular + New Arrivals */}
        {(hotItems.length > 0 || arrivals.length > 0) && (
          <ProductShowcase hotItems={hotItems} arrivals={arrivals} />
        )}

        {/* 5. Brand Marquee */}
        {brands.length > 0 && <BrandMarquee brands={brands} />}

        {/* 6. Social Proof — Customer Reviews */}
        <SocialProof />

        {/* 7. Call-to-Action Banner */}
        <CTABanner />

        {/* 8. SEO Content (preserved for search indexing) */}
        <div style={{ background: "var(--v2-bg-surface)" }}>
          <SEOContent />
        </div>
      </SmoothScroll>
    </div>
  );
};

export default Page;
