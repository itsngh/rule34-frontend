"use client";
import {
	Text,
	Heading,
	Button,
	IconButton,
	TextField,
	Flex,
	Card,
	Grid,
	ScrollArea,
} from "@radix-ui/themes";
import {
	CaretDownIcon,
	Cross1Icon,
	DiscordLogoIcon,
	GearIcon,
	MagnifyingGlassIcon,
	PersonIcon,
} from "@radix-ui/react-icons";
import * as React from "react";
import { toast } from "sonner";
import Link from "next/link";
import PostItem from "@/components/postItem";
import useDebounce from "@/hooks/useDebounce";

const devs = ["kittenhook"];

type PreferencesConfig = {
	lazyLoading: boolean;
	aiGeneratedContent: boolean;
};
type SearchResult = {
	preview_url: string;
	sample_url: string;
	file_url: string;
	directory: number;
	hash: string;
	width: number;
	height: number;
	id: number;
	image: string;
	change: number;
	owner: string;
	parent_id: number;
	rating: "explicit" | "questionable";
	sample: boolean;
	sample_height: number;
	sample_width: number;
	score: number;
	tags: string;
	source: string;
	status: "active" | "inactive";
	has_notes: boolean;
	comment_count: number;
};

type autocompleteSuggestions = {
	type: "general" | "meta" | "ai_generated" | "copyright" | "artist";
	label: string;
	value: string;
};

