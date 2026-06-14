import "@/app/globals.css";
import Link from "next/link";
import { Metadata } from "next";

export const metadata = {
  title: "404 - Page Not Found | Neverbe",
};

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-primary-dark font-sans selection:bg-primary/20">
      {/* Container */}
      <div className="text-center max-w-lg w-full space-y-6">
        {/* 404 - Massive & Tight */}
        <h1 className="text-[120px] md:text-[160px] leading-none font-bold tracking-tighter select-none">
          404
        </h1>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-medium uppercase tracking-tight text-primary-dark">
            We can't find that page.
          </h2>
          <p className="text-primary-dark text-sm md:text-base leading-relaxed max-w-md mx-auto">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-bold uppercase tracking-wider rounded-full transition-all shadow-md hover:shadow-lg"
          >
            Return Home
          </Link>
          <Link
            href="/collections/new-arrivals"
            className="inline-flex items-center justify-center px-8 py-3 bg-surface border border-default hover:bg-surface-2 text-primary-dark text-sm font-bold uppercase tracking-wider rounded-full transition-all shadow-md hover:shadow-lg"
          >
            Shop New Arrivals
          </Link>
        </div>
      </div>

      {/* Footer link */}
      <p className="absolute bottom-10 text-xs text-muted font-medium uppercase tracking-wide">
        Need help?{" "}
        <Link
          href="/contact"
          className="text-primary-dark underline underline-offset-4 decoration-accent hover:decoration-primary transition-all"
        >
          Contact Us
        </Link>
      </p>
    </div>
  );
};

export default NotFound;
