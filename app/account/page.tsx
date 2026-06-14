"use client";
import React, { useState, useEffect } from "react";
import { auth, db } from "@/firebase/firebaseClient";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";

import Link from "next/link";
import { GoogleAuthProvider, linkWithPopup } from "firebase/auth";
import { signOut } from "@firebase/auth";
import { useRouter } from "next/navigation";
import ComponentLoader from "@/components/ComponentLoader";
import ProfileOverview from "./components/ProfileOverview";
import OrdersView from "./components/OrdersView";
import SavedAddresses from "./components/SavedAddresses";
import AccountSettings from "./components/AccountSettings";
import MyReviews from "./components/MyReviews";
import toast from "react-hot-toast";
import {
  IoLogOutOutline,
  IoArrowBackOutline,
  IoShieldCheckmarkOutline,
  IoPersonCircleOutline,
} from "react-icons/io5";
import { motion } from "framer-motion";
import axiosInstance from "@/actions/axiosInstance";
import { Button, Typography, Card, Alert } from "antd";

const { Title, Text } = Typography;

const Account = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.authSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (user?.uid) {
        try {
          const token = await auth.currentUser?.getIdToken();
          const headers = { Authorization: `Bearer ${token}` };

          // Fetch orders from backend
          const ordersRes = await axiosInstance.get("/web/orders", {
            headers,
          });
          if (ordersRes.data) {
            setOrders(ordersRes.data);
          }

          // Fetch addresses from backend
          const addressesRes = await axiosInstance.get("/web/customers/addresses", {
            headers,
          });
          if (addressesRes.data) {
            setAddresses(addressesRes.data);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (!loading && !user) router.push("/account/login");
  }, [loading, user, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleGoogleLink = async () => {
    const provider = new GoogleAuthProvider();
    if (auth.currentUser) {
      try {
        await linkWithPopup(auth.currentUser, provider);
        toast.success("Account synced with Google!");
      } catch (error: any) {
        toast.error("Sync failed: " + error.message);
      }
    }
  };

  const isAnonymous = user?.isAnonymous || false;

  return (
    <div className="min-h-screen bg-white text-primary-dark">
      <div className="max-w-content mx-auto px-4 lg:px-12 py-6 md:py-20">
        {/* TOP BAR / MOBILE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 lg:mb-16 gap-8 pb-8 border-b border-default lg:border-none">
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:opacity-70 transition-opacity">
              <Image
                src="/logo.png"
                width={120}
                height={40}
                alt="Neverbe"
                priority
              />
            </Link>
            <div className="h-8 w-px bg-border-default hidden md:block"></div>
            <Title
              level={1}
              className="text-2xl! font-display! font-black! uppercase! tracking-tighter! mb-0!"
            >
              My Account
            </Title>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xs font-bold uppercase tracking-widest text-muted hover:text-primary-dark transition-colors flex items-center gap-2"
            >
              <IoArrowBackOutline size={16} /> <span className="hidden sm:inline">Back to Store</span>
            </Link>
            <Button
              type="text"
              onClick={handleLogout}
              className="text-xs font-bold uppercase tracking-widest text-muted hover:text-error! hover:bg-transparent! transition-colors flex items-center gap-2 p-0 h-auto"
            >
              Logout <IoLogOutOutline size={16} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-20">
          {/* SIDEBAR / NAVIGATION */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="hidden lg:flex flex-col gap-6 mb-12 p-8 bg-surface-2 rounded-3xl border border-default">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-accent shadow-sm border border-default">
                  <IoPersonCircleOutline size={28} />
                </div>
                <div>
                  <Text className="block text-[10px] font-black uppercase tracking-widest text-muted">
                    Welcome Back,
                  </Text>
                  <Text className="block text-sm font-black text-primary-dark truncate max-w-[140px]">
                    {user?.displayName || user?.email?.split("@")[0] || "User"}
                  </Text>
                </div>
              </div>
            </div>

            <nav className="flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-2 border-b lg:border-none border-default pb-4 lg:pb-0 mb-8 lg:mb-0 overflow-x-auto hide-scrollbar">
              {[
                { id: "dashboard", label: "Overview" },
                { id: "orders", label: "My Orders" },
                { id: "addresses", label: "Addresses" },
                { id: "reviews", label: "Reviews" },
                { id: "details", label: "Settings" },
              ].map((item) => (
                <Button
                  type="text"
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`whitespace-nowrap lg:w-full lg:text-left lg:px-6 lg:py-4 h-auto text-sm font-bold uppercase tracking-widest transition-all relative hover:bg-transparent lg:hover:bg-surface-2! rounded-xl ${
                    activeTab === item.id
                      ? "text-primary-dark! lg:bg-surface-2! lg:text-accent!"
                      : "text-muted! hover:text-primary-dark!"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  {activeTab === item.id && (
                    <>
                      <motion.div
                        layoutId="underline"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-full lg:hidden"
                      />
                      <motion.div
                        layoutId="active-nav"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-accent rounded-full hidden lg:block"
                      />
                    </>
                  )}
                </Button>
              ))}
            </nav>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="animate-fade min-h-[400px]">
            {isAnonymous && (
              <Alert
                message={
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-1">
                    <div>
                      <Text className="block font-black uppercase tracking-widest text-[10px] text-warning mb-1">
                        Guest Profile Detected
                      </Text>
                      <Text className="text-xs font-semibold text-primary-dark">
                        Your addresses and profile settings won't be saved permanently. 
                        Link your Google account to secure your data.
                      </Text>
                    </div>
                    <Button 
                      type="primary" 
                      size="small"
                      onClick={handleGoogleLink}
                      className="bg-warning hover:bg-warning-hover! border-none text-dark font-black uppercase text-[10px] tracking-widest px-4 h-8 rounded-full shadow-sm"
                    >
                      Sync Now
                    </Button>
                  </div>
                }
                type="warning"
                showIcon={false}
                className="mb-12 rounded-2xl border-warning/20 bg-warning/5 overflow-hidden"
              />
            )}

            {loading ? (
              <div className="flex justify-center items-start py-20 relative h-40">
                <ComponentLoader />
              </div>
            ) : (
              <div className="w-full">
                {activeTab === "dashboard" && (
                  <ProfileOverview
                    user={user}
                    setActiveTab={setActiveTab}
                    ordersCount={orders.length}
                  />
                )}
                {activeTab === "orders" && <OrdersView orders={orders} />}
                {activeTab === "addresses" && (
                  <SavedAddresses
                    addresses={addresses}
                    setAddresses={setAddresses}
                    user={user}
                  />
                )}
                {activeTab === "reviews" && <MyReviews />}
                {activeTab === "details" &&
                  (user?.isAnonymous ? (
                    <Card
                      bordered={false}
                      className="bg-white rounded-3xl border border-default shadow-none"
                      bodyStyle={{ padding: "64px", textAlign: "center" }}
                    >
                      <IoShieldCheckmarkOutline
                        className="mx-auto text-accent mb-6"
                        size={60}
                      />
                      <Title
                        level={2}
                        className="text-3xl! font-display! font-black! uppercase! tracking-tighter! mb-4!"
                      >
                        Secure your profile
                      </Title>
                      <Text className="block text-muted max-w-md mx-auto mb-10 font-medium text-sm">
                        Link your Google account to save your orders and profile
                        permanently.
                      </Text>
                      <Button
                        type="default"
                        onClick={handleGoogleLink}
                        className="inline-flex h-auto items-center justify-center gap-4 bg-dark text-inverse px-10 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-accent! hover:text-dark! hover:border-accent! transition-all active:scale-95 border-none"
                      >
                        <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center p-1">
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
                          </svg>
                        </span>
                        Sync with Google
                      </Button>
                    </Card>
                  ) : (
                    <AccountSettings user={user} dispatch={dispatch} />
                  ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Account;
