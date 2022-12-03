import { getInputStrings } from "../utils";

type Container = string[];
type Group = Container[];

const toContainers = (inputLine: string) => [...inputLine];

/**
 * Given sets A and B, return the set of their intersection
 */
const intersect = <Element>(a: Set<Element>, b: Set<Element>) =>
	new Set([...a.values()].filter((value) => b.has(value)));

/**
 * Find all items that appear in all provided containers
 */
const findDuplicates = <Element>(containers: Element[][]) =>
	Array.from(
		containers.map((container) => new Set(container)).reduce(intersect)
	);

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

/**
 * Each rucksack contains exactly one letter that appears in the first and last half
 */
const getRucksackPriority = (ruckSack: Container): number => {
	const compartmentSize = ruckSack.length / 2;
	const firstHalf = ruckSack.slice(0, compartmentSize);
	const secondHalf = ruckSack.slice(compartmentSize);
	return getItemPriority(findDuplicates([firstHalf, secondHalf])[0]);
};

/**
 * @see https://adventofcode.com/2022/day/3
 */
export const solvePart1 = (filePath: string) =>
	getInputStrings(filePath)
		.map(toContainers)
		.map(getRucksackPriority)
		.reduce((a, b) => a + b);

/**
 * Group containers in batches of three
 */
const group = ([currentGroup, ...otherGroups]: Group[], rucksack: Container) =>
	currentGroup.length < 3
		? [[rucksack, ...currentGroup], ...otherGroups]
		: [[rucksack], currentGroup, ...otherGroups];

/**
 * Find the duplicate in the group and return its priority
 */
const getGroupPriority = (group: Group): number =>
	getItemPriority(findDuplicates(group)[0]);

/**
 * @see https://adventofcode.com/2022/day/3#part2
 */
export const solvePart2 = (filePath: string) =>
	getInputStrings(filePath)
		.map(toContainers)
		.reduce(group, [[]]) // Second arg is the initially empty group
		.map(getGroupPriority)
		.reduce((a, b) => a + b);
