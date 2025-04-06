"use client";

import { MinusIcon } from "@radix-ui/react-icons";
import {
	Heading,
	Text,
	Card,
	Flex,
	Checkbox,
	TextField,
	Button,
} from "@radix-ui/themes";
import * as React from "react";
import { toast } from "sonner";

type PreferencesConfig = {
	lazyLoading: boolean;
	aiGeneratedContent: boolean;
};

export default function Preferences() {
	const [blacklistedTokens, setBlacklistedTokens] = React.useState<string[]>(
		[],
	);
	const [prefConfig, setPrefConfig] = React.useState<PreferencesConfig>({
		lazyLoading: true,
		aiGeneratedContent: false,
	});
	const handlePrefChange = (value: string, isChecked: boolean) => {
		const newPref = {
			...prefConfig,
			[value]: isChecked,
		};
		localStorage.setItem("preferencesConfig", JSON.stringify(newPref));
		setPrefConfig(newPref);
	};

	React.useEffect(() => {
		const preferencesConfig = localStorage.getItem("preferencesConfig");
		const storedBlacklistedTags = localStorage.getItem("blacklistedTags");
		console.log(storedBlacklistedTags);
		if (preferencesConfig) {
			try {
				const config: PreferencesConfig = JSON.parse(preferencesConfig);
				setPrefConfig(config);
			} catch {
				toast.error("Malformed config JSON.");
			}
		}
		if (storedBlacklistedTags) {
			const blacklistedTags = storedBlacklistedTags.split(" ");
			setBlacklistedTokens(blacklistedTags);
		}
	}, []);

	React.useEffect(() => {
		localStorage.setItem("blacklistedTags", blacklistedTokens.join(" "));
	}, [blacklistedTokens]);

	const [blacklistTextField, setBlacklistTextField] = React.useState(" ");
	const isPastingRef = React.useRef(false);

	const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (isPastingRef.current) {
			// paste logic
			const tokens = value.trim().split(" ");
			setBlacklistedTokens(
				Array.from(new Set([...blacklistedTokens, ...tokens])),
			);
			setBlacklistTextField("");
			isPastingRef.current = false;
			return;
		}
		// change logic
		if (!value.endsWith(" ")) {
			setBlacklistTextField(value);
			return;
		}
		const token = value.trim();
		if (token && !blacklistedTokens.includes(token)) {
			setBlacklistedTokens([...blacklistedTokens, token]);
		}
		setBlacklistTextField("");
	};
	const handleTextFieldPaste = () => {
		isPastingRef.current = true;
	};

	const removeToken = (idx: number) => {
		setBlacklistedTokens(
			blacklistedTokens.filter((_, index) => idx !== index),
		);
	};

	return (
		<Flex
			pt="5"
			mx={{
				lg: "9",
			}}
			direction="column"
			gap="3"
		>
			<Card size="3">
				<Heading size={{ initial: "7", lg: "9" }}>Preferences</Heading>
				<Text>Configure settings for requesting R34.xxx content</Text>
			</Card>
			<Card size="3">
				<Flex direction="row" align="center" gap="2">
					<Text size="5">
						<strong>
							Enable{" "}
							<span
								style={{
									color: "var(--accent-10)",
								}}
							>
								lazy loading?
							</span>
						</strong>
					</Text>
					<Checkbox
						checked={prefConfig.lazyLoading}
						onCheckedChange={(isChecked: boolean) =>
							handlePrefChange("lazyLoading", isChecked)
						}
					/>
				</Flex>
				<Text size="2">
					Decide if content from R34 should load eagerly or lazily.
				</Text>
			</Card>
			<Card size="3">
				<Flex direction="row" align="center" gap="2">
					<Text size="5">
						<strong>
							Enable{" "}
							<span
								style={{
									color: "var(--accent-10)",
								}}
							>
								AI-Generated
							</span>{" "}
							content?
						</strong>
					</Text>
					<Checkbox
						checked={prefConfig.aiGeneratedContent}
						onCheckedChange={(isChecked: boolean) =>
							handlePrefChange("aiGeneratedContent", isChecked)
						}
					/>
				</Flex>
				<Text size="2">
					Decide if content from R34 should include ai-generated
					content.
				</Text>
			</Card>
			<Card>
				<Flex direction="column" gap="2">
					<Text size="5">
						<strong>
							<span
								style={{
									color: "var(--accent-10)",
								}}
							>
								Blacklisted
							</span>{" "}
							tags
						</strong>
					</Text>
					<TextField.Root
						value={blacklistTextField}
						onChange={handleTextFieldChange}
						onPaste={handleTextFieldPaste}
					>
						<TextField.Slot>
							<MinusIcon />
						</TextField.Slot>
					</TextField.Root>
					<Flex gap="2" wrap="wrap">
						{blacklistedTokens.map((token, idx) => {
							return (
								<Button
									key={token}
									color="ruby"
									variant="outline"
									onClick={() => removeToken(idx)}
								>
									<MinusIcon />
									{token}
								</Button>
							);
						})}
					</Flex>
				</Flex>
			</Card>
		</Flex>
	);
}
