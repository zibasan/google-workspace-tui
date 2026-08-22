import { useCallback, useEffect, useState } from "react";
import type { ChatService } from "../api/chat.js";
import type { Space } from "../types/chat.js";

export function useSpaces(chatService: ChatService) {
	const [spaces, setSpaces] = useState<Space[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchSpaces = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const items = await chatService.listSpaces();
			setSpaces(items);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "スペースの取得に失敗しました",
			);
		} finally {
			setLoading(false);
		}
	}, [chatService]);

	useEffect(() => {
		fetchSpaces();
	}, [fetchSpaces]);

	return {
		spaces,
		loading,
		error,
		refreshSpaces: fetchSpaces,
	};
}
