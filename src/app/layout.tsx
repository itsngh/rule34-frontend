import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Flex, Section, Theme, Text } from "@radix-ui/themes";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import "./globals.css";

import {
	CheckIcon,
	Cross1Icon,
	ExclamationTriangleIcon,
	UpdateIcon,
	CircleIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

const inter = Inter({
	subsets: ["latin", "vietnamese"],
	variable: "--font-inter",
});

const jbm = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jbm",
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
				className={`${inter.variable} ${jbm.variable} antialiased min-h-screen overflow-x-hidden mx-0 my-0`}
			>
				<ThemeProvider attribute="class">
					<Theme accentColor="sky" scaling="95%">
						<main className="min-h-screen pt-0">{children}</main>
						<Section
							style={{
								backgroundColor: "var(--gray-2)",
							}}
						>
							<Flex
								mx={{
									initial: "3",
									lg: "9",
								}}
								direction="row"
								justify="between"
								align="center"
							>
								<Text color="gray" size={{ initial: "1" }}>
									kittenhook.xyz
								</Text>
								<Flex direction="row" gapX="3">
									<Text color="gray" size={{ initial: "1" }}>
										<Link href="/privacy">
											Privacy Policy
										</Link>
									</Text>
									<Text color="gray" size={{ initial: "1" }}>
										<Link href="/tos">
											Terms of Service
										</Link>
									</Text>
								</Flex>
							</Flex>
						</Section>
						<Toaster
							icons={{
								success: <CheckIcon />,
								info: <CircleIcon />,
								warning: <ExclamationTriangleIcon />,
								error: <Cross1Icon />,
								loading: <UpdateIcon />,
							}}
							theme="system"
						/>
						{/* <ThemePanel /> */}
					</Theme>
				</ThemeProvider>
			</body>
		</html>
	);
}
