"use client";
import { SHIPPING_FLAT_RATE_1, SHIPPING_FLAT_RATE_2 } from "@/constants";
import { BagItem } from "@/interfaces/BagItem";

export const generateOrderId = () => {
  const now = new Date();
  const datePart = now.toISOString().slice(2, 10).replace(/-/g, "");
  const randPart = Math.floor(100000 + Math.random() * 900000);
  return `${datePart}${randPart}`;
};

export const calculateTotalItems = (items: BagItem[]) => {
  return items.reduce((acc, item) => acc + item.quantity, 0);
};

export const calculateShippingCost = (items: BagItem[]) => {
  const totalItems = calculateTotalItems(items);
  if (totalItems > 1) {
    return SHIPPING_FLAT_RATE_2;
  } else if (totalItems === 0) {
    return 0;
  }
  return SHIPPING_FLAT_RATE_1;
};

export const calculateTotalDiscount = (items: BagItem[]) => {
  return items.reduce((acc, item) => acc + item.discount, 0);
};

export const calculateTotal = (items: BagItem[]) => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

export const calculateFee = (fee: number, items: BagItem[]) => {
  return parseFloat((calculateTotal(items) * (fee / 100)).toFixed(2));
};

export const calculateTransactionFeeCharge = (
  items: BagItem[],
  merchantFeePercent: number,
  flatCustomerFee: number,
  shippingOverride?: number,
) => {
  const shipping =
    shippingOverride !== undefined
      ? shippingOverride
      : calculateShippingCost(items);
  const total =
    calculateTotal(items) -
    calculateTotalDiscount(items) +
    flatCustomerFee +
    shipping;
  const transactionFee = (total * (merchantFeePercent / 100)).toFixed(2);
  return parseFloat(transactionFee);
};

export const calculateSubTotal = (
  items: BagItem[],
  fee: number,
  shippingOverride?: number,
) => {
  const shipping =
    shippingOverride !== undefined
      ? shippingOverride
      : calculateShippingCost(items);
  return (
    calculateTotal(items) -
    calculateTotalDiscount(items) +
    shipping +
    calculateFee(fee, items)
  );
};

