"use client";

import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/firebase/firebaseClient";
import { sendPasswordResetLinkAction } from "@/actions/authAction";
import { Modal } from "antd";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import ComponentLoader from "@/components/ComponentLoader";
import { motion } from "framer-motion";
import { IoChevronBackOutline, IoLockClosedOutline, IoMailOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";

const AuthPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";
  const [loading, setLoading] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success("Welcome back to Neverbe");
      router.push(redirectUrl);
    } catch (err: any) {
      toast.error("Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = async (values: any) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast.success("Signed in successfully");
      router.push(redirectUrl);
    } catch (err: any) {
      toast.error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      toast.error("Please enter your email address.");
      return;
    }
    setResetLoading(true);
    try {
      await sendPasswordResetLinkAction(resetEmail);
      toast.success("Reset link sent to your email.");
      setResetModalVisible(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset link.");
    } finally {
      setResetLoading(false);
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
        className="w-full max-w-[420px] relative z-10"
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
            <span className="v2-section-label mb-1">MEMBER ACCESS</span>
            <h1 className="text-2xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0">
              Welcome Back
            </h1>
            <p className="text-xs text-[var(--v2-text-secondary,#A0A0A0)] mt-1 m-0">
              Sign in to manage your orders &amp; preferences.
            </p>
          </div>

          {/* Form */}
          <Form layout="vertical" onFinish={handleAuth} requiredMark={false}>
            <Form.Item
              name="email"
              rules={[{ required: true, message: "Please enter your email" }]}
            >
              <Input
                prefix={<IoMailOutline className="text-[var(--v2-text-muted,#666666)] mr-2" size={18} />}
                placeholder="EMAIL ADDRESS"
                className="h-12 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))]! border-[var(--v2-glass-border,rgba(255,255,255,0.1))]! text-[var(--v2-text-primary,#F5F5F5)]! placeholder:text-[var(--v2-text-muted,#666666)] font-bold text-xs"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please enter your password" }]}
              className="mb-2"
            >
              <Input.Password
                prefix={<IoLockClosedOutline className="text-[var(--v2-text-muted,#666666)] mr-2" size={18} />}
                placeholder="PASSWORD"
                className="h-12 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))]! border-[var(--v2-glass-border,rgba(255,255,255,0.1))]! text-[var(--v2-text-primary,#F5F5F5)]! placeholder:text-[var(--v2-text-muted,#666666)] font-bold text-xs"
              />
            </Form.Item>

            {/* Forgot Password Link */}
            <div className="flex justify-end mb-6">
              <button
                type="button"
                onClick={() => setResetModalVisible(true)}
                className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--v2-accent,#2EE66A)] hover:underline cursor-pointer bg-transparent border-none p-0"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              block
              className="h-12 rounded-full bg-[var(--v2-accent,#2EE66A)]! text-[#0A0A0A]! font-black uppercase tracking-widest text-xs border-none hover:opacity-90 transition-all cursor-pointer shadow-lg mb-4"
            >
              Sign In
            </Button>
          </Form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px flex-1 bg-[var(--v2-glass-border,rgba(255,255,255,0.08))]" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--v2-text-muted,#666666)]">
              OR CONTINUE WITH
            </span>
            <div className="h-px flex-1 bg-[var(--v2-glass-border,rgba(255,255,255,0.08))]" />
          </div>

          {/* Google SSO Button */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full h-12 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] hover:border-[var(--v2-accent,#2EE66A)] text-[var(--v2-text-primary,#F5F5F5)] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-3 transition-all cursor-pointer"
          >
            <FcGoogle size={20} />
            <span>Google Account</span>
          </button>

          {/* Register Redirect */}
          <div className="text-center mt-8 pt-6 border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
            <p className="text-xs text-[var(--v2-text-secondary,#A0A0A0)] m-0">
              Don't have an account?{" "}
              <Link
                href={`/account/register?redirect=${encodeURIComponent(redirectUrl)}`}
                className="text-[var(--v2-accent,#2EE66A)] font-black uppercase tracking-wider hover:underline ml-1"
              >
                Register Now
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <Modal
        title={
          <span className="font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)]">
            Reset Password
          </span>
        }
        open={resetModalVisible}
        onCancel={() => setResetModalVisible(false)}
        footer={null}
        centered
        className="v2-landing"
      >
        <div className="py-4 space-y-4">
          <p className="text-xs text-[var(--v2-text-secondary,#A0A0A0)] m-0 leading-relaxed">
            Enter your email address below and we will send you a password reset link.
          </p>
          <Input
            placeholder="ENTER YOUR EMAIL"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            className="h-12 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] font-bold text-xs"
          />
          <Button
            type="primary"
            onClick={handleResetPassword}
            loading={resetLoading}
            block
            className="h-12 rounded-full bg-[var(--v2-accent,#2EE66A)]! text-[#0A0A0A]! font-black uppercase tracking-widest text-xs border-none hover:opacity-90 cursor-pointer"
          >
            Send Reset Link
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AuthPage;
