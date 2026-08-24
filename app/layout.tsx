import "./globals.css";
import { WebVitals } from "@/components/WebVitals";
import { Suspense } from "react";
import AnalyticsTracker from "@/app/(site)/components/AnalyticsTracker";

export const metadata: Metadata = {
  title: {
    default:
      "Neverbe — Shoes & Clothing Sri Lanka | Sneakers, Apparel & Fashion Online",
    template: "%s | Neverbe",
  },
  description:
    "Neverbe is Sri Lanka's #1 online store for shoes, clothing & apparel. Shop sneakers, t-shirts, activewear, sportswear & fashion accessories. Island-wide delivery & Cash on Delivery.",
  applicationName: "Neverbe",
  keywords: [
    "Neverbe",
    "shoes sri lanka",
    "buy shoes online sri lanka",
    "sneakers sri lanka",
    "clothing sri lanka",
    "apparel online sri lanka",
    "men's t-shirts sri lanka",
    "women's clothing sri lanka",
    "activewear sri lanka",
    "gym wear sri lanka",
    "branded clothes sri lanka",
    "running shoes sri lanka",
    "casual footwear colombo",
    "online fashion store sri lanka",
    "cash on delivery clothes sri lanka",
    "sportswear sri lanka",
    "premium footwear sri lanka",
    "buy sneakers online colombo",
  ],
  authors: [{ name: "Neverbe" }],
  creator: "Neverbe",
  publisher: "Neverbe",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://neverbe.lk"),
  alternates: {
    canonical: "https://neverbe.lk",
  },
  openGraph: {
    title: "Neverbe — Shoes & Clothing in Sri Lanka | Online Fashion Store",
    description:
      "Sri Lanka's top online store for shoes, clothing & fashion. Sneakers, t-shirts, activewear, gym wear & more with island-wide delivery.",
    siteName: "Neverbe",
    url: "https://neverbe.lk",
    locale: "en_LK",
    type: "website",
    images: [
      {
        url: "/logo-og.png",
        width: 1200,
        height: 630,
        alt: "Neverbe - Premium Footwear & Apparel Sri Lanka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neverbe — Shoes & Clothing Sri Lanka | Fashion Online",
    description:
      "Shop shoes, clothing & apparel in Sri Lanka. Sneakers, activewear, t-shirts & more with Cash on Delivery island-wide.",
    images: ["/logo-og.png"],
    creator: "@neverbe_lk",
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual code
  },
  category: "retail",
};

const monoClass = "font-mono";
const interClass = "font-sans";
const plusJakartaClass = "font-display";

import StoreProvider from "@/app/(site)/components/StoreProvider";
import AuthProvider from "@/components/AuthProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Neverbe",
    url: "https://neverbe.lk",
    logo: "https://neverbe.lk/logo.png",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+94729249999",
        contactType: "customer service",
        areaServed: "LK",
        availableLanguage: "English",
      },
      {
        "@type": "ContactPoint",
        telephone: "+94705208999",
        contactType: "sales",
        areaServed: "LK",
        availableLanguage: "English",
      },
    ],
    sameAs: [
      "https://www.facebook.com/share/1GaP5gJB2p/",
      "https://www.instagram.com/neverbe.196",
      "https://www.tiktok.com/@neverbe196",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "330/4/10, New Kandy Road",
      addressLocality: "Delgoda",
      addressRegion: "Gampaha",
      addressCountry: "LK",
    },
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Neverbe",
    "alternateName": ["Neverbe", "Neverbe Shoes & Clothing"],
    "url": "https://neverbe.lk",
  };

  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Neverbe",
    image: "https://neverbe.lk/logo-og.png",
    "@id": "https://neverbe.lk",
    url: "https://neverbe.lk",
    telephone: "+94729249999",
    address: {
      "@type": "PostalAddress",
      streetAddress: "330/4/10, New Kandy Road",
      addressLocality: "Delgoda",
      addressRegion: "Gampaha",
      addressCountry: "LK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 6.9869,
      longitude: 80.0127,
    },
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
  };

  return (
    <html lang="en" className="bg-white text-primary-dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && window.location.hostname.includes('dev.neverbe')) {
                var meta = document.createElement('meta');
                meta.name = 'robots';
                meta.content = 'noindex, nofollow';
                document.head.appendChild(meta);
              }
            `,
          }}
        />
      </head>
      <body
        className="antialiased min-h-screen flex flex-col font-sans"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
        />
        <StoreProvider>
          <AuthProvider>
            <AntdRegistry>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "var(--color-accent)",
                    colorLink: "var(--color-accent)",
                    colorLinkHover: "var(--color-accent)",
                    colorLinkActive: "var(--color-accent-hover)",
                    colorInfo: "var(--color-accent)",
                    colorSuccess: "var(--color-accent)",
                    fontFamily: "var(--font-inter)",
                    borderRadius: 12,
                    colorBgLayout: "#f8faf5",
                    colorBgContainer: "#ffffff",
                    colorTextBase: "var(--color-primary-dark)",
                  },
                  components: {
                    Card: {
                      borderRadiusLG: 20,
                      paddingLG: 24,
                      colorBgContainer: "#ffffff",
                    },
                    Button: {
                      borderRadius: 99,
                      controlHeight: 44,
                      controlHeightLG: 56,
                      fontWeight: 700,
                      colorPrimary: "var(--color-accent)",
                      colorPrimaryHover: "var(--color-accent-hover)",
                      colorPrimaryActive: "var(--color-accent-hover)",
                      primaryColor: "#ffffff",
                    },
                    Checkbox: {
                      colorPrimary: "var(--color-accent)",
                      colorPrimaryHover: "var(--color-accent-hover)",
                    },
                    Carousel: {
                      dotHeight: 6,
                      dotWidth: 32,
                      dotActiveWidth: 48,
                    },
                    Input: {
                      borderRadius: 99,
                      colorPrimary: "var(--color-accent)",
                      colorPrimaryHover: "var(--color-accent)",
                      activeBorderColor: "var(--color-accent)",
                      hoverBorderColor: "var(--color-accent)",
                    },
                    Select: {
                      borderRadius: 99,
                      colorPrimary: "var(--color-accent)",
                    },
                    Tag: {
                      borderRadiusSM: 99,
                    },
                    Collapse: {
                      borderRadius: 12,
                    },
                    Drawer: {
                      borderRadius: 32,
                    },
                    Badge: {
                      colorPrimary: "var(--color-accent)",
                    },
                    Spin: {
                      colorPrimary: "var(--color-accent)",
                    },
                  },
                }}
              >
                <main className="flex-1">{children}</main>
                <WebVitals />
                <Suspense fallback={null}>
                  <AnalyticsTracker />
                </Suspense>
              </ConfigProvider>
            </AntdRegistry>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
