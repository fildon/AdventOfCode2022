import { getInputStrings } from "../utils";

const getElfInventories = (inputLines: string[]) =>
	// We store inventories as a stack of numbers
	// Each number is the total calories read so far in that inventory
	// We push each new inventory onto the head of the stack
	inputLines.reduce(
		([currentInventory, ...otherInventories], line) =>
			// If a line is empty it is the border between two inventories
			// So we use that to start a new inventory with a value of zero
			// Otherwise we add the value of the line to the latest inventory.
			line.length === 0
				? [0, currentInventory, ...otherInventories]
				: [currentInventory + parseInt(line), ...otherInventories],
		[0]
	);

/**
 * Find the Elf carrying the most Calories. How many total Calories is that Elf carrying?
 *
 * @see https://adventofcode.com/2022/day/1
 */
export const solvePart1 = (filePath: string) =>
	getElfInventories(getInputStrings(filePath)).reduce(
		(greatest, elf) => Math.max(greatest, elf),
		-Infinity
	);

/**
 * Find the top three Elves carrying the most Calories. How many Calories are those Elves carrying in total?
 *
 * @see https://adventofcode.com/2022/day/1#part2
 */
export const solvePart2 = (filePath: string) =>
	getElfInventories(getInputStrings(filePath))
		// Descending sort, puts largest values at the beginning
		.sort((a, b) => b - a)
		// Take the first/largest three
		.slice(0, 3)
		// Sum
		.reduce((acc, curr) => acc + curr);