export default function Home() {
	const [queriedTags, setQueriedTags] = React.useState<string[]>([]);
	const [blacklistedTags, setBlacklistedTags] = React.useState<string[]>([]);
	const [prefConfig, setPrefConfig] = React.useState<PreferencesConfig>({
		lazyLoading: true,
		aiGeneratedContent: false,
	});
	const [conflicted, setConflicted] = React.useState(false);

	// load config
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
			setBlacklistedTags(blacklistedTags);
		}
	}, []);

	React.useEffect(() => {
		const blacklistedQueryTags = queriedTags
			.filter((tag) => tag.startsWith("-"))
			.map((tag) => tag.slice(1));
		if (
			queriedTags.some((tag) => blacklistedTags.includes(tag)) ||
			(queriedTags.includes("ai_generated") &&
				!prefConfig.aiGeneratedContent) ||
			blacklistedQueryTags.some((tag) => queriedTags.includes(tag))
		) {
			setConflicted(true);
			return;
		}
		setConflicted(false);
	}, [queriedTags, prefConfig.aiGeneratedContent, blacklistedTags]);

	const [queryTextfield, setQueryTextfield] = React.useState("");
	const [searchResults, setSearchResults] = React.useState<SearchResult[]>(
		[],
	);

	const [acSuggestions, setACSuggestions] = React.useState<
		autocompleteSuggestions[]
	>([]);

	const isPastingRef = React.useRef(false);

	const deferredACQuery = useDebounce(queryTextfield, 175);

	React.useEffect(() => {
		if (!deferredACQuery) {
			setACSuggestions([]);
			return;
		}
		const value = deferredACQuery.startsWith("-")
			? deferredACQuery.slice(1)
			: deferredACQuery;
		(async () => {
			try {
				const response = await fetch(
					`https://ac.rule34.xxx/autocomplete.php?q=${value}`,
				);
				const results: autocompleteSuggestions[] =
					await response.json();
				setACSuggestions(results);
			} catch {
				setACSuggestions([]);
				return;
			}
		})();
	}, [deferredACQuery]);

	const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (isPastingRef.current) {
			// paste logic
			const tokens = value
				.trim()
				.split(" ")
				.filter((token) => token);
			setQueriedTags(Array.from(new Set([...queriedTags, ...tokens])));
			setQueryTextfield("");
			isPastingRef.current = false;
			return;
		}
		// change logic
		if (!value.endsWith(" ")) {
			setQueryTextfield(value);
			return;
		}
		const token = value.trim();
		if (token && !queriedTags.includes(token)) {
			setQueriedTags([...queriedTags, token]);
		}
		setQueryTextfield("");
	};
	const handleTextFieldPaste = () => {
		isPastingRef.current = true;
	};

	const handleSearchRequest = async () => {
		const signedBlacklistedTags = blacklistedTags.map((tag) => `-${tag}`);
		if (queriedTags.length <= 0) {
			return;
		}
		const params = {
			page: "dapi",
			q: "index",
			s: "post",
			json: "1",
			limit: "50",
			tags: Array.from(
				new Set([
					...queriedTags,
					...signedBlacklistedTags,
					prefConfig.aiGeneratedContent ? "" : "-ai_generated",
				]),
			).join(" "),
		};
		try {
			const response = await fetch(
				"https://api.rule34.xxx/index.php?" +
					new URLSearchParams(params),
			);
			const results: SearchResult[] = await response.json();
			setSearchResults(results);
		} catch {
			return;
		}
	};

	const removeToken = (idx: number) => {
		setQueriedTags(queriedTags.filter((_, index) => idx !== index));
	};

	const sectionRef = React.useRef<HTMLDivElement>(null);
	const scrollTo = () =>
		sectionRef.current?.scrollIntoView({ behavior: "smooth" });
	return (
		<>
			<Flex
				direction="column"
				justify="center"
				align="center"
				gapY="2"
				style={{
					height: "100vh",
				}}
			>
				<Heading size={{ initial: "7", lg: "9" }}>
					web ngu hoc vcl
				</Heading>
				<Text>{devs.map((dev) => `@${dev}`).join(", ")}</Text>
				<Flex gapX="2">
					<IconButton variant="outline" asChild>
						<Link href="/preferences">
							<GearIcon />
						</Link>
					</IconButton>
					<IconButton variant="outline">
						<DiscordLogoIcon />
					</IconButton>
					<IconButton variant="outline">
						<PersonIcon />
					</IconButton>
				</Flex>
				<CaretDownIcon className="animate-bounce" onClick={scrollTo} />
			</Flex>

			<Flex
				py="5"
				ref={sectionRef}
				direction="column"
				gap="2"
				style={{
					height: "100vh",
				}}
			>
				<Card
					mx={{
						initial: "5",
						lg: "9",
					}}
				>
					<Flex direction="column" gapY="3">
						<Flex gap="2">
							<TextField.Root
								style={{
									flex: "1",
								}}
								value={queryTextfield}
								onChange={handleTextFieldChange}
								onPaste={handleTextFieldPaste}
							>
								<TextField.Slot side="left">
									<MagnifyingGlassIcon />
								</TextField.Slot>
							</TextField.Root>
							<IconButton
								disabled={conflicted || queriedTags.length <= 0}
								onClick={() => handleSearchRequest()}
							>
								<MagnifyingGlassIcon />
							</IconButton>
						</Flex>
						{conflicted ? (
							<Text color="ruby" size="1">
								One or more tags are colliding! Please check
								your selected tags, or blacklisted tags in{" "}
								<Link
									href="/preferences"
									style={{ textDecoration: "underline" }}
								>
									Preferences
								</Link>
								!
							</Text>
						) : (
							<></>
						)}
						<Flex direction="row" wrap="wrap" gap="2">
							{queriedTags.map((tag, idx) => {
								return tag.startsWith("-") ? (
									<Button
										color="ruby"
										variant="outline"
										key={tag}
										onClick={() => removeToken(idx)}
									>
										<Cross1Icon />
										{tag}
									</Button>
								) : (
									<Button
										variant="outline"
										key={tag}
										onClick={() => removeToken(idx)}
									>
										<Cross1Icon />
										{tag}
									</Button>
								);
							})}
						</Flex>
						<Flex direction="column">
							{acSuggestions.map((token) => {
								return (
									<Text
										key={token.value}
										style={{
											fontFamily: "var(--font-jbm)",
										}}
										onClick={() => {
											const signedValue =
												queryTextfield.startsWith("-")
													? `-${token.value}`
													: token.value;
											if (
												signedValue &&
												!queriedTags.includes(
													signedValue,
												)
											)
												setQueriedTags([
													...queriedTags,
													signedValue,
												]);
											setQueryTextfield("");
										}}
									>
										<Text>({token.type})</Text>{" "}
										{token.label}
									</Text>
								);
							})}
						</Flex>
					</Flex>
				</Card>
				<Card
					mx={{
						initial: "5",
						lg: "9",
					}}
					style={{
						flex: "1",
					}}
				>
					<ScrollArea scrollbars="vertical">
						<Grid
							columns={{
								initial: "1",
								xs: "2",
								md: "3",
								lg: "5",
							}}
							gap="3"
						>
							{searchResults.map((post) => {
								return (
									<PostItem
										key={post.id}
										lazyLoading={prefConfig.lazyLoading}
										filename={post.image}
										sample_url={post.sample_url}
										score={post.score}
										tags={post.tags}
									/>
								);
							})}
						</Grid>
					</ScrollArea>
				</Card>
			</Flex>
		</>
	);
}
