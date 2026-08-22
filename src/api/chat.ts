import type { Message, Space, User } from "../types/chat.js"

export interface ChatService {
  listSpaces(): Promise<Space[]>
  getMessages(spaceId: string): Promise<Message[]>
  getMembers(spaceId: string): Promise<User[]>
  sendMessage(spaceId: string, text: string): Promise<Message>
  deleteMessage(spaceId: string, messageId: string): Promise<void>
  markAsUnread(spaceId: string): Promise<void>
  searchMessages(query: string): Promise<
    {
      space: Space
      message: Message
    }[]
  >
}
