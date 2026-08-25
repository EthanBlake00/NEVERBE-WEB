import { Order } from "@/interfaces/Order";
import { getIdToken } from "@/firebase/firebaseClient";
import axiosInstance from "./axiosInstance";

/**
 * Generate official Order ID from server (with active ERP prefix e.g. ORD-)
 */
export const generateServerOrderId = async (): Promise<string> => {
  try {
    const token = await getIdToken();
    const response = await axiosInstance.get("/web/orders/generate-id", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data && response.data.orderId) {
      return response.data.orderId;
    }
  } catch (e) {
    console.warn("Server order ID endpoint offline, generating server-pattern ID with ORD- prefix", e);
  }
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const randPart = Math.floor(100000 + Math.random() * 900000);
  return `${datePart}${randPart}`;
};

/**
 * Add new order
 */
export const addNewOrder = async (newOrder: Order, captchaToken: string) => {
  try {
    const token = await getIdToken();
    const formData = new FormData();
    formData.append("data", JSON.stringify(newOrder));
    const response = await axiosInstance.post("/web/orders", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (e) {
    throw e;
  }
};

/**
 * Initiate KOKO Payment
 */
export const initiateKOKOPayment = async (payload: any) => {
  try {
    const token = await getIdToken();
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    const response = await axiosInstance.post(
      "/web/ipg/koko/initiate",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (e) {
    throw e;
  }
};

/**
 * Initiate PayHere Payment
 */
export const initiatePayHerePayment = async (payload: any) => {
  try {
    const token = await getIdToken();
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    const response = await axiosInstance.post(
      "/web/ipg/payhere/initiate",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (e) {
    throw e;
  }
};

/**
 * Submit form to external payment gateway
 */
export const submitExternalForm = (
  action: string,
  payload: Record<string, string>,
) => {
  if (typeof window === "undefined") return;
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
 * Request OTP for COD verification
 */
export const requestOTP = async (phoneNumber: string, captchaToken: string) => {
  try {
    const token = await getIdToken();
    const formData = new FormData();
    formData.append("data", JSON.stringify({ phoneNumber, captchaToken }));
    const response = await axiosInstance.post(
      "/web/otp",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (e) {
    throw e;
  }
};

/**
 * Verify OTP for COD
 */
export const verifyOTP = async (phoneNumber: string, otp: string) => {
  try {
    const token = await getIdToken();
    const formData = new FormData();
    formData.append("data", JSON.stringify({ phoneNumber, otp }));
    const response = await axiosInstance.post(
      "/web/otp/verify",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (e) {
    throw e;
  }
};

/**
 * Send Notifications for COD
 */
export const sendCODOrderNotifications = async (
  orderId: string,
  capchaToken: string,
) => {
  try {
    const token = await getIdToken();
    const response = await axiosInstance.get(
      `/web/orders/${orderId}/cod/notifications?capchaToken=${capchaToken}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (e) {
    throw e;
  }
};

export const getOrderById = async (orderId: string) => {
  try {
    const res = await axiosInstance.get(`/web/orders/${orderId}`);
    const data = res.data;
    return data.data || data;
  } catch (e) {
    throw e;
  }
};

/**
 * Process a delivery fee prepayment for high-risk COD orders
 */
export const processDeliveryFeePrepayment = async (order: Order, customer: any) => {
  try {
    const token = await getIdToken();
    const payload = {
      orderId: `${order.orderId}-FEE`,
      amount: "450",
      firstName: customer.firstName || customer.first_name || "",
      lastName: customer.lastName || customer.last_name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      city: customer.city || "",
      items: `Delivery Prepayment Fee for Order #${order.orderId}`,
    };
    
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));
    
    const response = await axiosInstance.post(
      "/web/ipg/payhere/initiate",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (e) {
    throw e;
  }
};
