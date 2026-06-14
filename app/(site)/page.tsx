// pages or app route file (your home page)
import Hero from "@/app/(site)/components/Hero";
import NewArrivals from "@/app/(site)/components/NewArrivals";
import WhyUs from "@/app/(site)/components/WhyUs";
import PopularProducts from "@/app/(site)/components/PopularProducts";
import BrandsSlider from "./components/BrandsSlider";
import PromotionalAds from "./components/PromotionalAds";
import CustomerReviews from "./components/CustomerReviews";

import { getHotProducts, getRecentItems } from "@/actions/productAction";
import { getSliders } from "@/actions/slideAction";
import { getBrands, getFeaturedCategories } from "@/actions/otherAction";

import type { Metadata } from "next";
import SEOContent from "./components/SEOContent";
import FeaturedCategories from "./components/FeaturedCategory";
import TrendingBundles from "./components/TrendingBundles";
import { getPaginatedCombos } from "@/actions/promotionAction";
import { Flex } from "antd";
export const metadata: Metadata = {
  title: {
    default:
      "NEVERBE — Shoes & Clothing in Sri Lanka | Sneakers, Apparel & Fashion Online",
    template: "%s | NEVERBE",
  },
  metadataBase: new URL("https://neverbe.lk"),
  alternates: {
    canonical: "https://neverbe.lk",
  },
  description:
    "NEVERBE — Sri Lanka's #1 Online Store for Shoes, Clothing & Apparel. Shop Sneakers, T-Shirts, Activewear, Sportswear & Fashion Accessories. Island-wide Cash on Delivery.",
  applicationName: "NEVERBE",
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
    "NEVERBE",
  ],
  openGraph: {
    title: "NEVERBE — Shoes & Clothing in Sri Lanka | Sneakers, Apparel & Fashion",
    description:
      "Sri Lanka's top shop for shoes, clothing & fashion. Sneakers, activewear, t-shirts, sportswear & more. Best prices with island-wide Cash on Delivery.",
    url: "https://neverbe.lk",
    siteName: "NEVERBE",
    type: "website",
    locale: "en_LK",
    images: [
      {
        url: "/main-og.png",
        alt: "NEVERBE - Shoes & Clothing in Sri Lanka",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export const revalidate = 3600;
const Page = async () => {
  const dataPromise = Promise.all([
    getRecentItems().catch((err) => []),
    getSliders().catch((err) => []),
    getHotProducts().catch((err) => []),
    getBrands().catch((err) => []),
    getPaginatedCombos(1).catch((err) => ({ combos: [] })),
    getFeaturedCategories().catch((err) => []),
  ]);


  const [arrivals, sliders, hotItems, brands, combosData, featuredCategories] = await dataPromise;
  const combos = combosData?.combos || [];


  /* STRUCTURED DATA: Organization + ShoeStore + WebSite + FAQPage + BreadcrumbList
     Enhanced for Google Rich Results with comprehensive business info.
  */
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://neverbe.lk/#organization",
        name: "NEVERBE",
        legalName: "NEVERBE",
        alternateName: "NEVERBE Sri Lanka",
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
        name: "NEVERBE - Online Shoe & Clothing Store Sri Lanka",
        brand: "NEVERBE",
        legalName: "NEVERBE",
        alternateName: "NEVERBE Shoe & Clothing Store",
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
          name: "NEVERBE Collection",
          itemListElement: [
            { "@type": "OfferCatalog", name: "Sneakers" },
            { "@type": "OfferCatalog", name: "Running Shoes" },
            { "@type": "OfferCatalog", name: "Slides & Sandals" },
            { "@type": "OfferCatalog", name: "Boots" },
            { "@type": "OfferCatalog", name: "Men's Clothing" },
            { "@type": "OfferCatalog", name: "Women's Clothing" },
            { "@type": "OfferCatalog", name: "Activewear & Sportswear" },
            { "@type": "OfferCatalog", name: "Gym Wear" },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://neverbe.lk/#website",
        url: "https://neverbe.lk",
        name: "NEVERBE",
        description: "Buy Shoes Online in Sri Lanka",
        publisher: { "@id": "https://neverbe.lk/#organization" },
        inLanguage: "en-LK",
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

  return (
    <div className="bg-[#fcfdfa] min-h-screen w-full relative overflow-x-hidden">
      <Flex vertical className="w-full relative z-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <Flex vertical style={{ width: "100%", flex: "auto" }}>
          <Hero slides={sliders} />
          <FeaturedCategories categories={featuredCategories} />

          <PromotionalAds />

          {hotItems.length > 0 && <PopularProducts hotItems={hotItems} />}

          {/* New Bundles Section */}
          {combos.length > 0 && <TrendingBundles bundles={combos} />}

          {arrivals.length > 0 && <NewArrivals arrivals={arrivals} />}

          {/* A large visual break for Brands */}
          {brands.length > 0 && <BrandsSlider items={brands} />}

          {/* Customer Reviews Section */}
          <CustomerReviews />

          <WhyUs />
          <SEOContent />
        </Flex>
      </Flex>
    </div>
  );
};
export default Page;
