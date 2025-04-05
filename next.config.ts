import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
		],
	},
};

export default nextConfig;
