import { getInputStrings, sum, createLogger } from "../utils";

type Num = {
	value: number;
	position: number;
};

const positiveMod = (value: number, mod: number) =>
	(value + (value >= 0 ? 0 : Math.ceil(-value / mod) * mod)) % mod;

const rotate =
	(debugLog: typeof console.log) => (num: Num, _: number, nums: Array<Num>) => {
		if (num.value === 0) return;
		const currentPosition = num.position;
		const targetPosition = positiveMod(
			num.position + num.value,
			nums.length - 1
		);
		debugLog(
			`${num.value} moves from ${currentPosition} to ${targetPosition}:`
		);
		// Downshift every number that was above
		nums.forEach(
			(other) => (other.position += other.position > currentPosition ? -1 : 0)
		);
		// Upshift every number that is above (or equal) to the target
		nums.forEach(
			(other) => (other.position += other.position >= targetPosition ? 1 : 0)
		);
		num.position = targetPosition;
		debugLog(nums);
	};

export const solvePart1 = (
	filePath: string,
	{ debug = false }: { debug?: boolean } = {}
) => {
	const debugLog = createLogger(debug);
	const nums = getInputStrings(filePath)
		.map((x) => parseInt(x))
		.map<Num>((value, position) => ({ value, position }));

	nums.forEach(rotate(debugLog));

	const zeroPosition = nums.find(({ value }) => value === 0)?.position;
	if (zeroPosition === undefined) throw new Error("We lost the zero!");

	const groveCoordinates = nums
		.filter(({ position }) =>
			[1000, 2000, 3000].some(
				(target) => (zeroPosition + target) % nums.length === position
			)
		)
		.map(({ value }) => value);

	debugLog(groveCoordinates);

	return groveCoordinates.reduce(sum);
};