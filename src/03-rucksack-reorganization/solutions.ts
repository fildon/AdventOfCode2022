import { getInputStrings } from "../utils";
import { strict as assert } from "node:assert";

/**
 * Lowercase item types a through z have priorities 1 through 26.
 * Uppercase item types A through Z have priorities 27 through 52.
 */
const getItemPriority = (item: string): number => {
	const charCode = item.charCodeAt(0);
	// Lowercase charCodes a-z run from 97-122
	// Uppercase charCodes A-Z run from 65-90
	return charCode > 90
		? charCode - "a".charCodeAt(0) + 1
		: charCode - "A".charCodeAt(0) + 27;
};

const itemInEvery = (matchingSets: Set<string>[]) => (item: string) =>
	matchingSets.every((container) => container.has(item));

const findDuplicate = ([headContainer, ...tailContainers]: string[]) => {
	const matchingSets = tailContainers.map(
		(container) => new Set([...container])
	);
	return [...headContainer].find(itemInEvery(matchingSets));
};

/**
 * Each rucksack contains exactly one letter that appears in the first and last half
 */
const getRucksackPriority = (ruckSack: string): number => {
	const compartmentSize = ruckSack.length / 2;
	const firstHalf = ruckSack.slice(0, compartmentSize);
	const secondHalf = ruckSack.slice(compartmentSize);
	const duplicate = findDuplicate([firstHalf, secondHalf]);
	assert(duplicate);
	return getItemPriority(duplicate);
};

/**
 * @see https://adventofcode.com/2022/day/3
 */
export const solvePart1 = (filePath: string) =>
	getInputStrings(filePath)
		.map(getRucksackPriority)
		.reduce((a, b) => a + b);

/**
 * Group each set of three lines
 */
const group = ([currentGroup, ...otherGroups]: string[][], rucksack: string) =>
	currentGroup.length < 3
		? [[rucksack, ...currentGroup], ...otherGroups]
		: [[rucksack], currentGroup, ...otherGroups];

/**
 * Find the duplicate in the group and return its priority
 */
const getGroupPriority = (group: string[]): number => {
	const duplicate = findDuplicate(group);
	assert(duplicate);
	return getItemPriority(duplicate);
};

/**
 * @see https://adventofcode.com/2022/day/3#part2
 */
export const solvePart2 = (filePath: string) =>
	getInputStrings(filePath)
		.reduce(group, [[]])
		.map(getGroupPriority)
		.reduce((a, b) => a + b);
