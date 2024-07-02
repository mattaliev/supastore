import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

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
        pathname: "/8yckhv8sa2g0jniq/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/ditch-bucket/**"
      },
      {
        protocol: "https",
        hostname: "static.tildacdn.com",
        port: "",
      },
    ],
  },
  transpilePackages: ["@ditch/lib"],
};

const withMDX = createMDX({});

const withNextIntl = createNextIntlPlugin("./components/i18n/i18n.ts");

export default withNextIntl(withMDX(nextConfig));
