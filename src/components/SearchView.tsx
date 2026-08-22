import { Box, Text } from "ink"
import type { Message, Space } from "../types/chat.js"
import { formatMessageTime } from "../utils/format.js"

interface SearchResultItem {
  space: Space
  message: Message
}

interface SearchViewProps {
  query: string
  results: SearchResultItem[]
  selectedIndex: number
  searching: boolean
  width: number
  height: number
}

export const SearchView = ({
  query,
  results,
  selectedIndex,
  searching,
  width,
  height,
}: SearchViewProps) => {
  // Search header: 3 lines
  const listHeight = Math.max(1, height - 4)
  const visibleCount = Math.max(1, Math.floor(listHeight / 3))

  let start = Math.max(0, selectedIndex - Math.floor(visibleCount / 2))
  if (start + visibleCount > results.length) {
    start = Math.max(0, results.length - visibleCount)
  }
  const end = Math.min(results.length, start + visibleCount)
  const visibleResults = results
    .slice(start, end)
    .map((item, idx) => ({ item, originalIdx: start + idx }))

  return (
    <Box flexDirection="column" width={width} height={height} overflow="hidden">
      <Box marginBottom={0}>
        <Text bold color="cyan">
          Search
        </Text>
      </Box>
      <Box>
        <Text color="cyan">&gt; </Text>
        <Text color="white">{query}█</Text>
        {searching && <Text color="yellow"> Searching... ⟳</Text>}
      </Box>
      <Text color="gray">{"─".repeat(Math.max(1, width))}</Text>

      <Box flexDirection="column" height={listHeight} overflow="hidden">
        {query.trim().length === 0 ? (
          <Text dimColor>
            キーワードを入力してください (Enterで確定、Escでキャンセル)
          </Text>
        ) : results.length === 0 && !searching ? (
          <Text dimColor>一致するメッセージは見つかりませんでした</Text>
        ) : (
          <Box flexDirection="column">
            <Box marginBottom={0}>
              <Text bold color="blueBright">
                Search results ({results.length} 件)
              </Text>
            </Box>
            {visibleResults.map(({ item, originalIdx }) => {
              const isSelected = originalIdx === selectedIndex
              const spacePrefix = item.space.type === "dm" ? "@" : "#"
              const timeStr = formatMessageTime(item.message.createTime)

              return (
                <Box
                  key={item.message.id}
                  flexDirection="column"
                  marginBottom={0}
                  paddingLeft={isSelected ? 1 : 0}
                >
                  <Box>
                    <Text color={isSelected ? "cyan" : "gray"}>
                      {isSelected ? "> " : "  "}
                    </Text>
                    <Text bold color="blue">
                      {spacePrefix} {item.space.name}
                    </Text>
                    <Text dimColor> • </Text>
                    <Text bold color="white">
                      {item.message.sender.name}
                    </Text>
                    <Text dimColor> {timeStr}</Text>
                  </Box>
                  <Box paddingLeft={2}>
                    <Text color={isSelected ? "cyan" : "gray"} wrap="truncate">
                      {item.message.text}
                    </Text>
                  </Box>
                </Box>
              )
            })}
          </Box>
        )}
      </Box>
    </Box>
  )
}
