import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Neverbe - Create Account",
  description:
    "Create your account to get access to the best products and inspiration.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
