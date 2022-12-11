import { getInputStrings } from "../utils";

type Monkey = {
	items: Array<number>;
	operation: (old: number) => number;
	throwTarget: (worry: number) => number;
};

/**
 * Parse a set of strings into a monkey object
 */
export const buildMonkey = (monkeyStrings: Array<string>): Monkey => {
	const items = monkeyStrings[1]
		.slice(18)
		.split(", ")
		.map((x) => parseInt(x));
	const operator: (a: number) => (b: number) => number =
		monkeyStrings[2][23] === "+" ? (a) => (b) => a + b : (a) => (b) => a * b;
	const operand = parseInt(monkeyStrings[2].slice(25));
	const operation = operator(operand);
	const divisor = parseInt(monkeyStrings[3].slice(21));
	const trueTarget = parseInt(monkeyStrings[4].slice(29));
	const falseTarget = parseInt(monkeyStrings[5].slice(30));
	const throwTarget = (worry: number) =>
		worry % divisor === 0 ? trueTarget : falseTarget;
	return { items, operation, throwTarget };
};

export const solvePart1 = (filePath: string): number => {
	return -1;
};
