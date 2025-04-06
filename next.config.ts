import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.1.90"],
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "api-cdn.rule34.xxx",
				port: "",
				pathname: "**",
				search: "",
			},
			{
				protocol: "https",
				hostname: "api-cdn-mp4.rule34.xxx",
				port: "",
				pathname: "**",
				search: "",
			},
		],
	},
};

export default nextConfig;
