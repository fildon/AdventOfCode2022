import { getInputStrings } from "../utils";

type Range = [number, number];
type RangePair = [Range, Range];

const isPair = <T>(nums: T[]): nums is [T, T] => nums.length === 2;

const toRange = (instruction: string): Range => {
	const bounds = instruction.split("-").map((str) => parseInt(str));
	if (isPair(bounds)) return bounds;
	throw new Error(`Unrecognised instruction: ${instruction}`);
};

const toRangePair = (line: string): RangePair => {
	const nums = line.split(",").map(toRange);
	if (isPair(nums)) return nums;
	throw new Error(`Unrecognised line: ${line}`);
};

const fullyOverlaps = ([[aStart, aEnd], [bStart, bEnd]]: RangePair): boolean =>
	(aStart <= bStart && aEnd >= bEnd) || (bStart <= aStart && bEnd >= aEnd);

export const solvePart1 = (filePath: string) =>
	getInputStrings(filePath).map(toRangePair).filter(fullyOverlaps).length;

const partiallyOverlaps = ([
	[aStart, aEnd],
	[bStart, bEnd],
]: RangePair): boolean =>
	(aStart <= bEnd && aEnd >= bStart) || (bStart <= aEnd && bEnd >= aStart);

export const solvePart2 = (filePath: string) =>
	getInputStrings(filePath).map(toRangePair).filter(partiallyOverlaps).length;
