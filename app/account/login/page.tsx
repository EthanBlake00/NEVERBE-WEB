"use client";
import React, { useState } from "react";
import { FirebaseError } from "firebase/app";
import { Form, Input, ConfigProvider, Button, Typography } from "antd";
const { Title, Text } = Typography;
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
import { IoChevronBackOutline, IoArrowForward } from "react-icons/io5";
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
    <div className="min-h-screen bg-white text-primary-dark flex flex-col items-center justify-center px-6 relative">
      {loading && <ComponentLoader />}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] flex flex-col"
      >
        {/* Branding */}
        <div className="mb-12 flex flex-col items-center text-center">
          <Link href="/" className="mb-8 transition-opacity hover:opacity-70">
            <Image
              src="/logo.png"
              width={130}
              height={50}
              alt="Neverbe"
              priority
            />
          </Link>
          <Title
            level={1}
            className="text-3xl! font-display! font-black! uppercase! tracking-tighter! mb-3!"
          >
            Login
          </Title>
          <Text className="text-muted text-sm font-medium block">
            Enter your details to access your gear and orders.
          </Text>
        </div>

        {/* Auth Form */}
        <Form
          onFinish={handleAuth}
          layout="vertical"
          disabled={loading}
          className="space-y-4"
        >
          <div className="space-y-4">
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
              className="mb-0"
            >
              <Input
                size="large"
                placeholder="Email Address"
                className="w-full bg-white hover:bg-surface-2 focus:bg-white border-default focus:border-accent px-4 py-3 text-sm font-bold rounded-xl transition-all"
                name="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
              className="mb-0"
            >
              <Input.Password
                size="large"
                placeholder="Password"
                className="w-full bg-white hover:bg-surface-2 focus:bg-white border-default focus:border-accent px-4 py-3 text-sm font-bold rounded-xl transition-all"
                name="password"
              />
            </Form.Item>
          </div>

          <div className="flex justify-end pr-2">
            <Button
              type="link"
              onClick={() => setResetModalVisible(true)}
              className="text-[11px] font-bold uppercase tracking-widest text-muted hover:text-primary-dark transition-colors mt-2 p-0 h-auto"
            >
              Forgot Password?
            </Button>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            disabled={loading}
            className="group w-full h-auto bg-accent text-white py-4 rounded-full font-display font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:bg-accent-hover shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-50 mt-4 border-none"
          >
            {loading ? "Signing In..." : "Log In"}
            <IoArrowForward
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Button>
        </Form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-10">
          <div className="h-px bg-border-default flex-1"></div>
          <Text className="text-[10px] font-black text-muted tracking-widest uppercase">
            Or
          </Text>
          <div className="h-px bg-border-default flex-1"></div>
        </div>

        <Button
          onClick={handleGoogleLogin}
          type="default"
          className="w-full bg-white text-primary-dark border border-default flex items-center justify-center gap-4 py-6 rounded-full font-black uppercase text-xs tracking-widest hover:bg-surface-2 shadow-sm transition-all"
        >
          <FcGoogle size={22} />
          Continue with Google
        </Button>

        {/* Footer Links */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <Text className="text-xs font-semibold text-muted uppercase tracking-widest block">
            Don't have an account?
          </Text>
          <Link
            href={`/account/register?redirect=${encodeURIComponent(
              redirectUrl,
            )}`}
            className="text-xs font-black uppercase tracking-widest text-primary-dark hover:text-primary-dark underline underline-offset-4 decoration-accent decoration-2 transition-all"
          >
            Create an Account
          </Link>
        </div>
      </motion.div>

      {/* Return Link */}
      <div className="mt-16">
        <Link
          href="/"
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary-dark transition-all"
        >
          <IoChevronBackOutline size={14} />
          Return to Store
        </Link>
      </div>

      <Modal
        title={
          <Title level={4} className="uppercase font-black tracking-tighter mb-0!">
            Reset Password
          </Title>
        }
        open={resetModalVisible}
        onCancel={() => setResetModalVisible(false)}
        footer={null}
        centered
        className="reset-modal"
      >
        <div className="py-4 space-y-6">
          <Text className="text-muted text-sm font-medium">
            Enter your email address and we'll send you a link to reset your password.
          </Text>
          <Input
            size="large"
            placeholder="Email Address"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            className="w-full bg-surface-2 hover:bg-surface-2 focus:bg-white border-default focus:border-accent px-4 py-3 text-sm font-bold rounded-xl transition-all"
          />
          <Button
            onClick={handleResetPassword}
            loading={resetLoading}
            type="primary"
            className="w-full bg-accent text-white py-6 rounded-full font-display font-black uppercase tracking-widest text-xs shadow-md hover:bg-accent-hover border-none"
          >
            Send Reset Link
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AuthPage;
