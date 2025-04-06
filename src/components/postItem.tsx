import { Card, Dialog } from "@radix-ui/themes";
import Image from "next/image";

type PostItemProps = {
	lazyLoading: boolean;
	sample_url: string;
	filename: string;
	score: number;
	tags: string;
};

export default function PostItem(props: PostItemProps) {
	return (
		<Card>
			<Dialog.Root>
				<Dialog.Trigger>
					<Image
						loading={props.lazyLoading ? "lazy" : "eager"}
						layout="responsive"
						height={1}
						width={1}
						src={props.sample_url}
						alt=""
					/>
				</Dialog.Trigger>
				<Dialog.Content maxWidth={{ initial: "90vw" }}>
					{/* <Box> */}
					<Dialog.Title>{props.filename}</Dialog.Title>
					<Dialog.Description>Tags: {props.tags}</Dialog.Description>
					{/* </Box> */}
					<Image
						loading={props.lazyLoading ? "lazy" : "eager"}
						layout="responsive"
						height={1}
						width={1}
						src={props.sample_url}
						alt=""
					/>
				</Dialog.Content>
			</Dialog.Root>
		</Card>
	);
}
