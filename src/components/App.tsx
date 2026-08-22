import { Box, useApp, useInput } from "ink"
import { useCallback, useEffect, useMemo, useState } from "react"
import type { ChatService } from "../api/chat.js"
import { MockChatService } from "../api/mock.js"
import { useMembers } from "../hooks/useMembers.js"
import { useMessages } from "../hooks/useMessages.js"
import { useSpaces } from "../hooks/useSpaces.js"
import { useTerminalSize } from "../hooks/useTerminalSize.js"
import type { Message, Space } from "../types/chat.js"
import type { FocusArea } from "../types/ui.js"
import { ChatView } from "./ChatView.js"
import { getContextMenuItems } from "./ContextMenu.js"
import { HelpModal } from "./HelpModal.js"
import { MembersView } from "./MembersView.js"
import { SearchView } from "./SearchView.js"
import { Sidebar } from "./Sidebar.js"
import { StatusBar } from "./StatusBar.js"

interface AppProps {
  chatService?: ChatService
}

export const App = ({ chatService: customService }: AppProps) => {
  const chatService = useMemo(
    () => customService ?? new MockChatService(),
    [customService],
  )
  const { exit } = useApp()
  const { columns, rows, layoutMode } = useTerminalSize()

  // Domain states
  const {
    spaces,
    loading: loadingSpaces,
    refreshSpaces,
  } = useSpaces(chatService)
  const [selectedSpaceIndex, setSelectedSpaceIndex] = useState(0)

  const currentSpace: Space | null = spaces[selectedSpaceIndex] ?? null
  const currentSpaceId = currentSpace?.id ?? null

  const {
    messages,
    loading: loadingMessages,
    sending,
    sendMessage,
    deleteMessage,
    refreshMessages,
  } = useMessages(chatService, currentSpaceId)

  const { members, loading: loadingMembers } = useMembers(
    chatService,
    currentSpaceId,
  )

  // UI states
  const [focusArea, setFocusArea] = useState<FocusArea>("sidebar")
  const [singleView, setSingleView] = useState<"sidebar" | "chat">("sidebar")
  const [selectedMessageIndex, setSelectedMessageIndex] = useState(0)
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(0)
  const [showHelp, setShowHelp] = useState(false)

  // Context Menu states
  const [contextMenuIndex, setContextMenuIndex] = useState(0)

  // Input states
  const [inputText, setInputText] = useState("")
  const [inputCursor, setInputCursor] = useState(0)

  // Search states
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<
    { space: Space; message: Message }[]
  >([])
  const [searchSelectedIndex, setSearchSelectedIndex] = useState(0)
  const [searching, setSearching] = useState(false)

  // Current target message and menu items
  const currentSelectedMessage = messages[selectedMessageIndex] ?? null
  const isCurrentMessageSelf = currentSelectedMessage?.sender.id === "user-self"
  const currentMenuItems = useMemo(
    () => getContextMenuItems(Boolean(isCurrentMessageSelf)),
    [isCurrentMessageSelf],
  )

  // Keep message index at newest when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setSelectedMessageIndex(messages.length - 1)
    } else {
      setSelectedMessageIndex(0)
    }
  }, [messages.length])

  // Search execution
  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([])
        return
      }
      setSearching(true)
      try {
        const results = await chatService.searchMessages(query)
        setSearchResults(results)
        setSearchSelectedIndex(0)
      } finally {
        setSearching(false)
      }
    },
    [chatService],
  )

  // Execute action from context menu
  const executeContextAction = useCallback(
    async (actionId: string) => {
      const targetMessage = messages[selectedMessageIndex]
      if (!targetMessage) {
        setFocusArea("chat")
        return
      }

      if (actionId === "reply") {
        // Note: Phase 1 uses mention template. Thread replies will be hooked into Chat API in later phases.
        const replyPrefix = `@${targetMessage.sender.name} `
        setInputText(replyPrefix)
        setInputCursor(replyPrefix.length)
        setFocusArea("input")
      } else if (actionId === "new_message") {
        setInputText("")
        setInputCursor(0)
        setFocusArea("input")
      } else if (actionId === "mark_unread") {
        if (currentSpaceId) {
          await chatService.markAsUnread(currentSpaceId)
          refreshSpaces()
        }
        setFocusArea("chat")
      } else if (actionId === "delete") {
        if (targetMessage.sender.id === "user-self") {
          await deleteMessage(targetMessage.id)
        }
        setFocusArea("chat")
      } else {
        // copy_link, copy_text, cancel
        setFocusArea("chat")
      }
    },
    [
      messages,
      selectedMessageIndex,
      currentSpaceId,
      chatService,
      refreshSpaces,
      deleteMessage,
    ],
  )

  // Global / Area Key handling
  useInput((input, key) => {
    // Global Help Modal Toggle
    if (showHelp) {
      if (key.escape || input === "?") {
        setShowHelp(false)
      }
      return
    }

    if (
      focusArea !== "input" &&
      focusArea !== "search" &&
      focusArea !== "context-menu" &&
      focusArea !== "members"
    ) {
      if (input === "?") {
        setShowHelp(true)
        return
      }
      if (input === "q") {
        exit()
        return
      }
      if (input === "r") {
        refreshSpaces()
        refreshMessages()
        return
      }
      if (input === "/") {
        setFocusArea("search")
        setSearchQuery("")
        setSearchResults([])
        return
      }
      if (input === "m") {
        setSelectedMemberIndex(0)
        setFocusArea("members")
        return
      }
    }

    // 1. Members View Key Handling
    if (focusArea === "members") {
      if (key.escape) {
        setFocusArea(
          layoutMode === "single" && singleView === "chat" ? "chat" : "sidebar",
        )
        return
      }
      if (key.downArrow || input === "j") {
        setSelectedMemberIndex((prev) => Math.min(members.length - 1, prev + 1))
        return
      }
      if (key.upArrow || input === "k") {
        setSelectedMemberIndex((prev) => Math.max(0, prev - 1))
        return
      }
      if (key.return || input === "\r" || input === "\n") {
        const selectedUser = members[selectedMemberIndex]
        if (selectedUser) {
          const mentionPrefix = `@${selectedUser.name} `
          setInputText(mentionPrefix)
          setInputCursor(mentionPrefix.length)
          if (layoutMode === "single") {
            setSingleView("chat")
          }
          setFocusArea("input")
        }
        return
      }
      return
    }

    // 2. Context Menu Key Handling
    if (focusArea === "context-menu") {
      if (key.escape) {
        setFocusArea("chat")
        return
      }
      if (key.downArrow || input === "j") {
        setContextMenuIndex((prev) =>
          Math.min(currentMenuItems.length - 1, prev + 1),
        )
        return
      }
      if (key.upArrow || input === "k") {
        setContextMenuIndex((prev) => Math.max(0, prev - 1))
        return
      }
      if (key.return || input === "\r" || input === "\n") {
        const item = currentMenuItems[contextMenuIndex]
        if (item) {
          executeContextAction(item.id)
        }
        return
      }
      if (input === "r") {
        executeContextAction("reply")
        return
      }
      if (input === "m") {
        executeContextAction("new_message")
        return
      }
      if (input === "u") {
        executeContextAction("mark_unread")
        return
      }
      if (input === "l") {
        executeContextAction("copy_link")
        return
      }
      if (input === "c") {
        executeContextAction("copy_text")
        return
      }
      if (input === "d" && isCurrentMessageSelf) {
        executeContextAction("delete")
        return
      }
      return
    }

    // 3. Search Mode Key Handling
    if (focusArea === "search") {
      if (key.escape) {
        setFocusArea(
          layoutMode === "single" && singleView === "chat" ? "chat" : "sidebar",
        )
        setSearchQuery("")
        return
      }
      if (key.return || input === "\r" || input === "\n") {
        if (searchResults.length > 0 && searchResults[searchSelectedIndex]) {
          const target = searchResults[searchSelectedIndex]
          const spaceIdx = spaces.findIndex((s) => s.id === target.space.id)
          if (spaceIdx !== -1) {
            setSelectedSpaceIndex(spaceIdx)
            if (layoutMode === "single") {
              setSingleView("chat")
            }
            setFocusArea("chat")
          }
        }
        return
      }
      if (key.upArrow) {
        setSearchSelectedIndex((prev) => Math.max(0, prev - 1))
        return
      }
      if (key.downArrow) {
        setSearchSelectedIndex((prev) =>
          Math.min(searchResults.length - 1, prev + 1),
        )
        return
      }
      if (key.backspace || key.delete) {
        const updated = searchQuery.slice(0, -1)
        setSearchQuery(updated)
        handleSearch(updated)
        return
      }
      if (input && !key.ctrl && !key.meta) {
        const updated = searchQuery + input
        setSearchQuery(updated)
        handleSearch(updated)
        return
      }
      return
    }

    // 4. Input Mode Key Handling
    if (focusArea === "input") {
      if (key.escape) {
        setFocusArea("chat")
        return
      }
      // Alt+Enter / Meta+Enter adds newline
      if (key.meta && (key.return || input === "\r" || input === "\n")) {
        const before = inputText.slice(0, inputCursor)
        const after = inputText.slice(inputCursor)
        setInputText(`${before}\n${after}`)
        setInputCursor((c) => c + 1)
        return
      }
      // Enter sends message
      if (key.return || input === "\r" || input === "\n") {
        if (inputText.trim()) {
          sendMessage(inputText)
          setInputText("")
          setInputCursor(0)
        }
        return
      }
      if (key.backspace || key.delete) {
        if (inputCursor > 0) {
          const before = inputText.slice(0, inputCursor - 1)
          const after = inputText.slice(inputCursor)
          setInputText(before + after)
          setInputCursor((c) => Math.max(0, c - 1))
        }
        return
      }
      if (key.leftArrow) {
        setInputCursor((c) => Math.max(0, c - 1))
        return
      }
      if (key.rightArrow) {
        setInputCursor((c) => Math.min(inputText.length, c + 1))
        return
      }
      if (input && !key.ctrl && !key.meta) {
        const before = inputText.slice(0, inputCursor)
        const after = inputText.slice(inputCursor)
        setInputText(before + input + after)
        setInputCursor((c) => c + input.length)
        return
      }
      return
    }

    // 5. Sidebar Mode Key Handling
    if (focusArea === "sidebar") {
      if (key.downArrow || input === "j") {
        setSelectedSpaceIndex((prev) => Math.min(spaces.length - 1, prev + 1))
        return
      }
      if (key.upArrow || input === "k") {
        setSelectedSpaceIndex((prev) => Math.max(0, prev - 1))
        return
      }
      if (
        key.return ||
        input === "\r" ||
        input === "\n" ||
        input === "l" ||
        key.tab
      ) {
        if (layoutMode === "single") {
          setSingleView("chat")
        }
        setFocusArea("chat")
        return
      }
      if (input === "i") {
        if (layoutMode === "single") {
          setSingleView("chat")
        }
        setFocusArea("input")
        return
      }
      return
    }

    // 6. Chat Mode Key Handling
    if (focusArea === "chat") {
      if (key.escape || input === "h") {
        if (layoutMode === "single") {
          setSingleView("sidebar")
        }
        setFocusArea("sidebar")
        return
      }
      if (key.return || input === "\r" || input === "\n") {
        // Open Context Menu for selected message
        if (messages.length > 0) {
          setContextMenuIndex(0)
          setFocusArea("context-menu")
        }
        return
      }
      if (input === "i") {
        setFocusArea("input")
        return
      }
      if (key.downArrow || input === "j") {
        setSelectedMessageIndex((prev) =>
          Math.min(messages.length - 1, prev + 1),
        )
        return
      }
      if (key.upArrow || input === "k") {
        setSelectedMessageIndex((prev) => Math.max(0, prev - 1))
        return
      }
      if (key.pageDown) {
        setSelectedMessageIndex((prev) =>
          Math.min(messages.length - 1, prev + 5),
        )
        return
      }
      if (key.pageUp) {
        setSelectedMessageIndex((prev) => Math.max(0, prev - 5))
        return
      }
    }
  })

  // Calculations for responsive widths and heights
  const sidebarWidth =
    layoutMode === "wide" ? 26 : layoutMode === "compact" ? 20 : columns
  const chatWidth =
    layoutMode === "single" ? columns : Math.max(20, columns - sidebarWidth)

  // Total available content height (rows - statusBarHeight of 2)
  const contentHeight = Math.max(5, rows - 2)

  return (
    <Box flexDirection="column" width={columns} height={rows} overflow="hidden">
      <Box height={contentHeight} width={columns} overflow="hidden">
        {showHelp ? (
          <HelpModal width={columns} height={contentHeight} />
        ) : focusArea === "members" ? (
          <MembersView
            space={currentSpace}
            members={members}
            selectedIndex={selectedMemberIndex}
            loading={loadingMembers}
            width={columns}
            height={contentHeight}
          />
        ) : focusArea === "search" ? (
          <SearchView
            query={searchQuery}
            results={searchResults}
            selectedIndex={searchSelectedIndex}
            searching={searching}
            width={columns}
            height={contentHeight}
          />
        ) : layoutMode === "single" ? (
          // Single Pane Layout (columns < 70)
          <Box flexDirection="column" width={columns} height={contentHeight}>
            {singleView === "sidebar" ? (
              <Sidebar
                spaces={spaces}
                selectedIndex={selectedSpaceIndex}
                isFocused={focusArea === "sidebar"}
                width={sidebarWidth}
                height={contentHeight}
                loading={loadingSpaces}
              />
            ) : (
              <ChatView
                space={currentSpace}
                messages={messages}
                selectedMessageIndex={selectedMessageIndex}
                inputValue={inputText}
                cursorPos={inputCursor}
                isChatFocused={focusArea === "chat"}
                isInputFocused={focusArea === "input"}
                isContextMenuOpen={focusArea === "context-menu"}
                contextMenuIndex={contextMenuIndex}
                loading={loadingMessages}
                sending={sending}
                width={chatWidth}
                height={contentHeight}
              />
            )}
          </Box>
        ) : (
          // Split Pane Layout (wide or compact)
          <Box flexDirection="row" width={columns} height={contentHeight}>
            <Sidebar
              spaces={spaces}
              selectedIndex={selectedSpaceIndex}
              isFocused={focusArea === "sidebar"}
              width={sidebarWidth}
              height={contentHeight}
              loading={loadingSpaces}
            />
            <Box
              flexDirection="column"
              paddingLeft={1}
              width={chatWidth}
              height={contentHeight}
            >
              <ChatView
                space={currentSpace}
                messages={messages}
                selectedMessageIndex={selectedMessageIndex}
                inputValue={inputText}
                cursorPos={inputCursor}
                isChatFocused={focusArea === "chat"}
                isInputFocused={focusArea === "input"}
                isContextMenuOpen={focusArea === "context-menu"}
                contextMenuIndex={contextMenuIndex}
                loading={loadingMessages}
                sending={sending}
                width={chatWidth - 1}
                height={contentHeight}
              />
            </Box>
          </Box>
        )}
      </Box>

      <StatusBar
        focusArea={focusArea}
        layoutMode={layoutMode}
        isSingleChatActive={layoutMode === "single" && singleView === "chat"}
        width={columns}
      />
    </Box>
  )
}
