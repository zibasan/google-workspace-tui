import { Box, Text } from "ink"
import type { Message } from "../types/chat.js"

export type ContextMenuAction =
  | "reply"
  | "new_message"
  | "mark_unread"
  | "copy_link"
  | "copy_text"
  | "delete"
  | "cancel"

export interface ContextMenuItem {
  id: ContextMenuAction
  label: string
  shortcut?: string
  danger?: boolean
}

export function getContextMenuItems(isSelf: boolean): ContextMenuItem[] {
  const items: ContextMenuItem[] = [
    { id: "reply", label: "返信する", shortcut: "r" },
    { id: "new_message", label: "メッセージを送る", shortcut: "m" },
    { id: "mark_unread", label: "未読にする", shortcut: "u" },
    { id: "copy_link", label: "メッセージリンクをコピー", shortcut: "l" },
    { id: "copy_text", label: "メッセージをコピー", shortcut: "c" },
  ]

  if (isSelf) {
    items.push({
      id: "delete",
      label: "メッセージを削除",
      shortcut: "d",
      danger: true,
    })
  }

  items.push({ id: "cancel", label: "キャンセル", shortcut: "Esc" })
  return items
}

interface ContextMenuProps {
  targetMessage: Message
  selectedIndex: number
  width: number
}

export const ContextMenu = ({
  targetMessage,
  selectedIndex,
  width,
}: ContextMenuProps) => {
  const isSelf = targetMessage.sender.id === "user-self"
  const items = getContextMenuItems(isSelf)
  const menuWidth = Math.min(width, 54)

  return (
    <Box flexDirection="column" width={menuWidth} marginTop={1}>
      <Box width={menuWidth} justifyContent="space-between">
        <Text bold color="cyan">
          Actions
        </Text>
        <Text dimColor>@{targetMessage.sender.name}</Text>
      </Box>
      <Text color="gray">{"─".repeat(Math.max(1, menuWidth))}</Text>

      {items.map((item, idx) => {
        const isSelected = idx === selectedIndex
        const pointer = isSelected ? "> " : "  "
        const textColor = isSelected
          ? item.danger
            ? "red"
            : "cyan"
          : item.danger
            ? "redBright"
            : "white"

        return (
          <Box key={item.id} width={menuWidth} justifyContent="space-between">
            <Box>
              <Text color={isSelected ? "cyan" : "gray"}>{pointer}</Text>
              <Text color={textColor} bold={isSelected}>
                {item.label}
              </Text>
            </Box>
            {item.shortcut && <Text dimColor>[{item.shortcut}]</Text>}
          </Box>
        )
      })}
    </Box>
  )
}
