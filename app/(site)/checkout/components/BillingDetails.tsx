"use client";
import React from "react";
import { Customer } from "@/interfaces";
import { Form, Input, Checkbox, Row, Col } from "antd";

interface BillingDetailsProps {
  saveAddress: boolean;
  setSaveAddress: React.Dispatch<React.SetStateAction<boolean>>;
  customer: Customer | null;
  onPhoneBlur?: (phone: string) => void;
}

const BillingDetails: React.FC<BillingDetailsProps> = ({
  saveAddress,
  setSaveAddress,
  customer,
  onPhoneBlur,
}) => {
  return (
    <section className="v2-glass p-6 md:p-8 rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] w-full">
      <div className="mb-6 border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))] pb-4">
        <span className="v2-section-label text-[9px] mb-0.5">STEP 1</span>
        <h2 className="text-xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0">
          Billing &amp; Contact Details
        </h2>
      </div>

      <Row gutter={[16, 0]} className="w-full">
        <Col xs={24} md={12}>
          <Form.Item
            name="first_name"
            label={
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-secondary,#A0A0A0)]">
                First Name *
              </span>
            }
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
          >
            <Input
              placeholder="John"
              className="h-12 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))]! border-[var(--v2-glass-border,rgba(255,255,255,0.1))]! text-[var(--v2-text-primary,#F5F5F5)]! font-bold text-xs"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="last_name"
            label={
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-secondary,#A0A0A0)]">
                Last Name *
              </span>
            }
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}
          >
            <Input
              placeholder="Doe"
              className="h-12 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))]! border-[var(--v2-glass-border,rgba(255,255,255,0.1))]! text-[var(--v2-text-primary,#F5F5F5)]! font-bold text-xs"
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="address"
            label={
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-secondary,#A0A0A0)]">
                Street Address *
              </span>
            }
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input
              placeholder="House No, Street Name, Apartment"
              className="h-12 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))]! border-[var(--v2-glass-border,rgba(255,255,255,0.1))]! text-[var(--v2-text-primary,#F5F5F5)]! font-bold text-xs"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="city"
            label={
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-secondary,#A0A0A0)]">
                City *
              </span>
            }
            rules={[{ required: true, message: "Please input your city!" }]}
          >
            <Input
              placeholder="Colombo"
              className="h-12 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))]! border-[var(--v2-glass-border,rgba(255,255,255,0.1))]! text-[var(--v2-text-primary,#F5F5F5)]! font-bold text-xs"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="phone"
            label={
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-secondary,#A0A0A0)]">
                Phone Number *
              </span>
            }
            rules={[
              { required: true, message: "Please input your phone number!" },
            ]}
          >
            <Input
              placeholder="077 123 4567"
              onBlur={(e) => onPhoneBlur && onPhoneBlur(e.target.value)}
              className="h-12 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))]! border-[var(--v2-glass-border,rgba(255,255,255,0.1))]! text-[var(--v2-text-primary,#F5F5F5)]! font-bold text-xs"
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="email"
            label={
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-secondary,#A0A0A0)]">
                Email Address *
              </span>
            }
            rules={[
              { required: true, message: "Please input your email address!" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input
              placeholder="your@email.com"
              className="h-12 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))]! border-[var(--v2-glass-border,rgba(255,255,255,0.1))]! text-[var(--v2-text-primary,#F5F5F5)]! font-bold text-xs"
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Checkbox
            checked={saveAddress}
            onChange={(e) => setSaveAddress(e.target.checked)}
            className="text-xs font-bold text-[var(--v2-text-secondary,#A0A0A0)] uppercase tracking-wider"
          >
            Save this address for fast 1-click checkout
          </Checkbox>
        </Col>
      </Row>
    </section>
  );
};

export default BillingDetails;
