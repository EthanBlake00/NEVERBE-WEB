"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Order } from "@/interfaces";
import SuccessAnimationComponents from "./SuccessAnimationComponents";
import { IoArrowForward } from "react-icons/io5";
import PrepaidFeeBanner from "@/app/(site)/checkout/components/PrepaidFeeBanner";
import PrepaidFeeDecisionModal from "@/app/(site)/checkout/components/PrepaidFeeDecisionModal";
import { initiatePayHerePayment, submitExternalForm } from "@/actions/orderAction";
import toast from "react-hot-toast";
import axiosInstance from "@/actions/axiosInstance";

export default function SuccessPageClient({ order }: { order: Order }) {
  const [feePaid, setFeePaid] = useState(order?.deliveryFeePrepaid || false);
  const isHighRiskPending = order?.riskStatus === "HIGH_RISK" && !feePaid;
  const [showModal, setShowModal] = useState<boolean>(isHighRiskPending);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const pollCountRef = useRef(0);

  useEffect(() => {
    if (isHighRiskPending) {
      const intervalId = setInterval(async () => {
        pollCountRef.current += 1;
        if (pollCountRef.current > 20) {
          clearInterval(intervalId);
          return;
        }
        
        try {
          const response = await axiosInstance.get(`/web/orders/${order.orderId}/prepaid-status`);
          const statusData = response.data?.data || response.data;
          if (statusData?.deliveryFeePrepaid === true) {
            setFeePaid(true);
            setShowModal(false);
            clearInterval(intervalId);
            toast.success('Delivery fee confirmed! Your order will be dispatched shortly.');
          }
        } catch (error) {
          console.error("Failed to poll prepaid status:", error);
        }
      }, 3000);
      
      return () => clearInterval(intervalId);
    }
  }, [isHighRiskPending, order.orderId]);

  const handlePayFeeNow = async () => {
    if (!order) return;
    try {
      const [firstName, ...lastNameParts] = (order.customer?.name || "Customer").split(" ");
      const payload = {
        orderId: `${order.orderId}-FEE`,
        amount: "450.00",
        firstName,
        lastName: lastNameParts.join(" ") || firstName,
        email: order.customer?.email || "",
        phone: order.customer?.phone || "",
        address: order.customer?.address || "",
        city: order.customer?.city || "",
        items: `Prepaid Delivery Fee for Order #${order.orderId}`,
      };

      const payherePayload = await initiatePayHerePayment(payload);
      submitExternalForm(process.env.NEXT_PUBLIC_PAYHERE_URL || "", payherePayload);
    } catch (err: any) {
      console.error("Delivery fee prepayment launch error:", err);
      toast.error("Failed to launch delivery fee prepayment. Please try again.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[var(--v2-bg-surface,#141414)] text-[var(--v2-text-primary,#F5F5F5)]">
      {/* Persistent Warning Banner */}
      {isHighRiskPending && (
        <PrepaidFeeBanner order={order} onPayNow={handlePayFeeNow} />
      )}

      {/* Main Success Container */}
      <main className="w-full pt-20 pb-20 px-4 md:px-8 flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-xl animate-fadeIn v2-glass p-8 sm:p-12 rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
          <SuccessAnimationComponents />

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-none mb-3 text-[var(--v2-text-primary,#F5F5F5)] m-0">
            Order Confirmed!
          </h1>

          <p className="text-xs sm:text-sm text-[var(--v2-text-secondary,#A0A0A0)] font-medium mb-6 leading-relaxed m-0">
            Thank you, <span className="text-[var(--v2-text-primary,#F5F5F5)] font-bold">{order.customer?.name?.split(" ")[0]}</span>. Your order is registered &amp; being prepared.
          </p>

          <div className="inline-block px-4 py-1.5 bg-[var(--v2-accent,#2EE66A)]/10 border border-[var(--v2-accent,#2EE66A)]/30 rounded-full mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-primary,#F5F5F5)] m-0">
              Order ID: <span className="text-[var(--v2-accent,#2EE66A)]">#{order.orderId}</span>
            </p>
          </div>

          {/* High-Risk Delivery Fee Status Callout */}
          {isHighRiskPending && (
            <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-8 text-left">
              <p className="text-xs font-bold text-amber-300 mb-1">
                ⚠️ Delivery Fee Prepayment Pending (LKR 450)
              </p>
              <p className="text-[11px] text-gray-300 leading-relaxed mb-3">
                Your order is safely registered. Complete the LKR 450 online delivery fee payment so our dispatch team can send out your package immediately.
              </p>
              <button
                type="button"
                onClick={handlePayFeeNow}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                Pay LKR 450 Delivery Fee Online
              </button>
            </div>
          )}

          {order?.riskStatus === 'HIGH_RISK' && feePaid && (
            <div className="w-full bg-[var(--v2-accent,#2EE66A)]/10 border border-[var(--v2-accent,#2EE66A)]/30 rounded-2xl p-4 mb-8 text-left">
              <p className="text-xs font-bold text-[var(--v2-accent,#2EE66A)] mb-1">
                ✓ Delivery Fee Paid
              </p>
              <p className="text-[11px] text-[var(--v2-text-secondary,#A0A0A0)] leading-relaxed m-0">
                LKR 450 delivery fee has been confirmed. Your order will be dispatched shortly!
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
            <Link
              href="/collections/products"
              className="flex-1 py-3.5 px-6 bg-[var(--v2-accent,#2EE66A)] text-[#0A0A0A] font-black uppercase tracking-widest text-xs rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
            >
              <span>Continue Shopping</span>
              <IoArrowForward size={16} />
            </Link>

            <Link
              href="/account"
              className="flex-1 py-3.5 px-6 bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] font-black uppercase tracking-widest text-xs rounded-full flex items-center justify-center gap-2 hover:border-[var(--v2-accent,#2EE66A)] transition-all"
            >
              Go to Account
            </Link>
          </div>

          <p className="mt-8 text-[10px] text-[var(--v2-text-muted,#666666)] font-extrabold uppercase tracking-widest m-0">
            Confirmation receipt sent to {order.customer?.email}
          </p>
        </div>
      </main>

      {/* Interactive High-Risk Decision Modal */}
      <PrepaidFeeDecisionModal
        isOpen={showModal}
        order={order}
        onPayNow={handlePayFeeNow}
        onDismiss={() => {
          setShowModal(false);
          setIsDismissed(true);
        }}
      />
    </div>
  );
}
