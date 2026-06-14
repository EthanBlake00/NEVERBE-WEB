export const metadata = {
  title: "Maintenance | Neverbe",
  description:
    "Neverbe is currently undergoing scheduled maintenance. We’ll be back shortly with an improved experience.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  openGraph: {
    title: "Neverbe - Maintenance",
    description:
      "We’re performing scheduled maintenance. The website will be back online shortly.",
    url: "https://neverbe.lk/maintenance",
    siteName: "Neverbe",
  },
  alternates: {
    canonical: "https://neverbe.lk/maintenance",
  },
};

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="min-h-screen w-full">
      <body>{children}</body>
    </html>
  );
}
