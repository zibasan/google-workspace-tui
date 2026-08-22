import { Box, Text } from "ink";
import type { FocusArea, LayoutMode } from "../types/ui.js";

interface StatusBarProps {
	focusArea: FocusArea;
	layoutMode: LayoutMode;
	isSingleChatActive: boolean;
	width: number;
}

export const StatusBar = ({
	focusArea,
	layoutMode,
	isSingleChatActive,
	width,
}: StatusBarProps) => {
	let shortcuts = "";

	if (focusArea === "search") {
		shortcuts = "↑↓ 選択  Enter 開く  Esc 検索終了";
	} else if (focusArea === "input") {
		shortcuts = "Ctrl+Enter 送信  Enter 改行  Esc 入力終了";
	} else if (focusArea === "chat") {
		shortcuts =
			"↑↓/jk 移動  i 入力  Esc サイドバーへ  / 検索  r 更新  ? ヘルプ  q 終了";
	} else {
		// sidebar
		shortcuts =
			layoutMode === "single" && isSingleChatActive
				? "↑↓/jk 移動  Enter 開く  Esc 戻る  / 検索  r 更新  ? ヘルプ  q 終了"
				: "↑↓/jk 移動  Enter 開く  Tab/i チャットへ  / 検索  r 更新  ? ヘルプ  q 終了";
	}

	return (
		<Box flexDirection="column" width={width} height={2}>
			<Text color="gray">{"─".repeat(Math.max(1, width))}</Text>
			<Box width={width} justifyContent="space-between">
				<Box>
					<Text color="gray"> {shortcuts}</Text>
				</Box>
				<Box>
					<Text dimColor>
						[{focusArea.toUpperCase()}] {layoutMode.toUpperCase()}
					</Text>
				</Box>
			</Box>
		</Box>
	);
};
