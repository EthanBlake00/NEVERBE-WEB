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
    <main className="w-full min-h-screen bg-surface pt-10 md:pt-16 pb-20 px-4 md:px-8 flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-xl animate-fadeIn">
        {/* Animation */}
        <FailAnimationComponent />

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter leading-none mb-4 text-primary-dark">
          Order Failed
        </h1>

        <p className="text-lg text-muted font-medium mb-8 leading-relaxed">
          We couldn't process your transaction. This might be due to a network
          issue or a declined payment.
        </p>

        {/* Error Code Decoration */}
        <div className="inline-block px-4 py-2 bg-error/10 border border-error/30 rounded-full mb-10">
          <p className="text-xs font-black uppercase tracking-widest text-error">
            Error: {errorMsg}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
          {/* Retry Action */}
          <Link
            href="/checkout"
            className="flex-1 sm:flex-none py-4 px-8 bg-dark text-inverse font-display font-black uppercase tracking-widest hover:bg-accent hover:text-dark transition-all rounded-full flex items-center justify-center gap-2 shadow-custom hover:shadow-hover"
          >
            <IoRefresh size={18} />
            Try Again
          </Link>

          {/* Support Action */}
          <Link
            href="/pages/contact"
            className="flex-1 sm:flex-none py-4 px-8 border-2 border-dark text-primary-dark font-display font-black uppercase tracking-widest hover:bg-dark hover:text-inverse transition-all rounded-full flex items-center justify-center gap-2"
          >
            <IoHelpCircleOutline size={20} />
            Contact Support
          </Link>
        </div>

        {/* Footer Link */}
        <div className="mt-12">
          <Link
            href="/"
            className="text-[10px] font-black uppercase tracking-widest text-muted hover:text-accent transition-colors border-b border-transparent hover:border-accent pb-0.5"
          >
            Return to Home Page
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Page;
