import createMDX from "@next/mdx";

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
    ],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
