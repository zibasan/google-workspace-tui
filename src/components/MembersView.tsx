import { Box, Text } from "ink"
import type { Space, User } from "../types/chat.js"

interface MembersViewProps {
  space: Space | null
  members: User[]
  selectedIndex: number
  loading: boolean
  width: number
  height: number
}

export const MembersView = ({
  space,
  members,
  selectedIndex,
  loading,
  width,
  height,
}: MembersViewProps) => {
  const listHeight = Math.max(1, height - 3)
  const visibleCount = Math.max(1, listHeight)

  let start = Math.max(0, selectedIndex - Math.floor(visibleCount / 2))
  if (start + visibleCount > members.length) {
    start = Math.max(0, members.length - visibleCount)
  }
  const end = Math.min(members.length, start + visibleCount)
  const visibleMembers = members
    .slice(start, end)
    .map((user, idx) => ({ user, originalIdx: start + idx }))

  return (
    <Box flexDirection="column" width={width} height={height} overflow="hidden">
      <Box width={width} justifyContent="space-between">
        <Box>
          <Text bold color="cyan">
            Members
          </Text>
          <Text dimColor> ({space ? space.name : ""})</Text>
        </Box>
        <Text color="blueBright">{members.length} 名</Text>
      </Box>
      <Text color="gray">{"─".repeat(Math.max(1, width))}</Text>

      <Box
        flexDirection="column"
        height={listHeight}
        overflow="hidden"
        marginTop={0}
      >
        {loading ? (
          <Text color="yellow">メンバー一覧を読み込み中... ⟳</Text>
        ) : members.length === 0 ? (
          <Text dimColor>メンバーが見つかりませんでした</Text>
        ) : (
          visibleMembers.map(({ user, originalIdx }) => {
            const isSelected = originalIdx === selectedIndex
            const pointer = isSelected ? "> " : "  "
            const isSelf = user.id === "user-self"
            const statusDot = user.isOnline ? "● " : "○ "
            const statusColor = user.isOnline ? "green" : "gray"

            return (
              <Box key={user.id} width={width} justifyContent="space-between">
                <Box>
                  <Text color={isSelected ? "cyan" : "gray"}>{pointer}</Text>
                  <Text color={statusColor}>{statusDot}</Text>
                  <Text
                    color={isSelected ? "cyan" : "white"}
                    bold={isSelected || isSelf}
                  >
                    {user.name}
                  </Text>
                  {isSelf && <Text dimColor> (自分)</Text>}
                </Box>
                <Text dimColor>
                  {user.isOnline ? "オンライン" : "オフライン"}
                </Text>
              </Box>
            )
          })
        )}
      </Box>
    </Box>
  )
}
