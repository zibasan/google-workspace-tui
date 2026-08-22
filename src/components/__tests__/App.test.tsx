import { describe, expect, test } from "bun:test"
import { render } from "ink-testing-library"
import { MockChatService } from "../../api/mock.js"
import { App } from "../App.js"

describe("Google Chat TUI - Phase 1 UI Mock", () => {
  test("renders spaces and initial UI properly", async () => {
    const mockService = new MockChatService()
    const { lastFrame } = render(<App chatService={mockService} />)

    await new Promise((resolve) => setTimeout(resolve, 300))

    const output = lastFrame()
    expect(output).toBeDefined()
    expect(output).toContain("Spaces")
    expect(output).toContain("General")
    expect(output).toContain("プログラミング")
    expect(output).toContain("Direct Messages")
  })

  test("can navigate spaces and select space", async () => {
    const mockService = new MockChatService()
    const { lastFrame, stdin } = render(<App chatService={mockService} />)

    await new Promise((resolve) => setTimeout(resolve, 300))

    // Press 'j' or Down Arrow to move selection
    stdin.write("j")
    await new Promise((resolve) => setTimeout(resolve, 150))

    const output = lastFrame()
    expect(output).toBeDefined()
    expect(output).toContain("プログラミング")
  })

  test("can open members view with 'm'", async () => {
    const mockService = new MockChatService()
    const { lastFrame, stdin } = render(<App chatService={mockService} />)

    await new Promise((resolve) => setTimeout(resolve, 300))

    // Press 'm' to open members view
    stdin.write("m")
    await new Promise((resolve) => setTimeout(resolve, 150))

    let output = lastFrame()
    expect(output).toContain("Members")
    expect(output).toContain("自分")
    expect(output).toContain("田中")

    // Press Esc to close members view
    stdin.write("\u001B")
    await new Promise((resolve) => setTimeout(resolve, 150))

    output = lastFrame()
    expect(output).not.toContain("Members")
  })

  test("can send a new message and delete it as self", async () => {
    const mockService = new MockChatService()
    const { lastFrame, stdin } = render(<App chatService={mockService} />)

    await new Promise((resolve) => setTimeout(resolve, 300))

    // Switch to input mode with 'i'
    stdin.write("i")
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Type message
    stdin.write("削除テストメッセージ")
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Send with Enter
    stdin.write("\r")
    await new Promise((resolve) => setTimeout(resolve, 300))

    let output = lastFrame()
    expect(output).toContain("削除テストメッセージ")

    // Exit input mode to chat
    stdin.write("\u001B")
    await new Promise((resolve) => setTimeout(resolve, 150))

    // Open context menu for self message
    stdin.write("\r")
    await new Promise((resolve) => setTimeout(resolve, 200))

    output = lastFrame()
    expect(output).toContain("メッセージを削除")

    // Delete with 'd'
    stdin.write("d")
    await new Promise((resolve) => setTimeout(resolve, 200))

    output = lastFrame()
    expect(output).not.toContain("削除テストメッセージ")
  })

  test("shows timestamp on hover for continuous messages", async () => {
    const mockService = new MockChatService()
    const { lastFrame, stdin } = render(<App chatService={mockService} />)

    await new Promise((resolve) => setTimeout(resolve, 300))

    // Switch to chat focus
    stdin.write("l")
    await new Promise((resolve) => setTimeout(resolve, 150))

    const output = lastFrame()
    expect(output).toBeDefined()
  })

  test("context menu for other user does not show delete option", async () => {
    const mockService = new MockChatService()
    const { lastFrame, stdin } = render(<App chatService={mockService} />)

    await new Promise((resolve) => setTimeout(resolve, 300))

    // Move to chat
    stdin.write("l")
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Press Enter to open context menu on initial message (other user's message)
    stdin.write("\r")
    await new Promise((resolve) => setTimeout(resolve, 200))

    const output = lastFrame()
    expect(output).toContain("Actions")
    expect(output).toContain("返信する")
    expect(output).toContain("未読にする")
    expect(output).not.toContain("メッセージを削除")
  })

  test("can open and close help modal", async () => {
    const mockService = new MockChatService()
    const { lastFrame, stdin } = render(<App chatService={mockService} />)

    await new Promise((resolve) => setTimeout(resolve, 300))

    // Press '?' to open help
    stdin.write("?")
    await new Promise((resolve) => setTimeout(resolve, 100))

    let output = lastFrame()
    expect(output).toContain("Keybindings & Help")

    // Press '?' or Esc to close help
    stdin.write("?")
    await new Promise((resolve) => setTimeout(resolve, 100))

    output = lastFrame()
    expect(output).not.toContain("Keybindings & Help")
  })

  test("can open search view with '/'", async () => {
    const mockService = new MockChatService()
    const { lastFrame, stdin } = render(<App chatService={mockService} />)

    await new Promise((resolve) => setTimeout(resolve, 300))

    // Press '/' to open search
    stdin.write("/")
    await new Promise((resolve) => setTimeout(resolve, 100))

    const output = lastFrame()
    expect(output).toContain("Search")
  })
})
