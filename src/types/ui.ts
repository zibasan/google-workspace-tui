export type FocusArea = "sidebar" | "chat" | "input" | "search" | "help";

export type LayoutMode = "wide" | "compact" | "single"; // wide (>100), compact (70-99), single (<70)

export interface SearchState {
	query: string;
	results: {
		spaceId: string;
		spaceName: string;
		messageId: string;
		senderName: string;
		text: string;
		createTime: Date;
	}[];
	selectedIndex: number;
}
