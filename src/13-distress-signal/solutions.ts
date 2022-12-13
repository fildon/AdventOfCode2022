import { getInput, getInputStrings, product, sum } from "../utils";

type Packet = Array<number | Packet>;

const forceArray = (value: number | Packet): Packet =>
	Array.isArray(value) ? value : [value];

/**
 * Implements a Total Order over the Packet type
 *
 * @returns a negative value if a < b
 * @returns zero if a = b
 * @returns a positive value is a > b
 */
export const compare = (a: Packet, b: Packet): number => {
	// If either is empty then we can immediately return the difference of their lengths
	if (a.length === 0 || b.length === 0) return a.length - b.length;

	const [aHead, ...aTail] = a;
	const [bHead, ...bTail] = b;

	// If both heads are numbers, compare directly. Recurse on tail in case of tie.
	if (!Array.isArray(aHead) && !Array.isArray(bHead))
		return aHead - bHead || compare(aTail, bTail);

	// Compare both as though they were arrays. Recurse on tail in case of tie.
	return compare(forceArray(aHead), forceArray(bHead)) || compare(aTail, bTail);
};

export const solvePart1 = (filePath: string) =>
	getInput(filePath)
		.split("\n\n")
		.map((pairsString) =>
			pairsString.split("\n").map((line) => JSON.parse(line) as Packet)
		)
		.map(([a, b]) => compare(a, b))
		// Note: convert to 1-index here
		.map((order, i) => ({ index: i + 1, order }))
		// Take only the correctly ordered results
		.filter(({ order }) => order < 0)
		// Add up all the indexes of the correctly ordered results
		.map(({ index }) => index)
		.reduce(sum);

const dividers: Array<Packet> = [[[2]], [[6]]];
export const solvePart2 = (filePath: string) =>
	[
		...dividers,
		...getInputStrings(filePath)
			.filter((line) => line.length > 0)
			.map((line) => JSON.parse(line) as Packet),
	]
		.sort(compare)
		// Note: convert to 1-index here
		.map((packet, i) => ({ index: i + 1, packet }))
		// Find the dividers
		.filter(({ packet }) => dividers.includes(packet))
		// Return the product of their indexes
		.map(({ index }) => index)
		.reduce(product, 1);
