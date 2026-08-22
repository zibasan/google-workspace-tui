import { Box } from "ink";
import type { Message, Space } from "../types/chat.js";
import { ChatHeader } from "./ChatHeader.js";
import { MessageInput } from "./MessageInput.js";
import { MessageList } from "./MessageList.js";

interface ChatViewProps {
	space: Space | null;
	messages: Message[];
	selectedMessageIndex: number;
	inputValue: string;
	cursorPos: number;
	isChatFocused: boolean;
	isInputFocused: boolean;
	loading: boolean;
	sending: boolean;
	width: number;
	height: number;
}

export const ChatView = ({
	space,
	messages,
	selectedMessageIndex,
	inputValue,
	cursorPos,
	isChatFocused,
	isInputFocused,
	loading,
	sending,
	width,
	height,
}: ChatViewProps) => {
	// Fixed heights
	const headerHeight = space?.description ? 3 : 2;
	const inputHeight = isInputFocused ? 4 : 3;
	const messageListHeight = Math.max(3, height - headerHeight - inputHeight);

	return (
		<Box flexDirection="column" width={width} height={height} overflow="hidden">
			<ChatHeader space={space} loading={loading} width={width} />
			<MessageList
				messages={messages}
				selectedMessageIndex={selectedMessageIndex}
				isFocused={isChatFocused}
				loading={loading}
				width={width}
				height={messageListHeight}
			/>
			<MessageInput
				value={inputValue}
				cursorPos={cursorPos}
				isFocused={isInputFocused}
				sending={sending}
				width={width}
			/>
		</Box>
	);
};
