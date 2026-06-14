"use client";

import React from "react";
import { Button } from "antd";
import { IoCloudDownloadOutline } from "react-icons/io5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toSafeLocaleString } from "@/actions/utilAction";
import { BusinessInfo } from "@/config/BusinessInfo";

interface EBillDownloadButtonProps {
  order: any;
}

const EBillDownloadButton: React.FC<EBillDownloadButtonProps> = ({ order }) => {
  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    const { orderId, createdAt, status, items, customer, paymentMethod, shippingFee, fee, discount } = order;

    // Header & Branding
    const img = new (window as any).Image();
    img.src = "/logo.png";
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(BusinessInfo.name, 50, 22);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120);
    doc.text(BusinessInfo.legalName, 50, 27);
    doc.text(`${BusinessInfo.addressLine1}, ${BusinessInfo.city}`, 50, 31);
    doc.text(`${BusinessInfo.email} | ${BusinessInfo.website}`, 50, 35);
    doc.text(`Tel: ${BusinessInfo.phone}`, 50, 39);

    try {
      doc.addImage(img, "PNG", 14, 12, 30, 30);
    } catch (e) {
      console.error("Logo not found", e);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(46, 158, 91); // Neverbe green
    doc.text("INVOICE", 196, 22, { align: "right" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text(`Order ID: #${orderId?.toUpperCase()}`, 196, 30, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Date: ${toSafeLocaleString(createdAt)}`, 196, 35, { align: "right" });

    doc.setDrawColor(230);
    doc.line(14, 48, 196, 48);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text("BILLED TO", 14, 58);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    doc.setFontSize(9);
    
    if (customer) {
      doc.text(customer.name || "Customer", 14, 64);
      const splitBilling = doc.splitTextToSize(customer.address || "", 80);
      doc.text(splitBilling, 14, 69);
      const billingCityY = 69 + (splitBilling.length * 4.5);
      doc.text(customer.city || "", 14, billingCityY);
      doc.text(`Phone: ${customer.phone || "-"}`, 14, billingCityY + 5);
    } else {
      doc.text("Walk-in Customer", 14, 64);
    }

    const tableColumn = ["Item Description", "Size", "Qty", "Price", "Discount", "Amount"];
    const tableRows = items.map((item: any) => {
      const netItemPrice = item.price - (item.discount || 0);
      const hasDiscount = (item.discount || 0) > 0;
      return [
        item.name,
        item.size || "-",
        item.quantity.toString(),
        `Rs. ${item.price.toLocaleString()}`,
        hasDiscount ? `- Rs. ${(item.discount * item.quantity).toLocaleString()}` : "-",
        `Rs. ${(netItemPrice * item.quantity).toLocaleString()}`,
      ];
    });

    const tableStartY = 85;
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: tableStartY,
      theme: "grid",
      headStyles: { fillColor: [46, 158, 91], textColor: [255, 255, 255], fontStyle: "bold", halign: "center" },
      columnStyles: { 2: { halign: "center" }, 3: { halign: "right" }, 4: { halign: "right" }, 5: { halign: "right" } },
      styles: { fontSize: 9, cellPadding: 4 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    const summaryX = 140;
    const valueX = 196;

    const rawSubtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    const itemDiscountTotal = items.reduce((sum: number, item: any) => sum + (item.discount || 0) * item.quantity, 0);
    const grandTotal = order.total || (rawSubtotal - itemDiscountTotal + (shippingFee || 0) + (fee || 0));

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("Subtotal:", summaryX, finalY);
    doc.text(`Rs. ${rawSubtotal.toLocaleString()}`, valueX, finalY, { align: "right" });

    let currentY = finalY + 7;
    if (itemDiscountTotal > 0) {
      doc.setTextColor(46, 158, 91);
      doc.text("Item Discounts:", summaryX, currentY);
      doc.text(`- Rs. ${itemDiscountTotal.toLocaleString()}`, valueX, currentY, { align: "right" });
      currentY += 7;
    }

    doc.setTextColor(100);
    doc.text("Shipping:", summaryX, currentY);
    doc.text(`Rs. ${(shippingFee || 0).toLocaleString()}`, valueX, currentY, { align: "right" });
    
    currentY += 10;
    doc.setDrawColor(230);
    doc.line(summaryX, currentY - 5, valueX, currentY - 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Grand Total:", summaryX, currentY);
    doc.text(`Rs. ${grandTotal.toLocaleString()}`, valueX, currentY, { align: "right" });

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("THANK YOU FOR SHOPPING WITH Neverbe!", 105, 285, { align: "center" });

    doc.save(`Neverbe-eBill-${orderId}.pdf`);
  };

  return (
    <Button
      onClick={handleDownloadInvoice}
      className="flex items-center gap-2 px-6 py-4 bg-white text-primary-dark border border-strong hover:border-accent hover:text-accent transition-all text-xs font-black uppercase tracking-widest rounded-full shadow-sm h-auto"
    >
      <IoCloudDownloadOutline size={18} />
      Download PDF
    </Button>
  );
};

export default EBillDownloadButton;
