"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import { Form, Input, Button, Row, Col, Modal, Flex, Typography } from "antd";
import { FiX, FiAlertTriangle } from "react-icons/fi";
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
const formatSriLankanPhoneNumber = (phone: string) => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // If it starts with 0 (e.g., 0771234567), replace 0 with +94
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    return `+94${cleaned.slice(1)}`;
  }

  // If it's already in 94 format (e.g., 94771234567), add +
  if (cleaned.startsWith("94") && cleaned.length === 11) {
    return `+${cleaned}`;
  }

  // If it's a 9 digit number without prefix (e.g. 771234567), add +94
  if (cleaned.length === 9) {
    return `+94${cleaned}`;
  }

  return phone;
};

const createCustomerFromForm = (values: any): Customer => {
  const name = `${values.first_name} ${values.last_name}`;
  return {
    name,
    email: values.email,
    phone: formatSriLankanPhoneNumber(values.phone),
    address: values.address,
    city: values.city,
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

  // Ensure promotions are calculated
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

  const evaluateFullFraudRisk = async () => {
    const formValues = form.getFieldsValue();
    if (!formValues.phone || formValues.phone.trim().length < 8) return;
    setIsEvaluatingRisk(true);
    try {
      const res = await evaluateCustomerFraudRisk({
        phone: formValues.phone || "",
        email: formValues.email || "",
        first_name: formValues.first_name || "",
        last_name: formValues.last_name || "",
        address: formValues.address || "",
        city: formValues.city || "",
        zip: formValues.zip || "",
      });
      setRiskResult(res);
      if (res.isHighRisk) {
        toast.error("High delivery risk flagged. Delivery fee prepayment (Rs. 450) is required for COD.", { duration: 6000 });
      }
    } catch (e) {
      console.warn("Fraud evaluation error", e);
    } finally {
      setIsEvaluatingRisk(false);
    }
  };

  // 1. Auth Guard: Ensure Anonymous Sign-in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!auth.currentUser) {
          console.log(
            "[CheckoutAuth] No user found, signing in anonymously...",
          );
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

  // Initialize billing customer with user data if available
  const initialCustomerState: Customer = {
    id: user?.uid || "", // Firebase user UID
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

  // Fetch dynamic shipping cost
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
        // Fallback logic could go here, but API handles defaults
      }
    };
    fetchShipping();
  }, [bagItems]);

  // Initialize Payment Hook
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
    resetOTPState,
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
            const { shipping, billing } = res.data;
            
            if (billing) {
              setBillingCustomer(prev => ({
                ...prev,
                address: billing.address,
                city: billing.city,
                phone: billing.phone,
              }));
              
              // Dynamically update form fields
              form.setFieldsValue({
                address: billing.address,
                city: billing.city,
                phone: billing.phone,
              });
            }
            
            if (shipping) {
              setShippingCustomer({
                shippingName: user.displayName || "",
                shippingAddress: shipping.address,
                shippingCity: shipping.city,
                shippingPhone: shipping.phone,
              });
              
              // If shipping and billing are different, turn off "Same as Billing"
              if (billing && (shipping.address !== billing.address || shipping.city !== billing.city)) {
                setShippingSameAsBilling(false);
              }
            }
          }
        } catch (error) {
          console.error("Autofill fetch failed", error);
        }
      }
    };
    fetchAutofill();
  }, [user]);

  const handlePaymentSubmit = async (values: any) => {
    try {
      // If we already have a pending order (e.g. they closed the modal), just reopen it
      if (otpState.pendingOrder) {
        openOTPModal();
        return;
      }

      // Validate Logic
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
              shippingName: shippingCustomer?.shippingName || "",
              shippingAddress: shippingCustomer?.shippingAddress || "",
              shippingCity: shippingCustomer?.shippingCity || "",
              shippingZip: shippingCustomer?.shippingZip || "",
              shippingPhone: shippingCustomer?.shippingPhone || "",
            }),
      };

      // 1. Calculate Totals
      const totals = calculateTotals(
        bagItems,
        couponDiscount,
        promotionDiscount,
        shippingCost,
      );

      // 2. Build Order Payload
      const newOrder = buildOrderPayload(
        orderCustomer,
        bagItems,
        totals,
        userId,
        {
          appliedPromotionId: promotionIds[0] || null, // Assuming first is primary if needed
          appliedPromotionIds: promotionIds,
        },
        undefined,
        riskResult?.isHighRisk
          ? {
              riskStatus: "HIGH_RISK",
              ipqsFraudScore: riskResult.fraudScore,
              ipqsRiskLevel: riskResult.riskLevel,
              ipqsLineType: riskResult.lineType,
              ipqsReasons: riskResult.reasons,
            }
          : undefined
      );

      console.log("New Order Payload:", newOrder);

      // 3. Process Payment (Delegated to hook)
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
    <>
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
        <Row
          gutter={[16, 32]}
          align="stretch"
          className="w-full mx-auto md:gutter-[32, 32]"
        >
          {/* --- LEFT COLUMN: FORMS --- */}
          <Col xs={24} lg={14}>
            <Flex vertical gap={24} className="md:gap-[40px]">
              <BillingDetails
                saveAddress={saveAddress}
                setSaveAddress={setSaveAddress}
                customer={billingCustomer}
                onPhoneBlur={evaluateFullFraudRisk}
              />

              <ShippingDetails
                shippingSameAsBilling={shippingSameAsBilling}
                setShippingSameAsBilling={setShippingSameAsBilling}
                shippingCustomer={shippingCustomer}
                setShippingCustomer={setShippingCustomer}
              />
            </Flex>
          </Col>

          {/* --- RIGHT COLUMN: SUMMARY & PAYMENT --- */}
          <Col xs={24} lg={10}>
            {riskResult?.isHighRisk && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-4 flex items-start gap-3 text-rose-800">
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
          </Col>
        </Row>
      </Form>

      <Modal
        open={otpState.showModal && !!otpState.pendingOrder}
        onCancel={() => {
          closeOTPModal();
          setOtp("");
        }}
        footer={null}
        centered
        width={400}
        closeIcon={<FiX size={24} />}
        maskClosable={false}
        className="performance-modal"
        styles={{
          body: {
            padding: "32px",
            borderRadius: "24px",
            background: "#ffffff",
          },
          mask: {
            backdropFilter: "blur(12px)",
            background: "rgba(255, 255, 255, 0.8)",
          },
        }}
      >
        <Flex vertical align="center" gap={8} className="text-center">
          <Typography.Title
            level={3}
            className="uppercase tracking-tighter mb-0"
            style={{ fontWeight: 900, margin: 0 }}
          >
            Verify Number
          </Typography.Title>
          <Typography.Text type="secondary" className="font-medium">
            Enter the code sent to {otpState.pendingOrder?.customer.phone}
          </Typography.Text>

          <Flex vertical gap={16} className="w-full mt-6">
            <Input
              type="tel"
              value={otp}
              disabled={otpState.isVerifying}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              className="w-full h-14 text-center text-2xl tracking-[0.5em] font-display font-black border-2 border-default bg-surface-2 rounded-xl focus:border-accent hover:border-accent outline-none transition-colors text-primary-dark"
              maxLength={6}
            />
            <Button
              type="primary"
              onClick={() => handleOTPVerification(otp)}
              loading={otpState.isVerifying}
              className="w-full font-display font-black uppercase tracking-widest text-xs transition-all hover:scale-105 shadow-sm"
              style={{
                background: "var(--color-accent)",
                border: "none",
                borderRadius: 99,
                color: "white",
                height: 56,
              }}
            >
              Confirm Order
            </Button>

            <Button
              type="link"
              onClick={() =>
                handleResendOTP(otpState.pendingOrder!.customer.phone)
              }
              disabled={otpState.isResending || otpState.cooldown > 0}
              className="text-xs font-black uppercase tracking-widest text-muted hover:text-accent transition-all p-0 h-auto"
            >
              {otpState.cooldown > 0
                ? `Resend in ${otpState.cooldown}s`
                : otpState.isResending
                  ? "Sending..."
                  : "Resend Code"}
            </Button>
          </Flex>
        </Flex>
      </Modal>

      {isProcessing && <CheckoutLoader />}
    </>
  );
};

export default CheckoutForm;
