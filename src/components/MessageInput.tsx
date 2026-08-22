import { Box, Text } from "ink";

interface MessageInputProps {
	value: string;
	cursorPos: number;
	isFocused: boolean;
	sending: boolean;
	width: number;
}

export const MessageInput = ({
	value,
	cursorPos,
	isFocused,
	sending,
	width,
}: MessageInputProps) => {
	// Format text with visible cursor if focused
	const promptSymbol = "> ";
	const prefix = promptSymbol;

	let contentDisplay = value;
	if (isFocused) {
		const before = value.slice(0, cursorPos);
		const current = value.slice(cursorPos, cursorPos + 1) || " ";
		const after = value.slice(cursorPos + 1);

		contentDisplay = `${before}█${current === " " ? "" : current}${after}`;
	}

	return (
		<Box flexDirection="column" width={width} marginTop={1}>
			<Text color="gray">{"─".repeat(Math.max(1, width))}</Text>
			<Box width={width} justifyContent="space-between">
				<Box flexGrow={1}>
					<Text color={isFocused ? "cyan" : "gray"}>{prefix}</Text>
					{value.length === 0 && !isFocused ? (
						<Text dimColor>メッセージを入力... (i で入力開始)</Text>
					) : (
						<Text color="white" wrap="wrap">
							{contentDisplay}
						</Text>
					)}
				</Box>
				{sending && (
					<Box marginLeft={1}>
						<Text color="yellow">Sending... ⟳</Text>
					</Box>
				)}
			</Box>
			{isFocused && (
				<Box>
					<Text dimColor>[Ctrl+Enter] 送信 [Enter] 改行 [Esc] 完了</Text>
				</Box>
			)}
		</Box>
	);
};
