import { describe, expect, test } from "bun:test";
import { render } from "ink-testing-library";
import { MockChatService } from "../../api/mock.js";
import { App } from "../App.js";

describe("Google Chat TUI - Phase 1 UI Mock", () => {
	test("renders spaces and initial UI properly", async () => {
		const mockService = new MockChatService();
		const { lastFrame } = render(<App chatService={mockService} />);

		// Wait for initial mock async loading
		await new Promise((resolve) => setTimeout(resolve, 200));

		const output = lastFrame();
		expect(output).toBeDefined();
		expect(output).toContain("Spaces");
		expect(output).toContain("General");
		expect(output).toContain("プログラミング");
		expect(output).toContain("Direct Messages");
	});

	test("can navigate spaces and select space", async () => {
		const mockService = new MockChatService();
		const { lastFrame, stdin } = render(<App chatService={mockService} />);

		await new Promise((resolve) => setTimeout(resolve, 200));

		// Press 'j' or Down Arrow to move selection
		stdin.write("j");
		await new Promise((resolve) => setTimeout(resolve, 100));

		const output = lastFrame();
		expect(output).toBeDefined();
		expect(output).toContain("プログラミング");
	});

	test("can open and close help modal", async () => {
		const mockService = new MockChatService();
		const { lastFrame, stdin } = render(<App chatService={mockService} />);

		await new Promise((resolve) => setTimeout(resolve, 200));

		// Press '?' to open help
		stdin.write("?");
		await new Promise((resolve) => setTimeout(resolve, 50));

		let output = lastFrame();
		expect(output).toContain("Keybindings & Help");

		// Press '?' or Esc to close help
		stdin.write("?");
		await new Promise((resolve) => setTimeout(resolve, 50));

		output = lastFrame();
		expect(output).not.toContain("Keybindings & Help");
	});

	test("can open search view with '/'", async () => {
		const mockService = new MockChatService();
		const { lastFrame, stdin } = render(<App chatService={mockService} />);

		await new Promise((resolve) => setTimeout(resolve, 200));

		// Press '/' to open search
		stdin.write("/");
		await new Promise((resolve) => setTimeout(resolve, 50));

		const output = lastFrame();
		expect(output).toContain("Search");
	});
});
