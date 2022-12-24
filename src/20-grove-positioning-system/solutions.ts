import { getInputStrings, sum, createLogger, type LazyLogger } from "../utils";

type Num = {
	value: number;
	position: number;
};

const positiveMod = (value: number, mod: number) =>
	(value + (value >= 0 ? 0 : Math.ceil(-value / mod) * mod)) % mod;

const rotate =
	(debugLog: LazyLogger) => (num: Num, _: number, nums: Array<Num>) => {
		if (num.value === 0) return;
		const currentPosition = num.position;
		const targetPosition = positiveMod(
			num.position + num.value,
			nums.length - 1
		);
		debugLog(
			() => `${num.value} moves from ${currentPosition} to ${targetPosition}:`
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
		debugLog(() =>
			nums.map(({ value, position }) => `${position}: ${value}`).join("\n")
		);
	};

const getGroveCoordinates = (nums: Array<Num>) => {
	const zeroPosition = nums.find(({ value }) => value === 0)?.position;
	if (zeroPosition === undefined) throw new Error("We lost the zero!");

	const groveCoordinates = nums
		.filter(({ position }) =>
			[1000, 2000, 3000].some(
				(target) => (zeroPosition + target) % nums.length === position
			)
		)
		.map(({ value }) => value);

	return groveCoordinates.reduce(sum);
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

	return getGroveCoordinates(nums);
};

const DECRYPTION_KEY = 811589153;
export const solvePart2 = (
	filePath: string,
	{ debug = false }: { debug?: boolean } = {}
) => {
	const debugLog = createLogger(debug);
	const nums = getInputStrings(filePath)
		.map((x) => parseInt(x))
		.map((x) => x * DECRYPTION_KEY)
		.map<Num>((value, position) => ({ value, position }));

	Array.from({ length: 10 }).forEach(() => {
		nums.forEach(rotate(debugLog));
	});

	return getGroveCoordinates(nums);
};
