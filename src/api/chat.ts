import type { Message, Space } from "../types/chat.js";

export interface ChatService {
	listSpaces(): Promise<Space[]>;
	getMessages(spaceId: string): Promise<Message[]>;
	sendMessage(spaceId: string, text: string): Promise<Message>;
	searchMessages(query: string): Promise<
		{
			space: Space;
			message: Message;
		}[]
	>;
}
