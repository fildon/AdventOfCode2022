type Packet = Array<number | Packet>;

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
	if (Array.isArray(aHead)) {
		if (Array.isArray(bHead)) {
			return compare(aHead, bHead) || compare(aTail, bTail);
		} else {
			return compare(aHead, [bHead]) || compare(aTail, bTail);
		}
	} else {
		if (Array.isArray(bHead)) {
			return compare([aHead], bHead) || compare(aTail, bTail);
		} else {
			return aHead - bHead || compare(aTail, bTail);
		}
	}
};

export const solvePart1 = (filePath: string) => {
	return -1;
};
