import { getInput } from "../utils";

export const solvePart1 = (filePath: string): number => {
	const datastream = getInput(filePath);

	for (let i = 3; i < datastream.length; i++) {
		if (
			[
				...new Set([
					datastream[i - 3],
					datastream[i - 2],
					datastream[i - 1],
					datastream[i],
				]).values(),
			].length === 4
		) {
			return i + 1;
		}
	}

	throw new Error("No marker found");
};
