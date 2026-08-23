/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Ignore TS errors during build
    typescript: {
        ignoreBuildErrors: true,
    },

    // output: "standalone",

    // Enable gzip + brotli compression
    compress: true,

    // Remove console.* calls in production
    compiler: {
        removeConsole: process.env.NODE_ENV === "production",
    },

    // Optimize images (Firebase Storage + Google Cloud)
    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "firebasestorage.googleapis.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                pathname: "/**",
            },
        ],
    },

    // Experimental features supported in Next.js 16
    experimental: {
        webpackBuildWorker: false,
        optimizePackageImports: ["lodash", "date-fns"],
        serverActions: {
            bodySizeLimit: "2mb",
        },
    },

    async redirects() {
        return [
            {
                source: "/collections/deals",
                destination: "/collections/offers",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
