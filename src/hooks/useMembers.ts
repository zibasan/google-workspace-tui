import { useCallback, useEffect, useState } from "react"
import type { ChatService } from "../api/chat.js"
import type { User } from "../types/chat.js"

export function useMembers(chatService: ChatService, spaceId: string | null) {
  const [members, setMembers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMembers = useCallback(async () => {
    if (!spaceId) {
      setMembers([])
      return
    }
    try {
      setLoading(true)
      setError(null)
      const items = await chatService.getMembers(spaceId)
      setMembers(items)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "メンバーの取得に失敗しました",
      )
    } finally {
      setLoading(false)
    }
  }, [chatService, spaceId])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  return {
    members,
    loading,
    error,
    refreshMembers: fetchMembers,
  }
}
