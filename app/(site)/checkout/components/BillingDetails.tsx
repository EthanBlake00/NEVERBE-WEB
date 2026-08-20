"use client";
import React from "react";
import { Customer } from "@/interfaces";
import { Form, Input, Checkbox, Row, Col, Typography } from "antd";

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
    <section className="flex flex-col items-start w-full mx-auto md:px-0 px-2">
      <Typography.Title
        level={4}
        className="uppercase tracking-tighter mb-6 text-primary-dark"
        style={{ margin: 0, fontWeight: 900 }}
      >
        Billing Address
      </Typography.Title>

      <Row gutter={[16, 0]} className="w-full">
        <Col xs={24} md={12}>
          <Form.Item
            name="first_name"
            label={
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                First Name *
              </span>
            }
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
          >
            <Input
              size="large"
              placeholder="John"
              className="px-4 rounded-xl text-sm font-bold"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="last_name"
            label={
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                Last Name *
              </span>
            }
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}
          >
            <Input
              size="large"
              placeholder="Doe"
              className="px-4 rounded-xl text-sm font-bold"
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="address"
            label={
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                Address *
              </span>
            }
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input
              size="large"
              placeholder="House No, Street Name"
              className="px-4 rounded-xl text-sm font-bold"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="city"
            label={
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                City *
              </span>
            }
            rules={[{ required: true, message: "Please input your city!" }]}
          >
            <Input
              size="large"
              placeholder="Colombo"
              className="px-4 rounded-xl text-sm font-bold"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="zip"
            label={
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                Postal Code
              </span>
            }
          >
            <Input
              size="large"
              placeholder="00700"
              className="px-4 rounded-xl text-sm font-bold"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="email"
            label={
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                Email *
              </span>
            }
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              size="large"
              placeholder="john@example.com"
              className="px-4 rounded-xl text-sm font-bold"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            name="phone"
            label={
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                Phone *
              </span>
            }
            rules={[
              { required: true, message: "Please input your phone number!" },
              {
                pattern: /^07\d{8}$/,
                message:
                  "Must be a valid Sri Lankan mobile number (e.g., 07XXXXXXXX)",
              },
            ]}
          >
            <Input
              size="large"
              placeholder="07XXXXXXXX"
              className="px-4 rounded-xl text-sm font-bold"
              onBlur={(e) => onPhoneBlur?.(e.target.value)}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item
            name="country"
            label={
              <span className="text-[10px] font-black uppercase tracking-widest text-muted">
                Country
              </span>
            }
            initialValue="Sri Lanka"
          >
            <Input
              size="large"
              disabled
              className="px-4 rounded-xl font-bold cursor-not-allowed"
            />
          </Form.Item>
        </Col>
      </Row>

      <div className="flex items-center gap-3 mt-2">
        <Checkbox
          id="saveAddress"
          checked={saveAddress}
          onChange={(e) => setSaveAddress(e.target.checked)}
        >
          <span className="text-sm font-bold uppercase tracking-wide text-primary-dark font-display">
            Save this information for next time
          </span>
        </Checkbox>
      </div>
    </section>
  );
};

export default BillingDetails;
