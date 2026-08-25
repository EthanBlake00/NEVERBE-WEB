"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import { Form, Modal, Flex } from "antd";
import { FiX, FiAlertTriangle, FiArrowRight, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { evaluateCustomerFraudRisk, CompositeRiskResult } from "@/actions/thirdPartyRiskAction";
import BillingDetails from "./BillingDetails";
import ShippingDetails from "./ShippingDetails";
import PaymentDetails from "@/app/(site)/checkout/components/PaymentDetails";
import CheckoutLoader from "@/components/CheckoutLoader";
import toast from "react-hot-toast";
import { Customer } from "@/interfaces";
import { auth } from "@/firebase/firebaseClient";
import { signInAnonymously } from "firebase/auth";
import { usePayment } from "@/hooks/usePayment";
import usePromotions from "@/hooks/usePromotions";
import axiosInstance from "@/actions/axiosInstance";
import PrepaidFeeDecisionModal from "./PrepaidFeeDecisionModal";
import PrepaidFeeBanner from "./PrepaidFeeBanner";

const formatSriLankanPhoneNumber = (phone: string) => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    return `+94${cleaned.slice(1)}`;
  }
  if (cleaned.startsWith("94") && cleaned.length === 11) {
    return `+${cleaned}`;
  }
  if (cleaned.length === 9) {
    return `+94${cleaned}`;
  }
  return phone;
};

