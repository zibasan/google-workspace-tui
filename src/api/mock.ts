import type { Message, Space, User } from "../types/chat.js"
import type { ChatService } from "./chat.js"

const CURRENT_USER: User = {
  id: "user-self",
  name: "自分",
  isOnline: true,
}

const USERS = {
  tanaka: { id: "user-1", name: "田中", isOnline: true },
  sato: { id: "user-2", name: "佐藤", isOnline: true },
  yamada: { id: "user-3", name: "山田", isOnline: false },
  suzuki: { id: "user-4", name: "鈴木", isOnline: false },
  self: CURRENT_USER,
} as const satisfies Record<string, User>

const INITIAL_SPACES: Space[] = [
  {
    id: "space-1",
    name: "General",
    type: "space",
    memberCount: 5,
    description: "全社・全体の一般的な連絡用スペース",
  },
  {
    id: "space-2",
    name: "プログラミング",
    type: "space",
    unreadCount: 3,
    memberCount: 4,
    description: "技術的な議論や開発の相談を行うスペース",
  },
  {
    id: "space-3",
    name: "雑談",
    type: "space",
    memberCount: 5,
    description: "気軽な雑談・息抜きスペース",
  },
  {
    id: "space-4",
    name: "開発",
    type: "space",
    unreadCount: 1,
    memberCount: 3,
    description: "プロジェクト進行・実装タスクの共有",
  },
  {
    id: "dm-1",
    name: "山田",
    type: "dm",
    memberCount: 2,
  },
  {
    id: "dm-2",
    name: "佐藤",
    type: "dm",
    unreadCount: 2,
    memberCount: 2,
  },
  {
    id: "dm-3",
    name: "鈴木",
    type: "dm",
    memberCount: 2,
  },
]

const SPACE_MEMBERS: Record<string, User[]> = {
  "space-1": [USERS.self, USERS.tanaka, USERS.sato, USERS.yamada, USERS.suzuki],
  "space-2": [USERS.self, USERS.tanaka, USERS.sato, USERS.suzuki],
  "space-3": [USERS.self, USERS.tanaka, USERS.sato, USERS.yamada, USERS.suzuki],
  "space-4": [USERS.self, USERS.sato, USERS.tanaka],
  "dm-1": [USERS.self, USERS.yamada],
  "dm-2": [USERS.self, USERS.sato],
  "dm-3": [USERS.self, USERS.suzuki],
}

const now = new Date()
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)

