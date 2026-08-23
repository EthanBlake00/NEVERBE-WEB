"use client";

import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  linkWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/firebase/firebaseClient";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import ComponentLoader from "@/components/ComponentLoader";
import { motion } from "framer-motion";
import { IoChevronBackOutline, IoLockClosedOutline, IoMailOutline, IoPersonOutline } from "react-icons/io5";

const RegisterPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";
  const [loading, setLoading] = useState(false);

  const handleRegister = async (values: any) => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user && user.isAnonymous) {
        const credential = EmailAuthProvider.credential(
          values.email,
          values.password,
        );
        await linkWithCredential(user, credential);
        await updateProfile(user, {
          displayName: `${values.firstName} ${values.lastName}`.trim(),
        });
        toast.success("Account registered & history saved!");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password,
        );
        await updateProfile(userCredential.user, {
          displayName: `${values.firstName} ${values.lastName}`.trim(),
        });
        toast.success("Welcome to Neverbe!");
      }
      router.push(redirectUrl);
    } catch (err: any) {
      toast.error("Registration failed: " + (err.message || "Check details"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--v2-bg-surface,#141414)] text-[var(--v2-text-primary,#F5F5F5)] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--v2-accent,#2EE66A)]/5 rounded-full blur-3xl pointer-events-none" />

      {loading && <ComponentLoader />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[460px] relative z-10"
      >
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--v2-text-muted,#666666)] hover:text-[var(--v2-accent,#2EE66A)] transition-colors mb-8"
        >
          <IoChevronBackOutline size={16} /> <span>Back to Store</span>
        </Link>

        {/* Card */}
        <div className="v2-glass p-8 sm:p-10 rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] shadow-2xl">
          {/* Logo Branding */}
          <div className="flex flex-col items-center text-center mb-8">
            <Link href="/" className="mb-6 transition-opacity hover:opacity-80">
              <Image
                src="/logo.png"
                width={130}
                height={45}
                alt="Neverbe"
                priority
                className="brightness-0 invert"
              />
            </Link>
            <span className="v2-section-label mb-1">JOIN THE CLUB</span>
            <h1 className="text-2xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0">
              Create Account
            </h1>
            <p className="text-xs text-[var(--v2-text-secondary,#A0A0A0)] mt-1 m-0">
              Unlock member rewards, early drops &amp; fast checkout.
            </p>
          </div>

          {/* Form */}
          <Form layout="vertical" onFinish={handleRegister} requiredMark={false}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Form.Item
                name="firstName"
                rules={[{ required: true, message: "First name" }]}
              >
                <Input
                  prefix={<IoPersonOutline className="text-[var(--v2-text-muted,#666666)] mr-1" size={16} />}
                  placeholder="FIRST NAME"
                  className="h-12 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))]! border-[var(--v2-glass-border,rgba(255,255,255,0.1))]! text-[var(--v2-text-primary,#F5F5F5)]! placeholder:text-[var(--v2-text-muted,#666666)] font-bold text-xs"
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                rules={[{ required: true, message: "Last name" }]}
              >
                <Input
                  prefix={<IoPersonOutline className="text-[var(--v2-text-muted,#666666)] mr-1" size={16} />}
                  placeholder="LAST NAME"
                  className="h-12 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))]! border-[var(--v2-glass-border,rgba(255,255,255,0.1))]! text-[var(--v2-text-primary,#F5F5F5)]! placeholder:text-[var(--v2-text-muted,#666666)] font-bold text-xs"
                />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input
                prefix={<IoMailOutline className="text-[var(--v2-text-muted,#666666)] mr-2" size={18} />}
                placeholder="EMAIL ADDRESS"
                className="h-12 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))]! border-[var(--v2-glass-border,rgba(255,255,255,0.1))]! text-[var(--v2-text-primary,#F5F5F5)]! placeholder:text-[var(--v2-text-muted,#666666)] font-bold text-xs"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter a password" },
                { min: 6, message: "At least 6 characters" },
              ]}
              className="mb-6"
            >
              <Input.Password
                prefix={<IoLockClosedOutline className="text-[var(--v2-text-muted,#666666)] mr-2" size={18} />}
                placeholder="PASSWORD (MIN. 6 CHARS)"
                className="h-12 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))]! border-[var(--v2-glass-border,rgba(255,255,255,0.1))]! text-[var(--v2-text-primary,#F5F5F5)]! placeholder:text-[var(--v2-text-muted,#666666)] font-bold text-xs"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              className="h-12 rounded-full bg-[var(--v2-accent,#2EE66A)]! text-[#0A0A0A]! font-black uppercase tracking-widest text-xs border-none hover:opacity-90 transition-all cursor-pointer shadow-lg mb-4"
            >
              Create Account
            </Button>
          </Form>

          {/* Login Redirect */}
          <div className="text-center mt-8 pt-6 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
            <p className="text-xs text-[var(--v2-text-secondary,#A0A0A0)] m-0">
              Already have an account?{" "}
              <Link
                href={`/account/login?redirect=${encodeURIComponent(redirectUrl)}`}
                className="text-[var(--v2-accent,#2EE66A)] font-black uppercase tracking-wider hover:underline ml-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