const createCustomerFromForm = (values: any): Customer => {
  const name = `${values.first_name || ""} ${values.last_name || ""}`.trim();
  return {
    name,
    email: values.email || "",
    phone: formatSriLankanPhoneNumber(values.phone || ""),
    address: values.address || "",
    city: values.city || "",
    zip: values.zip || "",
    id: window.crypto.randomUUID().toLowerCase(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const CheckoutForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const [form] = Form.useForm();

  // Onboarding Flow Step State (1: Contact & Shipping, 2: Billing & Notes, 3: Payment & Place Order)
  const [currentStep, setCurrentStep] = useState<number>(1);

  usePromotions();

  const bagItems = useSelector((state: RootState) => state.bag.bag);
  const couponDiscount = useSelector(
    (state: RootState) => state.bag.couponDiscount,
  );
  const promotionDiscount =
    useSelector((state: RootState) => state.bag.promotionDiscount) || 0;
  const promotionIds = useSelector(
    (state: RootState) => state.bag.promotionIds,
  );
  const user = auth?.currentUser;

  const [paymentType, setPaymentType] = useState<string>("");
  const [paymentTypeId, setPaymentTypeId] = useState<string>("");
  const [paymentFee, setPaymentFee] = useState<number>(0);
  const [merchantFee, setMerchantFee] = useState<number>(0);
  const [shippingSameAsBilling, setShippingSameAsBilling] = useState(true);
  const [saveAddress, setSaveAddress] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Dual-Engine Fraud Risk Check State
  const [riskResult, setRiskResult] = useState<CompositeRiskResult | null>(null);
  const [isEvaluatingRisk, setIsEvaluatingRisk] = useState(false);

  const evaluateFullFraudRisk = async (overrideValues?: any): Promise<CompositeRiskResult | null> => {
    const formValues = overrideValues || form.getFieldsValue();
    if (!formValues.phone && !formValues.email && !formValues.address) return null;
    setIsEvaluatingRisk(true);
    try {
      const payload = {
        phone: formValues.phone || "",
        email: formValues.email || "",
        first_name: formValues.first_name || "",
        last_name: formValues.last_name || "",
        address: formValues.address || "",
        city: formValues.city || "",
        zip: formValues.zip || "",
      };

      let resData: CompositeRiskResult | null = null;
      try {
        const apiRes = await axiosInstance.post("/web/fraud-check", payload);
        if (apiRes.data?.success && apiRes.data?.data) {
          resData = apiRes.data.data;
        }
      } catch (apiErr) {
        console.warn("[CheckoutForm] Web API /web/fraud-check fallback to server action:", apiErr);
      }

      if (!resData) {
        resData = await evaluateCustomerFraudRisk(payload);
      }

      setRiskResult(resData);
      if (resData?.isHighRisk) {
        toast.error("High delivery risk flagged. Delivery fee prepayment (Rs. 450) is required for COD.", { duration: 6000 });
      }
      return resData;
    } catch (e) {
      console.warn("Fraud evaluation error", e);
      return null;
    } finally {
      setIsEvaluatingRisk(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("[CheckoutAuth] Anonymous sign-in failed:", error);
        toast.error("Authentication failed. Please refresh the page.");
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  const initialCustomerState: Customer = {
    id: user?.uid || "",
    name: user?.displayName || "",
    email: user?.email || "",
    phone: user?.phoneNumber || "",
    address: "",
    city: "",
    zip: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [billingCustomer, setBillingCustomer] =
    useState<Customer>(initialCustomerState);
  const [shippingCustomer, setShippingCustomer] =
    useState<Partial<Customer> | null>(null);

  const [shippingCost, setShippingCost] = useState<number>(0);

  useEffect(() => {
    const fetchShipping = async () => {
      try {
        if (bagItems.length === 0) {
          setShippingCost(0);
          return;
        }
        const formData = new FormData();
        formData.append("data", JSON.stringify({ items: bagItems }));
        const res = await axiosInstance.post(
          "/web/shipping/calculate",
          formData,
        );
        const data = res.data;
        setShippingCost(data.cost || 0);
      } catch (error) {
        console.error("Failed to fetch shipping cost", error);
      }
    };
    fetchShipping();
  }, [bagItems]);

  const {
    isProcessing,
    otpState,
    calculateTotals,
    buildOrderPayload,
    processPayment,
    handleOTPVerification,
    handleResendOTP,
    closeOTPModal,
    openOTPModal,
    prepaidFeeState,
    payPrepaidFeeNow,
    dismissPrepaidFeeModal,
  } = usePayment({
    paymentMethodId: paymentTypeId,
    paymentMethodName: paymentType,
    paymentFee: paymentFee,
    merchantFee: merchantFee,
  });

  const [otp, setOtp] = useState("");

  useEffect(() => {
    const fetchAutofill = async () => {
      if (user && !user.isAnonymous) {
        try {
          const token = await auth.currentUser?.getIdToken();
          const res = await axiosInstance.get("/web/customers/autofill", {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          if (res.data) {
            const { billing } = res.data;
            if (billing) {
              setBillingCustomer(prev => ({
                ...prev,
                address: billing.address || "",
                city: billing.city || "",
                phone: billing.phone || "",
              }));
            }
          }
        } catch (e) {
          console.warn("Autofill fetch error", e);
        }
      }
    };
    fetchAutofill();
  }, [user]);

  const validateStep1 = async () => {
    try {
      await form.validateFields(["first_name", "last_name", "phone", "email", "address", "city"]);
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error("Please fill in all required contact and address fields.");
    }
  };

  const validateStep2 = async () => {
    try {
      const values = form.getFieldsValue();
      await evaluateFullFraudRisk(values);
    } catch (err) {
      console.warn("Risk eval warning", err);
    } finally {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePaymentSubmit = async (values: any) => {
    try {
      if (otpState.pendingOrder) {
        openOTPModal();
        return;
      }

      const newBilling = createCustomerFromForm(values);
      const userId = user?.uid || null;

      const orderCustomer: Customer = {
        ...newBilling,
        ...(shippingSameAsBilling
          ? {
              shippingName: newBilling.name,
              shippingAddress: newBilling.address,
              shippingCity: newBilling.city,
              shippingZip: newBilling.zip,
              shippingPhone: newBilling.phone,
            }
          : {
              shippingName: shippingCustomer?.shippingName || newBilling.name,
              shippingAddress: shippingCustomer?.shippingAddress || newBilling.address,
              shippingCity: shippingCustomer?.shippingCity || newBilling.city,
              shippingZip: shippingCustomer?.shippingZip || newBilling.zip,
              shippingPhone: shippingCustomer?.shippingPhone || newBilling.phone,
            }),
      };

      let currentRisk = riskResult;
      if (!currentRisk) {
        currentRisk = await evaluateFullFraudRisk(values);
      }

      const totals = calculateTotals(
        bagItems,
        couponDiscount,
        promotionDiscount,
        shippingCost,
      );

      const newOrder = buildOrderPayload(
        orderCustomer,
        bagItems,
        totals,
        userId,
        {
          appliedPromotionId: promotionIds[0] || null,
          appliedPromotionIds: promotionIds,
        },
        undefined,
        currentRisk?.isHighRisk
          ? {
              riskStatus: "HIGH_RISK",
              ipqsFraudScore: currentRisk.fraudScore,
              ipqsRiskLevel: currentRisk.riskLevel,
              ipqsLineType: currentRisk.lineType,
              ipqsReasons: currentRisk.reasons,
            }
          : undefined
      );

      await processPayment(newOrder, orderCustomer);
    } catch (err: any) {
      console.error("Payment Submission Error:", err);
      toast.error("Failed to process order. Please try again.");
    }
  };

  if (isCheckingAuth || !user) {
    return <CheckoutLoader />;
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto">
      <Form
        form={form}
        layout="vertical"
        onFinish={handlePaymentSubmit}
        onFinishFailed={() => {
          if (otpState.pendingOrder) {
            openOTPModal();
          }
        }}
        requiredMark={false}
        initialValues={{
          first_name: billingCustomer?.name?.split(" ")[0] || "",
          last_name: billingCustomer?.name?.split(" ").slice(1).join(" ") || "",
          address: billingCustomer?.address || "",
          city: billingCustomer?.city || "",
          zip: billingCustomer?.zip || "",
          email: billingCustomer?.email || "",
          phone: billingCustomer?.phone || "",
          country: "Sri Lanka",
        }}
        className="w-full"
      >
        {/* --- FULL WIDTH ONBOARDING WIZARD CARD --- */}
        <div className="v2-glass p-4 sm:p-6 md:p-8 rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] shadow-2xl space-y-6 sm:space-y-8">
          {/* --- STEP WIZARD PROGRESS BAR --- */}
          <div className="border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))] pb-4 sm:pb-6">
            <div className="flex items-center justify-between gap-2 mb-2">
              {/* Step 1 Pill */}
              <div
                onClick={() => setCurrentStep(1)}
                className={`flex items-center gap-2 cursor-pointer transition-all ${
                  currentStep === 1
                    ? "text-[var(--v2-accent,#2EE66A)] font-black"
                    : currentStep > 1
                    ? "text-[var(--v2-text-primary,#F5F5F5)]"
                    : "text-[var(--v2-text-muted,#666666)] opacity-60"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                    currentStep === 1
                      ? "bg-[var(--v2-accent,#2EE66A)] text-[var(--v2-accent-text,#0A0A0A)] shadow-md"
                      : currentStep > 1
                      ? "bg-[var(--v2-accent,#2EE66A)]/20 text-[var(--v2-accent,#2EE66A)] border border-[var(--v2-accent,#2EE66A)]/50"
                      : "bg-[var(--v2-glass-bg)] border border-[var(--v2-glass-border)] text-[var(--v2-text-muted)]"
                  }`}
                >
                  {currentStep > 1 ? <FiCheckCircle size={14} /> : "1"}
                </div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold hidden sm:inline">Shipping</span>
              </div>

              <div className="h-0.5 flex-1 mx-2 bg-[var(--v2-glass-border,rgba(255,255,255,0.1))] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--v2-accent,#2EE66A)] transition-all duration-500"
                  style={{ width: currentStep >= 2 ? "100%" : "0%" }}
                />
              </div>

              {/* Step 2 Pill */}
              <div
                onClick={() => currentStep >= 2 && setCurrentStep(2)}
                className={`flex items-center gap-2 ${currentStep >= 2 ? "cursor-pointer" : "cursor-not-allowed"} transition-all ${
                  currentStep === 2
                    ? "text-[var(--v2-accent,#2EE66A)] font-black"
                    : currentStep > 2
                    ? "text-[var(--v2-text-primary,#F5F5F5)]"
                    : "text-[var(--v2-text-muted,#666666)] opacity-60"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                    currentStep === 2
                      ? "bg-[var(--v2-accent,#2EE66A)] text-[var(--v2-accent-text,#0A0A0A)] shadow-md"
                      : currentStep > 2
                      ? "bg-[var(--v2-accent,#2EE66A)]/20 text-[var(--v2-accent,#2EE66A)] border border-[var(--v2-accent,#2EE66A)]/50"
                      : "bg-[var(--v2-glass-bg)] border border-[var(--v2-glass-border)] text-[var(--v2-text-muted)]"
                  }`}
                >
                  {currentStep > 2 ? <FiCheckCircle size={14} /> : "2"}
                </div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold hidden sm:inline">Billing &amp; Notes</span>
              </div>

              <div className="h-0.5 flex-1 mx-2 bg-[var(--v2-glass-border,rgba(255,255,255,0.1))] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--v2-accent,#2EE66A)] transition-all duration-500"
                  style={{ width: currentStep === 3 ? "100%" : "0%" }}
                />
              </div>

              {/* Step 3 Pill */}
              <div
                className={`flex items-center gap-2 transition-all ${
                  currentStep === 3
                    ? "text-[var(--v2-accent,#2EE66A)] font-black"
                    : "text-[var(--v2-text-muted,#666666)] opacity-60"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                    currentStep === 3
                      ? "bg-[var(--v2-accent,#2EE66A)] text-[var(--v2-accent-text,#0A0A0A)] shadow-md"
                      : "bg-[var(--v2-glass-bg)] border border-[var(--v2-glass-border)] text-[var(--v2-text-muted)]"
                  }`}
                >
                  3
                </div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold hidden sm:inline">Payment &amp; Place Order</span>
              </div>
            </div>
          </div>

          {/* --- STEP 1 FORM CONTENT: CONTACT & SHIPPING --- */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <BillingDetails
                saveAddress={saveAddress}
                setSaveAddress={setSaveAddress}
                customer={billingCustomer}
                onPhoneBlur={evaluateFullFraudRisk}
              />

              <div className="pt-6 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))] flex justify-end">
                <button
                  type="button"
                  onClick={validateStep1}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--v2-accent,#2EE66A)] text-[var(--v2-accent-text,#0A0A0A)] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
                >
                  <span>Continue to Billing &amp; Notes</span>
                  <FiArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* --- STEP 2 FORM CONTENT: BILLING & DELIVERY NOTES --- */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <ShippingDetails
                shippingSameAsBilling={shippingSameAsBilling}
                setShippingSameAsBilling={setShippingSameAsBilling}
                shippingCustomer={shippingCustomer}
                setShippingCustomer={setShippingCustomer}
              />

              <div className="pt-6 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))] flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[var(--v2-glass-bg)] border border-[var(--v2-glass-border)] text-[var(--v2-text-primary,#F5F5F5)] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:border-[var(--v2-accent,#2EE66A)] transition-all cursor-pointer"
                >
                  <FiArrowLeft size={16} />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={validateStep2}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--v2-accent,#2EE66A)] text-[var(--v2-accent-text,#0A0A0A)] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
                >
                  <span>Continue to Payment</span>
                  <FiArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* --- STEP 3 FORM CONTENT: PAYMENT METHOD & ORDER SUMMARY --- */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <span className="v2-section-label text-[9px] m-0">STEP 3 OF 3</span>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-full bg-[var(--v2-glass-bg)] border border-[var(--v2-glass-border)] text-[var(--v2-text-primary,#F5F5F5)] font-bold text-xs uppercase tracking-wider flex items-center gap-2 hover:border-[var(--v2-accent,#2EE66A)] transition-all cursor-pointer"
                >
                  <FiArrowLeft size={14} />
                  <span>Back to Billing</span>
                </button>
              </div>

              {riskResult?.isHighRisk && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-800">
                  <FiAlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider">High Delivery Risk Flagged</p>
                    <p className="text-xs mt-1 font-medium leading-relaxed">
                      {riskResult.noticeMessage || "Due to high return/spam risk on past network activity, delivery fee prepayment (Rs. 450) is required for COD orders."}
                    </p>
                  </div>
                </div>
              )}

              <PaymentDetails
                setPaymentType={setPaymentType}
                paymentType={paymentType || ""}
                setPaymentTypeId={setPaymentTypeId}
                setPaymentFee={setPaymentFee}
                setMerchantFee={setMerchantFee}
                selectedPaymentFee={paymentFee}
                shippingCost={shippingCost}
                isHighRisk={riskResult?.isHighRisk}
              />
            </div>
          )}
        </div>
      </Form>

      {/* OTP Verification Modal */}
      <Modal
        open={otpState.showModal && !!otpState.pendingOrder}
        onCancel={() => {
          closeOTPModal();
          setOtp("");
        }}
        footer={null}
        centered
        width={420}
        closeIcon={<FiX size={20} className="text-[var(--v2-text-primary,#F5F5F5)]" />}
        maskClosable={false}
        className="v2-modal"
        styles={{
          body: {
            padding: "32px",
            borderRadius: "24px",
            background: "var(--v2-bg-surface,#141414)",
            border: "1px solid var(--v2-glass-border,rgba(255,255,255,0.08))",
            color: "var(--v2-text-primary,#F5F5F5)",
          },
          mask: {
            backdropFilter: "blur(16px)",
            background: "var(--v2-backdrop-bg, rgba(10, 10, 10, 0.8))",
          },
        }}
      >
        <Flex vertical align="center" gap={8} className="text-center">
          <span className="v2-section-label text-[9px] mb-0.5">SECURITY VERIFICATION</span>
          <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0">
            Verify Number
          </h2>
          <p className="text-xs text-[var(--v2-text-secondary,#A0A0A0)] font-medium m-0">
            Enter the 6-digit code sent to {otpState.pendingOrder?.customer.phone}
          </p>

          <Flex vertical gap={16} className="w-full mt-6">
            <input
              type="tel"
              value={otp}
              disabled={otpState.isVerifying}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              className="w-full h-14 text-center text-2xl tracking-[0.5em] font-extrabold border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] rounded-2xl focus:border-[var(--v2-accent,#2EE66A)] outline-none transition-colors text-[var(--v2-text-primary,#F5F5F5)] placeholder:text-[var(--v2-text-muted,#666666)]"
              maxLength={6}
            />
            <button
              type="button"
              onClick={() => handleOTPVerification(otp)}
              disabled={otpState.isVerifying}
              className="w-full h-14 rounded-full bg-[var(--v2-accent,#2EE66A)] text-[var(--v2-accent-text,#0A0A0A)] font-black uppercase tracking-widest text-xs transition-all hover:opacity-90 active:scale-95 border-none cursor-pointer shadow-lg"
            >
              {otpState.isVerifying ? "Verifying..." : "Confirm Order"}
            </button>

            <button
              type="button"
              onClick={() =>
                handleResendOTP(otpState.pendingOrder!.customer.phone)
              }
              disabled={otpState.cooldown > 0 || otpState.isResending}
              className="text-xs font-black uppercase tracking-widest text-[var(--v2-text-secondary,#A0A0A0)] hover:text-[var(--v2-accent,#2EE66A)] transition-all border-none bg-transparent cursor-pointer p-0"
            >
              {otpState.cooldown > 0
                ? `Resend in ${otpState.cooldown}s`
                : otpState.isResending
                ? "Sending..."
                : "Resend Code"}
            </button>
          </Flex>
        </Flex>
      </Modal>

      {isProcessing && <CheckoutLoader />}

      {/* Persistent Banner if dismissed */}
      {prepaidFeeState.isDismissed && prepaidFeeState.order && (
        <PrepaidFeeBanner
          order={prepaidFeeState.order}
          onPayNow={() => payPrepaidFeeNow(prepaidFeeState.order!)}
        />
      )}

      {/* Interactive High-Risk Delivery Fee Decision Modal */}
      <PrepaidFeeDecisionModal
        isOpen={prepaidFeeState.showModal}
        order={prepaidFeeState.order}
        onPayNow={() => payPrepaidFeeNow(prepaidFeeState.order!)}
        onDismiss={dismissPrepaidFeeModal}
      />
    </div>
  );
};

export default CheckoutForm;
