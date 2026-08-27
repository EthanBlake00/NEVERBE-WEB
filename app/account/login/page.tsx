"use client";

import React, { useState, Suspense } from "react";
import { Form, Input, Button, Modal } from "antd";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "@/firebase/firebaseClient";
import { sendPasswordResetLinkAction } from "@/actions/authAction";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import ComponentLoader from "@/components/ComponentLoader";
import { motion } from "framer-motion";
import { IoChevronBackOutline, IoLockClosedOutline, IoMailOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";

const LoginForm = () => {
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
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute w-[800px] h-[800px] bg-[var(--v2-accent,#2EE66A)]/10 rounded-full blur-[120px]"
        />
        
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] translate-x-1/4 -translate-y-1/4"
        />

        {/* Floating Accent Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative z-10 v2-glass p-12 rounded-[40px] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] shadow-2xl max-w-md text-center backdrop-blur-xl bg-white/5 dark:bg-black/20"
        >
          <div className="w-16 h-16 bg-[var(--v2-accent,#2EE66A)] rounded-3xl mx-auto mb-6 flex items-center justify-center rotate-12 shadow-[0_0_40px_rgba(46,230,106,0.3)]">
            <IoLockClosedOutline size={28} className="text-[#0A0A0A] -rotate-12" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] mb-3 leading-tight">
            Seamless<br />Checkout.
          </h2>
          <p className="text-sm font-medium text-[var(--v2-text-secondary,#A0A0A0)] leading-relaxed m-0">
            Join the community to unlock faster checkout, exclusive member rewards, and early access to the latest drops.
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
              Welcome<br />Back.
            </h1>
            <p className="text-xs text-[var(--v2-text-secondary,#A0A0A0)] mt-3 m-0 max-w-sm">
              Sign in to manage your orders, saved addresses, and secure your wishlist.
            </p>
          </div>

          {/* Social Sign-In */}
          <Button
            onClick={handleGoogleLogin}
            block
            className="h-12 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))]! border border-[var(--v2-glass-border,rgba(255,255,255,0.1))]! text-[var(--v2-text-primary,#F5F5F5)]! font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-3 hover:border-[var(--v2-accent,#2EE66A)]! hover:bg-[var(--v2-accent,#2EE66A)]/5! transition-all mb-6 cursor-pointer shadow-sm"
          >
            <FcGoogle size={20} />
            <span>Continue with Google</span>
          </Button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-[var(--v2-glass-border,rgba(255,255,255,0.08))] w-full" />
            <span className="bg-[var(--v2-bg-surface,#141414)] px-4 text-[9px] font-black uppercase tracking-widest text-[var(--v2-text-muted,#666666)] absolute">
              OR WITH EMAIL
            </span>
          </div>

          {/* Login Form */}
          <Form layout="vertical" onFinish={handleAuth} requiredMark={false} className="space-y-3">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Enter a valid email" },
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
              rules={[{ required: true, message: "Please enter your password" }]}
              className="mb-0"
            >
              <Input.Password
                prefix={<IoLockClosedOutline size={18} className="text-[var(--v2-text-muted,#666666)] mr-3" />}
                placeholder="PASSWORD"
                className="h-12 px-4 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.02))] border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] font-bold text-xs hover:border-[var(--v2-text-muted,#666666)] focus:border-[var(--v2-accent,#2EE66A)] transition-colors"
              />
            </Form.Item>

            <div className="flex justify-end pt-1 pb-3">
              <button
                type="button"
                onClick={() => setResetModalVisible(true)}
                className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--v2-text-muted,#666666)] hover:text-[var(--v2-accent,#2EE66A)] transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              block
              className="h-12 rounded-full bg-[var(--v2-text-primary,#F5F5F5)]! text-[var(--v2-bg-surface,#141414)]! font-black uppercase tracking-widest text-xs border-none hover:bg-[var(--v2-accent,#2EE66A)]! hover:text-[#0A0A0A]! transition-all shadow-lg cursor-pointer mt-1"
            >
              Sign In
            </Button>
          </Form>

          {/* Footer Link */}
          <div className="text-center mt-6">
            <span className="text-[11px] font-bold text-[var(--v2-text-secondary,#A0A0A0)]">
              New to Neverbe?{" "}
            </span>
            <Link
              href={`/account/register?redirect=${encodeURIComponent(redirectUrl)}`}
              className="text-[11px] font-black uppercase tracking-wider text-[var(--v2-text-primary,#F5F5F5)] hover:text-[var(--v2-accent,#2EE66A)] transition-colors ml-1"
            >
              Create Account →
            </Link>
          </div>
        </motion.div>
      </div>

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
          <p className="text-xs font-medium text-[var(--v2-text-secondary,#A0A0A0)] m-0 leading-relaxed">
            Enter your email address below and we will send you a password reset link.
          </p>
          <Input
            placeholder="ENTER YOUR EMAIL"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            className="h-12 px-4 rounded-2xl bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] font-bold text-xs focus:border-[var(--v2-accent,#2EE66A)] transition-colors"
          />
          <Button
            type="primary"
            onClick={handleResetPassword}
            loading={resetLoading}
            block
            className="h-12 rounded-full bg-[var(--v2-accent,#2EE66A)]! text-[#0A0A0A]! font-black uppercase tracking-widest text-xs border-none hover:opacity-90 cursor-pointer shadow-lg mt-2"
          >
            Send Reset Link
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default function AuthPage() {
  return (
    <Suspense fallback={<ComponentLoader />}>
      <LoginForm />
    </Suspense>
  );
}
