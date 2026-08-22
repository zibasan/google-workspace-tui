import { Box, Text } from "ink";

export const App = () => {
	return (
		<Box flexDirection="column" padding={1}>
			<Text color="green">Google Chat TUI</Text>
			<Text dimColor>Phase 0: Environment initialized successfully.</Text>
		</Box>
	);
};
