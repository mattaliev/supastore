/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ['static.tildacdn.com'],
	},
	reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: "standalone",
};

export default nextConfig;
