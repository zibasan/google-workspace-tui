import { Box, Text } from "ink";

interface HelpModalProps {
	width: number;
	height: number;
}

export const HelpModal = ({ width, height }: HelpModalProps) => {
	return (
		<Box
			flexDirection="column"
			width={width}
			height={height}
			borderStyle="single"
			borderColor="cyan"
			paddingX={1}
			overflow="hidden"
		>
			<Box marginBottom={0}>
				<Text bold color="cyan">
					⌨️ Google Chat TUI - Keybindings & Help
				</Text>
			</Box>

			<Box flexDirection="column" marginTop={1}>
				<Text bold color="yellow">
					Global
				</Text>
				<Text> q / Ctrl+C : アプリ終了</Text>
				<Text> r : 現在の画面・メッセージを更新</Text>
				<Text> / : 検索画面を開く</Text>
				<Text> ? : このヘルプを表示 / 閉じる</Text>
			</Box>

			<Box flexDirection="column" marginTop={1}>
				<Text bold color="yellow">
					Sidebar
				</Text>
				<Text> ↑ / k, ↓ / j : スペース/DMの選択</Text>
				<Text> Enter / l : スペースを開く / チャットへフォーカス</Text>
				<Text> i : メッセージ入力開始</Text>
			</Box>

			<Box flexDirection="column" marginTop={1}>
				<Text bold color="yellow">
					Chat & Messages
				</Text>
				<Text> ↑ / k, ↓ / j : メッセージの選択・スクロール</Text>
				<Text> i : メッセージ入力開始</Text>
				<Text> Esc / h : サイドバーへフォーカス</Text>
			</Box>

			<Box flexDirection="column" marginTop={1}>
				<Text bold color="yellow">
					Message Input
				</Text>
				<Text> Ctrl+Enter : メッセージ送信</Text>
				<Text> Enter : 改行</Text>
				<Text> Esc : 入力終了</Text>
			</Box>

			<Box marginTop={1}>
				<Text dimColor>[Esc] または [?] でヘルプを閉じる</Text>
			</Box>
		</Box>
	);
};
