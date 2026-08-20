"use client";

import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import toast from "react-hot-toast";

import { AppDispatch, RootState } from "@/redux/store";
import { clearBag } from "@/redux/bagSlice/bagSlice";
import { BagItem } from "@/interfaces/BagItem";
import { Customer, Order } from "@/interfaces";
import {
  addNewOrder,
  initiateKOKOPayment,
  initiatePayHerePayment,
  requestOTP,
  verifyOTP,
  sendCODOrderNotifications,
  generateServerOrderId,
} from "@/actions/orderAction";
import {
  calculateFee,
  calculateShippingCost,
  calculateTotal,
  calculateTotalDiscount,
  calculateTransactionFeeCharge,
} from "@/utils/bagCalculations";

// Payment method IDs
const PAYMENT_METHOD_IDS = {
  COD: "PM-001",
  PAYHERE: "PM-003",
  KOKO: "PM-006",
} as const;

interface PaymentTotals {
  subtotal: number;
  itemDiscount: number;
  couponDiscount: number;
  promotionDiscount: number;
  shippingFee: number;
  paymentFee: number;
  total: number;
}

interface OTPState {
  showModal: boolean;
  pendingOrder: Order | null;
  isVerifying: boolean;
  isResending: boolean;
  cooldown: number;
}

interface UsePaymentOptions {
  paymentMethodId: string;
  paymentMethodName: string;
  paymentFee: number;
  merchantFee?: number;
}

interface UsePaymentReturn {
  // State
  isProcessing: boolean;
  error: string | null;
  orderId: string;
  otpState: OTPState;

  // Totals
  calculateTotals: (
    bagItems: BagItem[],
    couponDiscount: number,
    promotionDiscount: number,
    shippingFeeOverride?: number,
  ) => PaymentTotals;

  // Order building
  buildOrderPayload: (
    customer: Customer,
    bagItems: BagItem[],
    totals: PaymentTotals,
    userId: string | null,
    promotionData?: {
      appliedPromotionId: string | null;
      appliedPromotionIds: string[];
    },
    customOrderId?: string,
    riskData?: {
      riskStatus?: "NORMAL" | "HIGH_RISK";
      ipqsFraudScore?: number;
      ipqsRiskLevel?: string;
      ipqsLineType?: string;
      ipqsReasons?: string[];
    },
  ) => Order;

  // Payment processing
  processPayment: (order: Order, customer: Customer) => Promise<void>;

  // OTP handlers
  handleOTPVerification: (otp: string) => Promise<void>;
  handleResendOTP: (phoneNumber: string) => Promise<void>;
  closeOTPModal: () => void;
  openOTPModal: () => void;
  resetOTPState: () => void;
}

/**
 * Helper to determine the type of operating system ordering.
 */
const getDeviceSystem = (): string => {
  if (typeof window === "undefined") return "Website";

  const userAgent = window.navigator.userAgent.toLowerCase();

  if (/android/i.test(userAgent)) return "Android Web";
  if (/ipad|iphone|ipod/.test(userAgent)) return "iOS Web";
  if (/macintosh|mac os x/i.test(userAgent)) return "Mac Web";
  if (/windows/i.test(userAgent)) return "Windows Web";
  if (/linux/i.test(userAgent)) return "Linux Web";

  return "Website";
};

/**
 * usePayment - Centralized hook for all checkout payment logic
 * Handles PayHere, KOKO, and COD payment flows using Server-Generated Order IDs
 */
