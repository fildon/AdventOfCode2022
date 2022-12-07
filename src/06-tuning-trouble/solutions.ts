import { getInput } from "../utils";

export const solvePart1 = (filePath: string): number => {
	const datastream = getInput(filePath);

	for (let i = 3; i < datastream.length; i++) {
		if (
			new Set([
				datastream[i - 3],
				datastream[i - 2],
				datastream[i - 1],
				datastream[i],
			]).size === 4
		) {
			return i + 1;
		}
	}

	throw new Error("No marker found");
};

export const solvePart2 = (filePath: string): number => {
	const datastream = getInput(filePath);

	for (let i = 13; i < datastream.length; i++) {
		if (
			new Set([
				datastream[i - 13],
				datastream[i - 12],
				datastream[i - 11],
				datastream[i - 10],
				datastream[i - 9],
				datastream[i - 8],
				datastream[i - 7],
				datastream[i - 6],
				datastream[i - 5],
				datastream[i - 4],
				datastream[i - 3],
				datastream[i - 2],
				datastream[i - 1],
				datastream[i],
			]).size === 14
		) {
			return i + 1;
		}
	}

	throw new Error("No marker found");
};
