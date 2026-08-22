import { useCallback, useEffect, useState } from "react"
import type { ChatService } from "../api/chat.js"
import type { Message } from "../types/chat.js"

export function useMessages(chatService: ChatService, spaceId: string | null) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMessages = useCallback(async () => {
    if (!spaceId) {
      setMessages([])
      return
    }
    try {
      setLoading(true)
      setError(null)
      const items = await chatService.getMessages(spaceId)
      setMessages(items)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "メッセージの取得に失敗しました",
      )
    } finally {
      setLoading(false)
    }
  }, [chatService, spaceId])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const sendMessage = useCallback(
    async (text: string) => {
      if (!spaceId || !text.trim() || sending) return
      try {
        setSending(true)
        const newMsg = await chatService.sendMessage(spaceId, text.trim())
        setMessages((prev) => [...prev, newMsg])
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "メッセージの送信に失敗しました",
        )
      } finally {
        setSending(false)
      }
    },
    [chatService, spaceId, sending],
  )

  const deleteMessage = useCallback(
    async (messageId: string) => {
      if (!spaceId) return
      try {
        await chatService.deleteMessage(spaceId, messageId)
        setMessages((prev) => prev.filter((m) => m.id !== messageId))
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "メッセージの削除に失敗しました",
        )
      }
    },
    [chatService, spaceId],
  )

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    deleteMessage,
    refreshMessages: fetchMessages,
  }
}