const INITIAL_MESSAGES: Record<string, Message[]> = {
  "space-2": [
    {
      id: "msg-101",
      spaceId: "space-2",
      sender: USERS.tanaka,
      text: "明日の課題についての確認です。設計書に記載されているUI要件は確認できましたでしょうか？",
      createTime: new Date(twoDaysAgo.setHours(15, 30, 0, 0)),
    },
    {
      id: "msg-102",
      spaceId: "space-2",
      sender: USERS.tanaka,
      text: "資料も合わせてGitHubのほうにアップロードしてありますので、ご確認よろしくお願いします。",
      createTime: new Date(twoDaysAgo.setHours(15, 32, 0, 0)),
    },
    {
      id: "msg-103",
      spaceId: "space-2",
      sender: USERS.sato,
      text: "了解です！資料確認しました。TUIのレスポンシブ対応についての仕様がとてもわかりやすいです。",
      createTime: new Date(yesterday.setHours(10, 15, 0, 0)),
    },
    {
      id: "msg-104",
      spaceId: "space-2",
      sender: USERS.sato,
      text: "70列未満になったら1ペイン表示に切り替える仕様、ターミナル使いにはありがたいですね。",
      createTime: new Date(yesterday.setHours(10, 18, 0, 0)),
    },
    {
      id: "msg-105",
      spaceId: "space-2",
      sender: USERS.tanaka,
      text: "提出期限は金曜日の18時までとなっておりますので、各自実装を進めておいてください。",
      createTime: new Date(new Date().setHours(11, 45, 0, 0)),
    },
    {
      id: "msg-106",
      spaceId: "space-2",
      sender: USERS.tanaka,
      text: "質問等があればいつでもこのスペースで聞いてくださいね。",
      createTime: new Date(new Date().setHours(11, 46, 0, 0)),
    },
    {
      id: "msg-107",
      spaceId: "space-2",
      sender: USERS.sato,
      text: "承知しました。まずはUIモックの作成から着手します！",
      createTime: new Date(new Date().setHours(13, 10, 0, 0)),
    },
  ],
  "space-1": [
    {
      id: "msg-201",
      spaceId: "space-1",
      sender: USERS.yamada,
      text: "皆様お疲れ様です。来週月曜日の全体定例ミーティングは14:00開始に変更となりました。",
      createTime: new Date(yesterday.setHours(9, 0, 0, 0)),
    },
    {
      id: "msg-202",
      spaceId: "space-1",
      sender: USERS.suzuki,
      text: "アナウンスありがとうございます。カレンダー更新しておきました。",
      createTime: new Date(yesterday.setHours(9, 5, 0, 0)),
    },
  ],
  "space-3": [
    {
      id: "msg-301",
      spaceId: "space-3",
      sender: USERS.suzuki,
      text: "オフィスの近くに新しいカフェがオープンしてました！コーヒー美味しかったです☕",
      createTime: new Date(new Date().setHours(12, 30, 0, 0)),
    },
  ],
  "space-4": [
    {
      id: "msg-401",
      spaceId: "space-4",
      sender: USERS.sato,
      text: "homeworkの提出用プルリクエストを作成しました。レビューお願いします。",
      createTime: new Date(yesterday.setHours(18, 21, 0, 0)),
    },
  ],
  "dm-1": [
    {
      id: "msg-501",
      spaceId: "dm-1",
      sender: USERS.yamada,
      text: "後で確認します。少しお時間いただけますでしょうか。",
      createTime: new Date(new Date().setHours(14, 0, 0, 0)),
    },
  ],
  "dm-2": [
    {
      id: "msg-601",
      spaceId: "dm-2",
      sender: USERS.sato,
      text: "お疲れ様です！例の件、どうなりましたでしょうか？",
      createTime: new Date(yesterday.setHours(16, 40, 0, 0)),
    },
    {
      id: "msg-602",
      spaceId: "dm-2",
      sender: USERS.sato,
      text: "急ぎではないので、お手すきの際にご返信いただければ幸いです！",
      createTime: new Date(new Date().setHours(10, 0, 0, 0)),
    },
  ],
  "dm-3": [
    {
      id: "msg-701",
      spaceId: "dm-3",
      sender: USERS.suzuki,
      text: "先ほどのミーティング資料、共有フォルダに置きました！",
      createTime: new Date(twoDaysAgo.setHours(17, 0, 0, 0)),
    },
  ],
}

export class MockChatService implements ChatService {
  private spaces: Space[]
  private messages: Record<string, Message[]>

  constructor() {
    this.spaces = INITIAL_SPACES.map((s) => ({ ...s }))
    this.messages = Object.fromEntries(
      Object.entries(INITIAL_MESSAGES).map(([k, v]) => [
        k,
        v.map((m) => ({ ...m })),
      ]),
    )
  }

  async listSpaces(): Promise<Space[]> {
    await new Promise((resolve) => setTimeout(resolve, 80))
    return [...this.spaces]
  }

  async getMessages(spaceId: string): Promise<Message[]> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return [...(this.messages[spaceId] || [])]
  }

  async getMembers(spaceId: string): Promise<User[]> {
    await new Promise((resolve) => setTimeout(resolve, 60))
    return [...(SPACE_MEMBERS[spaceId] || [USERS.self])]
  }

  async sendMessage(spaceId: string, text: string): Promise<Message> {
    await new Promise((resolve) => setTimeout(resolve, 150))
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      spaceId,
      sender: CURRENT_USER,
      text,
      createTime: new Date(),
    }
    if (!this.messages[spaceId]) {
      this.messages[spaceId] = []
    }
    this.messages[spaceId].push(newMessage)
    return newMessage
  }

  async deleteMessage(spaceId: string, messageId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    if (this.messages[spaceId]) {
      this.messages[spaceId] = this.messages[spaceId].filter(
        (m) => m.id !== messageId,
      )
    }
  }

  async markAsUnread(spaceId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 80))
    this.spaces = this.spaces.map((s) =>
      s.id === spaceId ? { ...s, unreadCount: (s.unreadCount ?? 0) + 1 } : s,
    )
  }

  async searchMessages(query: string): Promise<
    {
      space: Space
      message: Message
    }[]
  > {
    await new Promise((resolve) => setTimeout(resolve, 120))
    const lowerQuery = query.toLowerCase()
    const results: { space: Space; message: Message }[] = []

    for (const space of this.spaces) {
      const msgs = this.messages[space.id] || []
      for (const msg of msgs) {
        if (
          msg.text.toLowerCase().includes(lowerQuery) ||
          msg.sender.name.toLowerCase().includes(lowerQuery)
        ) {
          results.push({ space, message: msg })
        }
      }
    }
    return results
  }
}
