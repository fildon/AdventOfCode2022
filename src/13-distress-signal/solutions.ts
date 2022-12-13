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

export const solvePart1 = (filePath: string) => {
	return -1;
};
