import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getComboById } from "@/actions/promotionAction";
import ComboHero from "./components/ComboHero";
import Breadcrumbs from "@/components/Breadcrumbs";

// Cache the fetch to dedupe requests
const getCombo = cache(async (id: string) => {
  try {
    return await getComboById(id);
  } catch (e) {
    console.error(e);
    return null;
  }
});

const getAbsoluteUrl = (url?: string) => {
  if (!url) return "https://neverbe.lk/logo-og.png";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://neverbe.lk${url.startsWith("/") ? "" : "/"}${url}`;
};

// Dynamic Metadata
export async function generateMetadata(context: {
  params: Promise<{ comboId: string }>;
}): Promise<Metadata> {
  const params = await context.params;
  const combo = await getCombo(params.comboId);

  if (!combo) {
    return {
      title: "Deal Not Found | Neverbe",
      description: "The requested combo deal could not be found.",
      robots: { index: false, follow: true },
    };
  }

  const savings = combo.originalPrice - combo.comboPrice;

  return {
    title: `${combo.name} - Save Rs. ${savings} | Neverbe`,
    description:
      combo.description ||
      `Get ${combo.name} bundle and save Rs. ${savings}. Limited time combo deal!`,
    openGraph: {
      title: `${combo.name} | Neverbe Combo Deals`,
      description: `Save Rs. ${savings} with this exclusive combo deal.`,
      url: `https://neverbe.lk/collections/combos/${combo.id}`,
      images: [
        {
          url: getAbsoluteUrl(combo.thumbnail?.url),
          width: 1200,
          height: 630,
          alt: combo.name,
        },
      ],
    },
  };
}

const ComboDetailPage = async (context: {
  params: Promise<{ comboId: string }>;
}) => {
  const params = await context.params;
  const combo = await getCombo(params.comboId);

  if (!combo) return notFound();

  // JSON-LD Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: combo.name,
    description: combo.description,
    image: getAbsoluteUrl(combo.thumbnail?.url),
    offers: {
      "@type": "Offer",
      price: combo.comboPrice,
      priceCurrency: "LKR",
      availability: "https://schema.org/InStock",
    },
  };

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: "Combos", href: "/collections/combos" },
    { label: combo.name },
  ];

  return (
    <main className="w-full relative bg-white text-primary-dark">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Container with Nike-style spacing */}
      <div className="max-w-text mx-auto pt-[100px] md:pt-[140px] px-6 md:px-12 pb-20">
        {/* Breadcrumbs Navigation */}
        <div className="pb-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <ComboHero combo={combo} />
      </div>
    </main>
  );
};

export default ComboDetailPage;
