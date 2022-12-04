import { getInputStrings } from "../utils";

type Range = [number, number];
type RangePair = [Range, Range];

/**
 * A little utility to narrow from an array to a tuple of length 2
 */
const isPair = <T>(elements: T[]): elements is [T, T] => elements.length === 2;

/**
 * Parse strings of the form "3-42" to Range
 */
const toRange = (instruction: string): Range => {
	const bounds = instruction.split("-").map((str) => parseInt(str));
	if (isPair(bounds)) return bounds;
	throw new Error(`Unrecognised instruction: ${instruction}`);
};

/**
 * Parse strings of the form "1-12,3-42" to RangePair
 */
const toRangePair = (line: string): RangePair => {
	const nums = line.split(",").map(toRange);
	if (isPair(nums)) return nums;
	throw new Error(`Unrecognised line: ${line}`);
};

/**
 * Returns true if either range fully overlaps the other
 */
const fullyOverlaps = ([[aStart, aEnd], [bStart, bEnd]]: RangePair): boolean =>
	(aStart <= bStart && aEnd >= bEnd) || (bStart <= aStart && bEnd >= aEnd);

export const solvePart1 = (filePath: string) =>
	getInputStrings(filePath).map(toRangePair).filter(fullyOverlaps).length;

/**
 * Returns true if there is any overlap at all between the two ranges
 */
const partiallyOverlaps = ([
	[aStart, aEnd],
	[bStart, bEnd],
]: RangePair): boolean =>
	(aStart <= bEnd && aEnd >= bStart) || (bStart <= aEnd && bEnd >= aStart);

export const solvePart2 = (filePath: string) =>
	getInputStrings(filePath).map(toRangePair).filter(partiallyOverlaps).length;
