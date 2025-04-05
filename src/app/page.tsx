"use client";
import { Text, Heading, Button, TextField } from "@radix-ui/themes";
import { Cross1Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";

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

export default function Home() {
	const sectionRef = React.useRef<HTMLDivElement>(null);
	const [searchQuery, setSearchQuery] = React.useState("");
	const [results, setResults] = React.useState<SearchResult[]>([]);
	const [tokens, setTokens] = React.useState<string[]>([]);
	const [conflicted, setConflicted] = React.useState(false);

	const removeToken = (idx: number) => {
		setTokens([...tokens].filter((_, i) => i !== idx));
	};

	const handleSearchRequest = async (tags: string[]) => {
		if (!tags) return;
		const params = {
			s: "post",
			q: "index",
			page: "dapi",
			json: "1",
			limit: "50",
			tags: tags.join(" "),
		};
		const response = await fetch(
			"https://api.rule34.xxx/index.php?" +
				new URLSearchParams(params).toString(),
		);
		if (!response.ok) {
			setResults([]);
			toast.error("Failed to query results!", {
				description: `${new Date(Date.now()).toUTCString()}`,
			});
			return;
		}
		const results: SearchResult[] = await response.json();
		setResults(results);
	};

	const handleSearchQueryChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const value = event.target.value;
		if (!value.endsWith(" ")) {
			setSearchQuery(value);
			return;
		}
		const token = value.trim();
		if (!tokens.includes(token)) setTokens([...tokens, token]);
		setSearchQuery("");
	};

	// Autocomplete
	React.useEffect(() => {}, [searchQuery]);

	React.useEffect(() => {
		const queriedTags = tokens.filter((token) => !token.startsWith("-"));
		const omittedTags = tokens
			.filter((token) => token.startsWith("-"))
			.map((tag) => tag.slice(1));
		const conflict = queriedTags.some((token) =>
			omittedTags.includes(token),
		);
		if (conflict) {
			setConflicted(true);
			return;
		}
		setConflicted(false);
	}, [tokens]);

	return (
		<div>
			<section className="w-screen h-screen flex flex-col items-center justify-center gap-y-1">
				<Heading size={{ initial: "7", lg: "9" }}>
					web ngu hoc vcl
				</Heading>
				<Text>danh, dkgb, ngh</Text>
				<Button
					onClick={() =>
						sectionRef.current?.scrollIntoView({
							behavior: "smooth",
						})
					}
					variant="outline"
				>
					Start using!
				</Button>
			</section>

			<section
				className="h-screen w-screen flex flex-col items-center p-3"
				ref={sectionRef}
			>
				{/* CONTROLLER */}
				<div className="flex flex-col gap-y-2">
					{/* input and button and error message */}
					<div>
						<div className="flex gap-y-2">
							<div className="flex flex-row items-center gap-x-2">
								<TextField.Root
									size="3"
									placeholder="Enter your tags..."
									value={searchQuery}
									onChange={handleSearchQueryChange}
								></TextField.Root>
								<Button
									disabled={conflicted || tokens.length == 0}
									variant="outline"
									size="3"
									onClick={() => handleSearchRequest(tokens)}
								>
									<MagnifyingGlassIcon />
								</Button>
							</div>
						</div>
						<div>
							{conflicted ? (
								<Text color="ruby" size="1">
									One or more queried tags are colliding!
								</Text>
							) : (
								<></>
							)}
						</div>
					</div>

					{/* tags */}
					<div className="flex gap-x-2">
						{tokens.map((token, idx) => {
							return token.startsWith("-") ? (
								<Button
									key={idx}
									variant="outline"
									color="ruby"
									onClick={() => removeToken(idx)}
								>
									<Cross1Icon />
									{token}
								</Button>
							) : (
								<Button
									key={idx}
									variant="outline"
									onClick={() => removeToken(idx)}
								>
									<Cross1Icon />
									{token}
								</Button>
							);
						})}
					</div>
				</div>

				{/* CONTENT */}
				<div className="grid sm:grid-cols-2 lg:grid-cols-5">
					{results.map((post) => {
						return (
							<Image
								key={post.id}
								src={post.file_url}
								width={500}
								height={500}
								layout="responsive"
								alt=""
							/>
						);
					})}
				</div>
			</section>
		</div>
	);
}
