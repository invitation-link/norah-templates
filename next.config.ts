import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Content-Security-Policy", value: "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; form-action 'self'; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://www.googletagmanager.com https://www.clarity.ms https://pagead2.googlesyndication.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://analytics.google.com https://www.clarity.ms https://*.clarity.ms https://lumberjack.razorpay.com https://api.razorpay.com; frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://googleads.g.doubleclick.net; media-src 'self' blob: https:; worker-src 'self' blob:; upgrade-insecure-requests" },
    ] }];
  },
};

export default nextConfig;
