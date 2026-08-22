import { Box } from "ink"
import type { Message, Space } from "../types/chat.js"
import { ChatHeader } from "./ChatHeader.js"
import { ContextMenu } from "./ContextMenu.js"
import { MessageInput } from "./MessageInput.js"
import { MessageList } from "./MessageList.js"

interface ChatViewProps {
  space: Space | null
  messages: Message[]
  selectedMessageIndex: number
  inputValue: string
  cursorPos: number
  isChatFocused: boolean
  isInputFocused: boolean
  isContextMenuOpen: boolean
  contextMenuIndex: number
  loading: boolean
  sending: boolean
  width: number
  height: number
}

export const ChatView = ({
  space,
  messages,
  selectedMessageIndex,
  inputValue,
  cursorPos,
  isChatFocused,
  isInputFocused,
  isContextMenuOpen,
  contextMenuIndex,
  loading,
  sending,
  width,
  height,
}: ChatViewProps) => {
  // Fixed heights
  const headerHeight = space?.description ? 3 : 2
  const inputHeight = isInputFocused ? 4 : 3
  const contextMenuHeight = isContextMenuOpen ? 10 : 0
  const messageListHeight = Math.max(
    2,
    height - headerHeight - inputHeight - contextMenuHeight,
  )

  const selectedMessage = messages[selectedMessageIndex] ?? null

  return (
    <Box flexDirection="column" width={width} height={height} overflow="hidden">
      <ChatHeader space={space} loading={loading} width={width} />
      <MessageList
        messages={messages}
        selectedMessageIndex={selectedMessageIndex}
        isFocused={isChatFocused || isContextMenuOpen}
        loading={loading}
        width={width}
        height={messageListHeight}
      />
      {isContextMenuOpen && selectedMessage && (
        <ContextMenu
          targetMessage={selectedMessage}
          selectedIndex={contextMenuIndex}
          width={width}
        />
      )}
      <MessageInput
        value={inputValue}
        cursorPos={cursorPos}
        isFocused={isInputFocused}
        sending={sending}
        width={width}
      />
    </Box>
  )
}
