import React from "react";
import { Metadata } from "next";
import ContactDetailsSection from "@/app/(site)/contact/components/ContactDetailsSection";
import SocialMediaSection from "@/app/(site)/contact/components/SocialMediaSection";
import MapSection from "@/app/(site)/contact/components/MapSection";

export const metadata: Metadata = {
  title: "Contact Us - Neverbe | Shoes & Clothing Sri Lanka",
  description:
    "Get in touch with Neverbe for inquiries about shoes, clothing & apparel. Contact us via email, WhatsApp, social media, or visit our store in Sri Lanka.",
  keywords:
    "Neverbe contact, customer service, shoe store sri lanka, clothing store sri lanka, whatsapp, support, inquiries",
  alternates: {
    canonical: "https://neverbe.lk/contact",
  },
  openGraph: {
    title: "Contact Us - Neverbe",
    description:
      "Reach out to Neverbe via email, social media, WhatsApp, or visit our store in Sri Lanka.",
    url: "https://neverbe.lk/contact",
    type: "website",
    siteName: "Neverbe",
    locale: "en_LK",
    images: [
      {
        url: "/main-og.png",
        width: 1200,
        height: 630,
        alt: "Neverbe Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@neverbe",
    creator: "@neverbe",
    title: "Contact Us - Neverbe",
    description:
      "Reach out to Neverbe via email, social media, WhatsApp, or visit our store in Sri Lanka.",
    images: ["/main-og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const ContactPage = () => {
  /* ✅ Structured Data for Contact Page + Breadcrumb + Organization */
  const structuredData = [
    {
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
          name: "Contact",
          item: "https://neverbe.lk/contact",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Neverbe",
      url: "https://neverbe.lk",
      logo: "/main-og.png",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+94 70 520 8999",
        contactType: "Customer Service",
        areaServed: "LK",
        availableLanguage: ["English", "Sinhala", "Tamil"],
      },
      sameAs: [
        "https://www.facebook.com/neverbe196",
        "https://www.instagram.com/neverbe196",
        "https://tiktok.com/@neverbe196",
      ],
    },
  ];

  return (
    <div className="min-h-screen mt-8 lg:mt-12 flex flex-col items-center px-4 sm:px-6 lg:px-12 bg-surface">
      {/* Structured Data JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* --- Header Section --- */}
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-display font-black uppercase tracking-tighter text-primary-dark">
          Contact Us
        </h1>
        <p className="text-muted mt-4 text-base max-w-2xl mx-auto">
          We'd love to hear from you. Whether you have a question, feedback, or
          just want to say hello — we're here to help!
        </p>
      </header>

      {/* --- Main Content Section --- */}
      <div className="w-full max-w-6xl p-6 sm:p-10 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <ContactDetailsSection />
          <SocialMediaSection />
        </div>

        <MapSection />
      </div>
    </div>
  );
};

export default ContactPage;
