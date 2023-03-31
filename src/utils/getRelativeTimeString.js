export const getRelativeTimeString = (date, lang = navigator.language) => {
	const timeMs = typeof date === "number" ? date : date.getTime();
	const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
	const cutoffs = [
		60,
		3_600,
		86_400,
		86_400 * 7,
		86_400 * 30,
		86_400 * 365,
		Infinity,
	];
	const units = ["second", "minute", "hour", "day", "week", "month", "year"];

	const unitIndex = cutoffs.findIndex(
		(cutoff) => cutoff > Math.abs(deltaSeconds)
	);

	const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

	const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });

	return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
};
