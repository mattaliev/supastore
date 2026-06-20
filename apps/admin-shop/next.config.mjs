import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin(
  "./components/i18n/i18n.ts"
);

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "files.edgestore.dev",
        port: "",
      },
      {
        protocol: "https",
        hostname: "static.tildacdn.com",
        port: "",
      },
    ],
  },
  transpilePackages: ['lucide-react', '@supastore/lib']
};

export default withNextIntl(nextConfig);
