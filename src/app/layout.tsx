import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Theme, ThemePanel } from "@radix-ui/themes";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

const inter = Inter({
	subsets: ["latin", "vietnamese"],
	variable: "--font-inter",
});

export const metadata: Metadata = {
	title: "web sex cua 3ae",
	description: "danh, dkgb, ngh",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="scroll-smooth" suppressHydrationWarning>
			<body
				className={`${inter.variable} antialiased min-h-screen overflow-x-hidden mx-0 my-0`}
			>
				<ThemeProvider attribute="class">
					<Theme>
						<main>{children}</main>
						<Toaster />
						<ThemePanel />
					</Theme>
				</ThemeProvider>
			</body>
		</html>
	);
}
