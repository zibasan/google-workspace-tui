import { Box, Text } from "ink"
import type { Message } from "../types/chat.js"
import { formatMessageTime } from "../utils/format.js"

interface MessageItemProps {
  message: Message
  previousMessage?: Message
  isSelected?: boolean
  isFocused?: boolean
  width: number
}

export const MessageItem = ({
  message,
  previousMessage,
  isSelected = false,
  isFocused = false,
  width,
}: MessageItemProps) => {
  // 同一ユーザーかつ3分以内の連続投稿判定
  const isSameUserAsPrev = Boolean(
    previousMessage &&
      previousMessage.sender.id === message.sender.id &&
      Math.abs(
        message.createTime.getTime() - previousMessage.createTime.getTime(),
      ) <
        3 * 60 * 1000,
  )

  const timeStr = formatMessageTime(message.createTime)
  const isSelf = message.sender.id === "user-self"

  // 選択中インジケータ（常に2文字幅でインデントを完全固定）
  const pointer = isSelected ? (isFocused ? "> " : "› ") : "  "
  const pointerColor = isFocused ? "cyan" : "gray"
  const contentWidth = Math.max(10, width - 2)

  return (
    <Box
      flexDirection="column"
      width={width}
      marginTop={isSameUserAsPrev ? 0 : previousMessage ? 1 : 0}
    >
      {!isSameUserAsPrev && (
        <Box width={width}>
          <Text color={pointerColor} bold={isSelected}>
            {pointer}
          </Text>
          <Text bold color={isSelf ? "green" : "blueBright"}>
            {message.sender.name}
          </Text>
          <Text dimColor> {timeStr}</Text>
        </Box>
      )}

      <Box width={width}>
        <Text color={pointerColor} bold={isSelected}>
          {isSameUserAsPrev ? pointer : "  "}
        </Text>
        <Box width={contentWidth}>
          <Text color="white" bold={isSelected && isFocused} wrap="wrap">
            {message.text}
            {isSameUserAsPrev && isSelected && <Text dimColor> {timeStr}</Text>}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
