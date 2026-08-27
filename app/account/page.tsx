"use client";

import React, { useState, useEffect } from "react";
import { auth } from "@/firebase/firebaseClient";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import { GoogleAuthProvider, linkWithPopup, signOut } from "firebase/auth";
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
  IoBagCheckOutline,
  IoLocationOutline,
  IoStarOutline,
  IoSettingsOutline,
  IoGridOutline,
} from "react-icons/io5";
import { motion } from "framer-motion";
import axiosInstance from "@/actions/axiosInstance";
import { Button, Alert } from "antd";

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

  const NAV_ITEMS = [
    { id: "dashboard", label: "Overview", icon: IoGridOutline },
    { id: "orders", label: "My Orders", icon: IoBagCheckOutline },
    { id: "addresses", label: "Addresses", icon: IoLocationOutline },
    { id: "reviews", label: "Reviews", icon: IoStarOutline },
    { id: "details", label: "Settings", icon: IoSettingsOutline },
  ];

  return (
    <div className="min-h-screen bg-[var(--v2-bg-surface,#141414)] text-[var(--v2-text-primary,#F5F5F5)] pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* TOP BAR / HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-6 pb-6 border-b border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <div 
                className="w-[120px] h-[40px] bg-[var(--v2-accent,#2EE66A)]"
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
            <div className="h-6 w-px bg-[var(--v2-glass-border,rgba(255,255,255,0.1))] hidden md:block"></div>
            <div>
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] m-0">
                My Account
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="px-4 py-2 rounded-full bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] text-xs font-extrabold uppercase tracking-wider text-[var(--v2-text-secondary,#A0A0A0)] hover:text-[var(--v2-text-primary,#F5F5F5)] hover:border-[var(--v2-accent,#2EE66A)] transition-all flex items-center gap-2"
            >
              <IoArrowBackOutline size={16} /> <span>Back to Store</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Logout</span> <IoLogOutOutline size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-12">
          {/* SIDEBAR NAVIGATION */}
          <aside className="lg:sticky lg:top-28 h-fit">
            {/* User Badge Card */}
            <div className="v2-glass p-5 rounded-3xl mb-6 border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--v2-accent,#2EE66A)] !text-[var(--v2-accent-text)] flex items-center justify-center font-black text-xl shadow-md">
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <IoPersonCircleOutline size={28} />}
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-accent,#2EE66A)] block">
                  VERIFIED MEMBER
                </span>
                <h3 className="text-sm font-extrabold text-[var(--v2-text-primary,#F5F5F5)] truncate m-0">
                  {user?.displayName || user?.email?.split("@")[0] || "Guest Member"}
                </h3>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex flex-row lg:flex-col items-center lg:items-start gap-2 overflow-x-auto hide-scrollbar pb-2 lg:pb-0">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-[var(--v2-accent,#2EE66A)] !text-[var(--v2-accent-text)] shadow-md"
                        : "bg-[var(--v2-glass-bg,rgba(255,255,255,0.03))] text-[var(--v2-text-secondary,#A0A0A0)] border border-[var(--v2-glass-border,rgba(255,255,255,0.06))] hover:border-[var(--v2-accent,#2EE66A)] hover:text-[var(--v2-text-primary,#F5F5F5)]"
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="min-h-[500px]">
            {isAnonymous && (
              <div className="v2-glass p-5 rounded-3xl border border-amber-400/30 mb-8 bg-amber-400/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mb-1">
                      Guest Profile Detected
                    </span>
                    <p className="text-xs text-[var(--v2-text-secondary,#A0A0A0)] m-0">
                      Your addresses and profile settings won't be saved permanently. Link your Google account to secure your data.
                    </p>
                  </div>
                  <button
                    onClick={handleGoogleLink}
                    className="px-5 py-2.5 rounded-full bg-amber-400 !text-[var(--v2-accent-text)] text-xs font-black uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer whitespace-nowrap"
                  >
                    Sync with Google
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-24">
                <ComponentLoader />
              </div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {activeTab === "dashboard" && user && (
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
                    <div className="v2-glass p-10 md:p-16 rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))] text-center max-w-xl mx-auto">
                      <IoShieldCheckmarkOutline
                        className="mx-auto text-[var(--v2-accent,#2EE66A)] mb-4"
                        size={60}
                      />
                      <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--v2-text-primary,#F5F5F5)] mb-2">
                        Secure Your Profile
                      </h2>
                      <p className="text-xs text-[var(--v2-text-secondary,#A0A0A0)] mb-8 leading-relaxed">
                        Link your Google account to save your order history and addresses permanently.
                      </p>
                      <button
                        onClick={handleGoogleLink}
                        className="w-full py-4 rounded-full bg-[var(--v2-accent,#2EE66A)] !text-[var(--v2-accent-text)] font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-3"
                      >
                        <span>Sync With Google Account</span>
                      </button>
                    </div>
                  ) : (
                    <AccountSettings user={user} dispatch={dispatch} />
                  ))}
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Account;
