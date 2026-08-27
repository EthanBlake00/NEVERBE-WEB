"use client";

import React, { useState, Suspense } from "react";
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
import { IoChevronBackOutline, IoLockClosedOutline, IoMailOutline, IoPersonOutline, IoStarOutline } from "react-icons/io5";

const RegisterForm = () => {
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
    <div className="h-screen overflow-hidden bg-[var(--v2-bg-surface,#141414)] text-[var(--v2-text-primary,#F5F5F5)] flex">
      {loading && <ComponentLoader />}

      {/* LEFT COLUMN: VISUAL SPLASH */}
      <div className="hidden lg:flex w-1/2 relative bg-[#050505] items-center justify-center overflow-hidden">
        {/* Decorative Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]" 
          style={{ 
            backgroundImage: `radial-gradient(var(--v2-text-primary,#F5F5F5) 1px, transparent 1px)`, 
            backgroundSize: '40px 40px' 
          }} 
        />
        
        {/* Animated Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px]"
        />
        
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute w-[600px] h-[600px] bg-[var(--v2-accent,#2EE66A)]/5 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4"
        />

        {/* Floating Accent Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative z-10 v2-glass p-12 rounded-[40px] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] shadow-2xl max-w-md text-center backdrop-blur-xl bg-white/5 dark:bg-black/20"
        >
          <div className="w-16 h-16 bg-[var(--v2-text-primary,#F5F5F5)] rounded-3xl mx-auto mb-6 flex items-center justify-center -rotate-12 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            <IoStarOutline size={28} className="text-[#0A0A0A] rotate-12" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] mb-3 leading-tight">
            Never<br />Ordinary.
          </h2>
          <p className="text-sm font-medium text-[var(--v2-text-secondary,#A0A0A0)] leading-relaxed m-0">
            Create an account to track your orders, manage saved addresses, and stay updated on the latest arrivals.
          </p>
        </motion.div>
      </div>

      {/* RIGHT COLUMN: FORM */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-24 xl:px-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[440px] mx-auto my-auto"
        >
          {/* Logo Branding */}
          <div className="mb-6 sm:mb-8">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80 mb-4">
              <div 
                className="w-[110px] h-[38px] bg-[var(--v2-accent,#2EE66A)]"
                style={{
                  maskImage: 'url(/logo.png)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'left center',
                  WebkitMaskImage: 'url(/logo.png)',
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'left center',
                }}
              />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0 leading-none">
              Join the<br />Club.
            </h1>
            <p className="text-xs font-medium text-[var(--v2-text-secondary,#A0A0A0)] mt-3 m-0 max-w-sm">
              Create an account to unlock member rewards, early drops, and fast checkout.
            </p>
          </div>

          {/* Form */}
          <Form layout="vertical" onFinish={handleRegister} requiredMark={false} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Form.Item
                name="firstName"
                rules={[{ required: true, message: "Required" }]}
                className="mb-0"
              >
                <Input
                  prefix={<IoPersonOutline size={18} className="text-[var(--v2-text-muted,#666666)] mr-2" />}
                  placeholder="FIRST NAME"
                  className="h-12 px-4 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.02))] border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] font-bold text-xs hover:border-[var(--v2-text-muted,#666666)] focus:border-[var(--v2-accent,#2EE66A)] transition-colors"
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                rules={[{ required: true, message: "Required" }]}
                className="mb-0"
              >
                <Input
                  placeholder="LAST NAME"
                  className="h-12 px-4 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.02))] border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] font-bold text-xs hover:border-[var(--v2-text-muted,#666666)] focus:border-[var(--v2-accent,#2EE66A)] transition-colors"
                />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Required" },
                { type: "email", message: "Invalid email" },
              ]}
              className="mb-0"
            >
              <Input
                prefix={<IoMailOutline size={18} className="text-[var(--v2-text-muted,#666666)] mr-3" />}
                placeholder="EMAIL ADDRESS"
                className="h-12 px-4 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.02))] border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] font-bold text-xs hover:border-[var(--v2-text-muted,#666666)] focus:border-[var(--v2-accent,#2EE66A)] transition-colors"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Required" },
                { min: 6, message: "Min 6 chars" },
              ]}
              className="mb-0"
            >
              <Input.Password
                prefix={<IoLockClosedOutline size={18} className="text-[var(--v2-text-muted,#666666)] mr-3" />}
                placeholder="PASSWORD"
                className="h-12 px-4 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.02))] border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] font-bold text-xs hover:border-[var(--v2-text-muted,#666666)] focus:border-[var(--v2-accent,#2EE66A)] transition-colors"
              />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              className="h-12 rounded-full bg-[var(--v2-text-primary,#F5F5F5)]! text-[var(--v2-bg-surface,#141414)]! font-black uppercase tracking-widest text-xs border-none hover:bg-[var(--v2-accent,#2EE66A)]! hover:text-[#0A0A0A]! transition-all shadow-lg cursor-pointer mt-4"
            >
              Create Account
            </Button>
          </Form>

          {/* Footer Link */}
          <div className="text-center mt-6">
            <span className="text-[11px] font-bold text-[var(--v2-text-secondary,#A0A0A0)]">
              Already a member?{" "}
            </span>
            <Link
              href={`/account/login?redirect=${encodeURIComponent(redirectUrl)}`}
              className="text-[11px] font-black uppercase tracking-wider text-[var(--v2-text-primary,#F5F5F5)] hover:text-[var(--v2-accent,#2EE66A)] transition-colors ml-1"
            >
              Sign In →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<ComponentLoader />}>
      <RegisterForm />
    </Suspense>
  );
}
