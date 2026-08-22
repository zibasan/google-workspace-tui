import { Box, Text } from "ink";
import type { Space } from "../types/chat.js";

interface ChatHeaderProps {
	space: Space | null;
	loading: boolean;
	width: number;
}

export const ChatHeader = ({ space, loading, width }: ChatHeaderProps) => {
	if (!space) {
		return (
			<Box flexDirection="column" width={width} marginBottom={1}>
				<Text color="gray">スペースが選択されていません</Text>
				<Text color="gray">{"─".repeat(Math.max(1, width))}</Text>
			</Box>
		);
	}

	const icon = space.type === "dm" ? "@" : "#";

	return (
		<Box flexDirection="column" width={width} marginBottom={1}>
			<Box justifyContent="space-between" width={width}>
				<Box>
					<Text bold color="cyan">
						{icon} {space.name}
					</Text>
					{space.memberCount !== undefined && (
						<Text dimColor> ({space.memberCount} メンバー)</Text>
					)}
				</Box>
				{loading && (
					<Box>
						<Text color="yellow">Loading... ⟳</Text>
					</Box>
				)}
			</Box>
			{space.description && (
				<Box>
					<Text dimColor wrap="truncate">
						{space.description}
					</Text>
				</Box>
			)}
			<Text color="gray">{"─".repeat(Math.max(1, width))}</Text>
		</Box>
	);
};