export const usePayment = (options: UsePaymentOptions): UsePaymentReturn => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const couponDiscount = useSelector(
    (state: RootState) => state.bag.couponDiscount,
  );
  const couponCode = useSelector((state: RootState) => state.bag.couponCode);

  // State
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string>("");

  // OTP state for COD
  const [otpState, setOtpState] = useState<OTPState>({
    showModal: false,
    pendingOrder: null,
    isVerifying: false,
    isResending: false,
    cooldown: 0,
  });

  const calculateTotals = useCallback(
    (
      bagItems: BagItem[],
      couponDisc: number,
      promotionDisc: number = 0,
      shippingFeeOverride?: number,
    ): PaymentTotals => {
      const itemDiscount = calculateTotalDiscount(bagItems);
      const shippingFee =
        shippingFeeOverride !== undefined
          ? shippingFeeOverride
          : calculateShippingCost(bagItems);
      const paymentFee = calculateFee(options.paymentFee || 0, bagItems);
      const rawSubtotal = calculateTotal(bagItems);
      const subtotal = rawSubtotal - itemDiscount + shippingFee + paymentFee;
      const total = subtotal - couponDisc - promotionDisc;

      return {
        subtotal,
        itemDiscount,
        couponDiscount: couponDisc,
        promotionDiscount: promotionDisc,
        shippingFee,
        paymentFee,
        total,
      };
    },
    [options.paymentFee],
  );

  /**
   * Build order payload for submission using Server-Generated Order ID
   */
  const buildOrderPayload = useCallback(
    (
      customer: Customer,
      bagItems: BagItem[],
      totals: PaymentTotals,
      userId: string | null,
      promotionData?: {
        appliedPromotionId: string | null;
        appliedPromotionIds: string[];
      },
      customOrderId?: string,
      riskData?: {
        riskStatus?: "NORMAL" | "HIGH_RISK";
        ipqsFraudScore?: number;
        ipqsRiskLevel?: string;
        ipqsLineType?: string;
        ipqsReasons?: string[];
      },
    ): Order => {
      const finalOrderId = customOrderId || activeOrderId || "PENDING";
      return {
        orderId: finalOrderId,
        paymentId: "",
        userId: userId || "anonymous-user",
        customer,
        items: bagItems as any,
        total: totals.total,
        paymentMethod: options.paymentMethodName,
        paymentMethodId: options.paymentMethodId,
        fee: totals.paymentFee,
        shippingFee: totals.shippingFee,
        transactionFeeCharge: calculateTransactionFeeCharge(
          bagItems,
          options.merchantFee || 0,
          totals.paymentFee,
          totals.shippingFee,
        ),
        paymentStatus: "Pending",
        status: "Processing",
        from: getDeviceSystem(),
        discount:
          totals.itemDiscount + totals.couponDiscount + totals.promotionDiscount,
        couponCode: couponCode || undefined,
        couponDiscount: totals.couponDiscount,
        promotionDiscount: totals.promotionDiscount,
        appliedPromotionId: promotionData?.appliedPromotionId || undefined,
        appliedPromotionIds: promotionData?.appliedPromotionIds,
        riskStatus: riskData?.riskStatus || "NORMAL",
        ipqsFraudScore: riskData?.ipqsFraudScore,
        ipqsRiskLevel: riskData?.ipqsRiskLevel,
        ipqsLineType: riskData?.ipqsLineType,
        ipqsReasons: riskData?.ipqsReasons,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },
    [activeOrderId, options, couponCode],
  );

  /**
   * Submit form to external payment gateway
   */
  const submitExternalForm = (
    action: string,
    payload: Record<string, string>,
  ) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = action;
    form.style.display = "none";

    Object.entries(payload).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  /**
   * Process PayHere Payment
   */
  const processPayHere = async (order: Order, customer: Customer) => {
    const amountFormatted = parseFloat((order.total ?? 0).toString())
      .toLocaleString("en-US", { minimumFractionDigits: 2 })
      .replace(/,/g, "");

    const [firstName, ...lastNameParts] = customer.name.split(" ");
    const payload = {
      orderId: order.orderId,
      amount: amountFormatted,
      firstName,
      lastName: lastNameParts.join(" ") || firstName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      items: `${order.items.length} Products`,
    };

    const payherePayload = await initiatePayHerePayment(payload);
    return payherePayload;
  };

  /**
   * Process KOKO Payment
   */
  const processKOKO = async (order: Order, customer: Customer) => {
    const amountFormatted = parseFloat((order.total ?? 0).toString())
      .toLocaleString("en-US", { minimumFractionDigits: 2 })
      .replace(/,/g, "");

    const [firstName, ...lastNameParts] = customer.name.split(" ");
    const payload = {
      orderId: order.orderId,
      amount: amountFormatted,
      firstName,
      lastName: lastNameParts.join(" ") || firstName,
      email: customer.email,
      description: `${order.items.length} products`,
    };

    const kokoPayload = await initiateKOKOPayment(payload);
    return kokoPayload;
  };

  /**
   * Process COD Payment - initiates OTP flow with Server Order ID
   */
  const processCOD = async (order: Order, customer: Customer) => {
    if (!executeRecaptcha) {
      throw new Error("Recaptcha not ready");
    }

    const token = await executeRecaptcha("request_otp");
    await requestOTP(customer.phone, token);

    setOtpState({
      showModal: true,
      pendingOrder: order,
      isVerifying: false,
      isResending: false,
      cooldown: 60,
    });

    // Start cooldown timer
    const timer = setInterval(() => {
      setOtpState((prev) => {
        if (prev.cooldown <= 1) {
          clearInterval(timer);
          return { ...prev, cooldown: 0 };
        }
        return { ...prev, cooldown: prev.cooldown - 1 };
      });
    }, 1000);

    toast.success("OTP sent successfully!");
  };

  /**
   * Main payment processor - fetches Server-Generated Order ID before processing
   */
  const processPayment = useCallback(
    async (orderData: Order, customer: Customer) => {
      if (!executeRecaptcha) {
        setError("Recaptcha not ready");
        return;
      }

      setIsProcessing(true);
      setError(null);

      try {
        // 1. Fetch Official Server Order ID with ERP Prefix (ORD-)
        const serverOrderId = await generateServerOrderId();
        setActiveOrderId(serverOrderId);

        const orderWithServerId: Order = {
          ...orderData,
          orderId: serverOrderId,
        };

        // 2. Handle COD Flow
        if (options.paymentMethodId?.toUpperCase() === PAYMENT_METHOD_IDS.COD) {
          await processCOD(orderWithServerId, customer);
          return;
        }

        // 3. Handle PayHere / KOKO Gateways
        const token = await executeRecaptcha("new_order");

        switch (options.paymentMethodId?.toUpperCase()) {
          case PAYMENT_METHOD_IDS.KOKO: {
            const kokoPayload = await processKOKO(orderWithServerId, customer);
            await addNewOrder(orderWithServerId, token);
            dispatch(clearBag());
            submitExternalForm(
              process.env.NEXT_PUBLIC_KOKO_REDIRECT_URL || "",
              kokoPayload,
            );
            break;
          }

          case PAYMENT_METHOD_IDS.PAYHERE: {
            const payherePayload = await processPayHere(orderWithServerId, customer);
            await addNewOrder(orderWithServerId, token);
            dispatch(clearBag());
            submitExternalForm(
              process.env.NEXT_PUBLIC_PAYHERE_URL || "",
              payherePayload,
            );
            break;
          }

          default:
            throw new Error("Invalid payment method selected");
        }
      } catch (err: any) {
        console.error("Payment Error:", err);
        const serverMessage = err.response?.data?.message;
        setError(serverMessage || err.message || "Payment failed");
        toast.error(serverMessage || "Payment failed. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    },
    [executeRecaptcha, options.paymentMethodId, dispatch],
  );

  /**
   * Handle OTP verification for COD
   */
  const handleOTPVerification = useCallback(
    async (otp: string) => {
      if (!otpState.pendingOrder || !executeRecaptcha) return;

      setOtpState((prev) => ({ ...prev, isVerifying: true }));

      try {
        await verifyOTP(otpState.pendingOrder.customer.phone, otp);

        const token = await executeRecaptcha("finalize_cod");
        await addNewOrder(otpState.pendingOrder, token);
        await sendCODOrderNotifications(otpState.pendingOrder.orderId!, token);

        dispatch(clearBag());
        router.replace(`/checkout/success/${otpState.pendingOrder.orderId}`);
      } catch (err: any) {
        console.error("OTP Verification Error:", err);
        const serverMessage = err.response?.data?.message;
        toast.error(serverMessage || err.message || "Invalid OTP");
      } finally {
        setOtpState((prev) => ({ ...prev, isVerifying: false }));
      }
    },
    [otpState.pendingOrder, executeRecaptcha, dispatch, router],
  );

  /**
   * Handle OTP resend
   */
  const handleResendOTP = useCallback(
    async (phoneNumber: string) => {
      if (!executeRecaptcha) {
        toast.error("Recaptcha not ready");
        return;
      }

      setOtpState((prev) => ({ ...prev, isResending: true }));

      try {
        const token = await executeRecaptcha("request_otp");
        await requestOTP(phoneNumber, token);
        setOtpState((prev) => ({ ...prev, cooldown: 60 }));

        // Start cooldown timer
        const timer = setInterval(() => {
          setOtpState((prev) => {
            if (prev.cooldown <= 1) {
              clearInterval(timer);
              return { ...prev, cooldown: 0 };
            }
            return { ...prev, cooldown: prev.cooldown - 1 };
          });
        }, 1000);

        toast.success("OTP sent successfully!");
      } catch (err: any) {
        console.error("OTP Resend Error:", err);
        const serverMessage = err.response?.data?.message;
        toast.error(serverMessage || err.message || "Failed to resend OTP");
      } finally {
        setOtpState((prev) => ({ ...prev, isResending: false }));
      }
    },
    [executeRecaptcha],
  );

  const closeOTPModal = useCallback(() => {
    setOtpState((prev) => ({ ...prev, showModal: false }));
  }, []);

  const openOTPModal = useCallback(() => {
    setOtpState((prev) => ({ ...prev, showModal: true }));
  }, []);

  const resetOTPState = useCallback(() => {
    setOtpState({
      showModal: false,
      pendingOrder: null,
      isVerifying: false,
      isResending: false,
      cooldown: 0,
    });
  }, []);

  return {
    isProcessing,
    error,
    orderId: activeOrderId,
    otpState,
    calculateTotals,
    buildOrderPayload,
    processPayment,
    handleOTPVerification,
    handleResendOTP,
    closeOTPModal,
    openOTPModal,
    resetOTPState,
  };
};
