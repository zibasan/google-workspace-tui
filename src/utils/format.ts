export function formatMessageTime(date: Date): string {
	const now = new Date();
	const isToday =
		date.getFullYear() === now.getFullYear() &&
		date.getMonth() === now.getMonth() &&
		date.getDate() === now.getDate();

	const yesterday = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate() - 1,
	);
	const isYesterday =
		date.getFullYear() === yesterday.getFullYear() &&
		date.getMonth() === yesterday.getMonth() &&
		date.getDate() === yesterday.getDate();

	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const timeStr = `${hours}:${minutes}`;

	if (isToday) {
		return timeStr;
	}
	if (isYesterday) {
		return `昨日 ${timeStr}`;
	}
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return `${month}/${day} ${timeStr}`;
}
