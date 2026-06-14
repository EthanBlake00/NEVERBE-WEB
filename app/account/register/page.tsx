"use client";
import React, { useState } from "react";
import { Form, Input, Button, Typography, Row, Col } from "antd";
const { Title, Text } = Typography;
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithPopup,
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
import { IoChevronBackOutline, IoArrowForwardOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";

const RegisterPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/account";
  const [loading, setLoading] = useState(false);

  const handleGoogleRegister = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      if (auth.currentUser && auth.currentUser.isAnonymous) {
        try {
          await linkWithPopup(auth.currentUser, provider);
          toast.success("Account synced successfully");
          router.push(redirectUrl);
          return;
        } catch (linkError: any) {
          toast.error("Account already in use");
          setLoading(false);
          return;
        }
      }
      await signInWithPopup(auth, provider);
      router.push(redirectUrl);
    } catch (err: any) {
      toast.error("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

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
        toast.success("Account registered & history saved");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password,
        );
        await updateProfile(userCredential.user, {
          displayName: `${values.firstName} ${values.lastName}`.trim(),
        });
        toast.success("Welcome to Neverbe");
      }
      router.push(redirectUrl);
    } catch (err: any) {
      toast.error("Registration failed. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-primary-dark flex flex-col items-center justify-center px-6 relative">
      {loading && <ComponentLoader />}

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="mb-12 text-center flex flex-col items-center">
          <Link href="/" className="mb-10 transition-opacity hover:opacity-70">
            <Image
              src="/logo.png"
              width={130}
              height={45}
              alt="Neverbe"
              priority
            />
          </Link>

          <Title
            level={1}
            className="text-3xl! md:text-4xl! font-display! font-black! uppercase! tracking-tighter! mb-4!"
          >
            Create an Account
          </Title>
          <Text className="text-muted text-sm font-medium leading-relaxed max-w-[300px] block">
            Create your profile to unlock exclusive gear, faster checkout, and
            performance tracking.
          </Text>
        </div>

        <Form
          onFinish={handleRegister}
          layout="vertical"
          disabled={loading}
          className="space-y-4"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                rules={[{ required: true, message: "Required" }]}
                className="mb-0"
              >
                <Input
                  size="large"
                  placeholder="First Name"
                  className="w-full bg-white hover:bg-surface-2 focus:bg-white border-default focus:border-accent px-4 py-3 text-sm font-bold rounded-xl transition-all"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                rules={[{ required: true, message: "Required" }]}
                className="mb-0"
              >
                <Input
                  size="large"
                  placeholder="Last Name"
                  className="w-full bg-white hover:bg-surface-2 focus:bg-white border-default focus:border-accent px-4 py-3 text-sm font-bold rounded-xl transition-all"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Required" },
              { type: "email", message: "Invalid email" },
            ]}
            className="mb-0"
          >
            <Input
              size="large"
              placeholder="Email Address"
              className="w-full bg-white hover:bg-surface-2 focus:bg-white border-default focus:border-accent px-4 py-3 text-sm font-bold rounded-xl transition-all"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Required" },
              { min: 6, message: "Min 6 characters" },
            ]}
            className="mb-0"
          >
            <Input.Password
              size="large"
              placeholder="Password (Min. 6 Characters)"
              className="w-full bg-white hover:bg-surface-2 focus:bg-white border-default focus:border-accent px-4 py-3 text-sm font-bold rounded-xl transition-all"
            />
          </Form.Item>

          <Text className="text-[11px] text-muted text-center uppercase font-bold tracking-widest leading-relaxed py-4 px-6 block">
            By joining, you agree to our Privacy Policy and Terms of Use.
          </Text>
          <Button
            type="primary"
            htmlType="submit"
            disabled={loading}
            className="group w-full h-auto bg-accent text-white py-4 rounded-full font-display font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:bg-accent-hover shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-50 mt-4 border-none"
          >
            {loading ? "Creating Account..." : "Register"}
            <IoArrowForwardOutline
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Button>
        </Form>

        {/* Divider */}
        <div className="flex items-center gap-6 my-10">
          <div className="h-px bg-border-default flex-1"></div>
          <span className="text-[10px] font-black text-muted tracking-widest uppercase">
            Or
          </span>
          <div className="h-px bg-border-default flex-1"></div>
        </div>

        <Button
          onClick={handleGoogleRegister}
          type="default"
          disabled={loading}
          className="group w-full h-auto bg-white text-primary-dark py-4 rounded-full font-display font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:bg-surface-2 shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-50 border-default"
        >
          <FcGoogle size={24} />
          Register with Google
        </Button>

        {/* Login Link */}
        <div className="text-center mt-12">
          <Text className="text-muted text-xs font-bold uppercase tracking-wide">
            Already have an account?{" "}
            <Link
              href={`/account/login${
                redirectUrl !== "/account" ? `?redirect=${redirectUrl}` : ""
              }`}
              className="text-primary-dark font-black underline underline-offset-8 decoration-accent decoration-4 hover:decoration-primary transition-all ml-1"
            >
              Login.
            </Link>
          </Text>
        </div>
      </motion.div>

      {/* Return Home */}
      <div className="mt-16 relative z-10">
        <Link
          href="/"
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted hover:text-primary-dark transition-all"
        >
          <IoChevronBackOutline size={14} />
          Back to store
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
