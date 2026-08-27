// app/checkout/success/page.tsx
import React from "react";
import { redirect, notFound } from "next/navigation";
import SuccessPageClient from "./components/SuccessPageClient";
import { Metadata } from "next";
import { getOrderById } from "@/actions/orderAction";

export const metadata: Metadata = {
  title: "Order Success",
};

export default async function Page(context: {
  params: Promise<{ orderId: string }>;
}) {
  const params = await context.params;
  const orderId = params.orderId;
  console.log("orderId", orderId);

  if (!orderId) return notFound();

  try {
    const order = await getOrderById(orderId);
    if (!order) return redirect("/checkout/fail");
    
    // Prevent showing success page if order was cancelled by admin
    if (order.status?.toUpperCase() === "CANCELLED" || order.status?.toUpperCase() === "CANCELED") {
      return redirect("/checkout/fail");
    }

    return <SuccessPageClient order={order} />;
  } catch (error) {
    console.error("Error fetching order:", error);
    return redirect("/checkout/fail");
  }
}
