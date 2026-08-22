import { Box, Text } from "ink";
import { useMemo } from "react";
import type { Message } from "../types/chat.js";
import { MessageItem } from "./MessageItem.js";

interface MessageListProps {
	messages: Message[];
	selectedMessageIndex: number;
	isFocused: boolean;
	loading: boolean;
	width: number;
	height: number;
}

export const MessageList = ({
	messages,
	selectedMessageIndex,
	isFocused,
	loading,
	width,
	height,
}: MessageListProps) => {
	// Calculate visible messages window based on available height.
	const visibleCount = Math.max(1, Math.floor(height / 2.5));

	const visibleMessages = useMemo(() => {
		if (messages.length <= visibleCount) {
			return messages.map((msg, originalIdx) => ({ msg, originalIdx }));
		}

		// Ensure selectedMessageIndex is inside [startIndex, endIndex]
		let start = Math.max(
			0,
			selectedMessageIndex - Math.floor(visibleCount / 2),
		);
		if (start + visibleCount > messages.length) {
			start = Math.max(0, messages.length - visibleCount);
		}
		const end = Math.min(messages.length, start + visibleCount);

		return messages
			.slice(start, end)
			.map((msg, idx) => ({ msg, originalIdx: start + idx }));
	}, [messages, selectedMessageIndex, visibleCount]);

	if (loading && messages.length === 0) {
		return (
			<Box
				flexDirection="column"
				height={height}
				width={width}
				justifyContent="center"
			>
				<Text color="yellow"> メッセージを読み込み中... ⟳</Text>
			</Box>
		);
	}

	if (messages.length === 0) {
		return (
			<Box
				flexDirection="column"
				height={height}
				width={width}
				justifyContent="center"
			>
				<Text dimColor>
					{" "}
					メッセージはありません。最初のメッセージを送信してみましょう！
				</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column" height={height} width={width} overflow="hidden">
			{visibleMessages.map(({ msg, originalIdx }) => {
				const prev = originalIdx > 0 ? messages[originalIdx - 1] : undefined;
				return (
					<MessageItem
						key={msg.id}
						message={msg}
						previousMessage={prev}
						isSelected={originalIdx === selectedMessageIndex}
						isFocused={isFocused}
						width={width}
					/>
				);
			})}
		</Box>
	);
};
