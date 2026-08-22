import { Box, Text } from "ink";
import type { Message } from "../types/chat.js";
import { formatMessageTime } from "../utils/format.js";

interface MessageItemProps {
	message: Message;
	previousMessage?: Message;
	isSelected?: boolean;
	isFocused?: boolean;
	width: number;
}

export const MessageItem = ({
	message,
	previousMessage,
	isSelected,
	isFocused,
	width,
}: MessageItemProps) => {
	const isSameUserAsPrev =
		previousMessage &&
		previousMessage.sender.id === message.sender.id &&
		Math.abs(
			message.createTime.getTime() - previousMessage.createTime.getTime(),
		) <
			5 * 60 * 1000;

	const timeStr = formatMessageTime(message.createTime);
	const isSelf = message.sender.id === "user-self";

	return (
		<Box
			flexDirection="column"
			width={width}
			marginBottom={isSameUserAsPrev ? 0 : 1}
			paddingLeft={isSelected ? 1 : 0}
			borderStyle={isSelected && isFocused ? "bold" : undefined}
			borderColor={isSelected && isFocused ? "cyan" : undefined}
		>
			{!isSameUserAsPrev ? (
				<Box>
					<Text bold color={isSelf ? "green" : "blueBright"}>
						{message.sender.name}
					</Text>
					<Text dimColor> {timeStr}</Text>
				</Box>
			) : (
				<Box>
					<Text dimColor> {timeStr}</Text>
				</Box>
			)}
			<Box paddingLeft={1}>
				<Text color="white" wrap="wrap">
					{message.text}
				</Text>
			</Box>
		</Box>
	);
};
