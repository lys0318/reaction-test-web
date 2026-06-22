import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/ko",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

// Enables Cloudflare bindings (D1, KV, etc.) during `next dev` via the
// OpenNext adapter. No-op outside local development.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
