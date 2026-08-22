import { Box, Text } from "ink";
import type { Space } from "../types/chat.js";

interface SpaceItemProps {
	space: Space;
	isSelected: boolean;
	isFocused: boolean;
	width: number;
}

export const SpaceItem = ({
	space,
	isSelected,
	isFocused,
	width,
}: SpaceItemProps) => {
	const prefix = space.type === "dm" ? (isSelected ? "● " : "○ ") : "# ";
	const pointer = isSelected ? "> " : "  ";

	// Calculate truncated name length considering pointer, prefix and unread badge
	const badgeStr = space.unreadCount ? ` ${space.unreadCount}` : "";
	const reservedLen = pointer.length + prefix.length + badgeStr.length + 1;
	const maxNameLen = Math.max(4, width - reservedLen);

	let displayName = space.name;
	if (displayName.length > maxNameLen) {
		displayName = `${displayName.slice(0, maxNameLen - 1)}…`;
	}

	const isHighlighted = isSelected && isFocused;

	return (
		<Box width={width} justifyContent="space-between">
			<Box>
				<Text
					color={isHighlighted ? "cyan" : isSelected ? "blue" : undefined}
					bold={isSelected}
				>
					{pointer}
				</Text>
				<Text
					color={isHighlighted ? "cyan" : isSelected ? "white" : "gray"}
					bold={isSelected || (space.unreadCount ?? 0) > 0}
				>
					{prefix}
				</Text>
				<Text
					color={isHighlighted ? "cyan" : isSelected ? "white" : undefined}
					bold={isSelected || (space.unreadCount ?? 0) > 0}
				>
					{displayName}
				</Text>
			</Box>
			{space.unreadCount && space.unreadCount > 0 ? (
				<Text color="yellow" bold>
					{space.unreadCount}{" "}
				</Text>
			) : (
				<Text> </Text>
			)}
		</Box>
	);
};
