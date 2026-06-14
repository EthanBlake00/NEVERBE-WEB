import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Neverbe",
  description:
    "Sign in to your Neverbe account to view orders and manage your profile.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
