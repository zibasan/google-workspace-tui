export type SpaceType = "space" | "dm" | "group_dm";

export interface User {
	id: string;
	name: string;
	avatarUrl?: string;
	isOnline?: boolean;
}

export interface Space {
	id: string;
	name: string;
	type: SpaceType;
	unreadCount?: number;
	memberCount?: number;
	description?: string;
}

export interface Message {
	id: string;
	spaceId: string;
	sender: User;
	text: string;
	createTime: Date;
}
