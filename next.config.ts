import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  transpilePackages: ["@kahade/ui"],
  async headers() {
    return [
      // Aset ikon brand: tidak di-hash namanya, tapi jarang berubah — cache
      // lama immutable. (Vercel memberi /_next/static immutable otomatis;
      // file public/ default-nya max-age=0.)
      {
        source:
          "/:file(icon-16.png|icon-32.png|icon-192.png|icon-512.png|apple-touch-icon.png|favicon.svg)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      { source: "/:path*", headers: securityHeaders },
    ];
  },
};

export default nextConfig;
