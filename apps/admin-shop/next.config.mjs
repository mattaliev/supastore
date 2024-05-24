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
        hostname: "static.tildacdn.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/ditch-bucket/**"
      }
    ],
  },
  transpilePackages: ['lucide-react']
};

export default nextConfig;
