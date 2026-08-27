import Link from "next/link";
import { IoHelpCircleOutline, IoRefresh } from "react-icons/io5";
import FailAnimationComponent from "@/app/(site)/checkout/fail/components/FailAnimationComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transaction Failed | Neverbe",
};

const Page = ({
  searchParams,
}: {
  searchParams: { orderId?: string; error?: string };
}) => {
  const errorMsg = searchParams.error
    ? decodeURIComponent(searchParams.error)
    : "Transaction_Declined";

  return (
    <main className="w-full min-h-screen bg-[var(--v2-bg-surface,#141414)] text-[var(--v2-text-primary,#F5F5F5)] pt-28 pb-20 px-4 md:px-8 flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-xl animate-fadeIn v2-glass p-8 sm:p-12 rounded-3xl border border-[var(--v2-glass-border,rgba(255,255,255,0.08))]">
        {/* Animation */}
        <FailAnimationComponent />

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-none mb-3 text-rose-500 m-0">
          Order Failed
        </h1>

        <p className="text-xs sm:text-sm text-[var(--v2-text-secondary,#A0A0A0)] font-medium mb-6 leading-relaxed m-0">
          We couldn't process your transaction. This might be due to a network issue or a payment gateway decline.
        </p>

        {/* Error Code */}
        <div className="inline-block px-4 py-1.5 bg-rose-500/10 border border-rose-500/30 rounded-full mb-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 m-0">
            Error: {errorMsg}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full">
          <Link
            href="/checkout"
            className="flex-1 py-3.5 px-6 bg-[var(--v2-accent,#2EE66A)] !text-[var(--v2-accent-text)] font-black uppercase tracking-widest text-xs rounded-full flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
          >
            <IoRefresh size={16} />
            <span>Try Again</span>
          </Link>

          <Link
            href="/contact"
            className="flex-1 py-3.5 px-6 bg-[var(--v2-glass-bg,rgba(255,255,255,0.04))] border border-[var(--v2-glass-border,rgba(255,255,255,0.1))] text-[var(--v2-text-primary,#F5F5F5)] font-black uppercase tracking-widest text-xs rounded-full flex items-center justify-center gap-2 hover:border-[var(--v2-accent,#2EE66A)] transition-all"
          >
            <IoHelpCircleOutline size={18} />
            <span>Contact Support</span>
          </Link>
        </div>

        {/* Footer Link */}
        <div className="mt-8">
          <Link
            href="/"
            className="text-[10px] font-black uppercase tracking-widest text-[var(--v2-text-muted,#666666)] hover:text-[var(--v2-accent,#2EE66A)] transition-colors"
          >
            Return to Home Page
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Page;
