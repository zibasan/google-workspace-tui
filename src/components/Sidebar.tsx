import { Box, Text } from "ink";
import type { Space } from "../types/chat.js";
import { SpaceItem } from "./SpaceItem.js";

interface SidebarProps {
	spaces: Space[];
	selectedIndex: number;
	isFocused: boolean;
	width: number;
	height: number;
	loading: boolean;
}

export const Sidebar = ({
	spaces,
	selectedIndex,
	isFocused,
	width,
	height,
	loading,
}: SidebarProps) => {
	const channels = spaces.filter((s) => s.type !== "dm");
	const dms = spaces.filter((s) => s.type === "dm");

	return (
		<Box
			flexDirection="column"
			width={width}
			height={height}
			paddingRight={1}
			overflow="hidden"
		>
			{/* Spaces Section */}
			<Box marginBottom={0}>
				<Text bold color={isFocused ? "blueBright" : "gray"}>
					Spaces
				</Text>
				{loading && <Text dimColor> ⟳</Text>}
			</Box>

			{channels.map((space) => {
				const index = spaces.findIndex((s) => s.id === space.id);
				return (
					<SpaceItem
						key={space.id}
						space={space}
						isSelected={index === selectedIndex}
						isFocused={isFocused}
						width={width - 1}
					/>
				);
			})}

			{/* Direct Messages Section */}
			<Box marginTop={1} marginBottom={0}>
				<Text bold color={isFocused ? "blueBright" : "gray"}>
					Direct Messages
				</Text>
			</Box>

			{dms.map((space) => {
				const index = spaces.findIndex((s) => s.id === space.id);
				return (
					<SpaceItem
						key={space.id}
						space={space}
						isSelected={index === selectedIndex}
						isFocused={isFocused}
						width={width - 1}
					/>
				);
			})}
		</Box>
	);
};
