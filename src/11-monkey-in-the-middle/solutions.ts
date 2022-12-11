import { descending, getInput } from "../utils";

type Monkey = {
	items: Array<number>;
	operation: (old: number) => number;
	throwTarget: (worry: number) => number;
	activity: number;
};

const buildOperation = (inputLine: string): ((old: number) => number) => {
	const operatorSymbol = inputLine[23];
	const operandString = inputLine.slice(25);
	if (operandString === "old")
		return (old) => (operatorSymbol === "+" ? old + old : old * old);
	const operator: (a: number) => (b: number) => number =
		operatorSymbol === "+" ? (a) => (b) => a + b : (a) => (b) => a * b;
	const operand = parseInt(operandString);
	return operator(operand);
};

/**
 * Parse a set of strings into a monkey object
 */
export const buildMonkey = (monkeyStrings: Array<string>): Monkey => {
	const items = monkeyStrings[1]
		.slice(18)
		.split(", ")
		.map((x) => parseInt(x));
	const operation = buildOperation(monkeyStrings[2]);
	const divisor = parseInt(monkeyStrings[3].slice(21));
	const trueTarget = parseInt(monkeyStrings[4].slice(29));
	const falseTarget = parseInt(monkeyStrings[5].slice(30));
	const throwTarget = (worry: number) =>
		worry % divisor === 0 ? trueTarget : falseTarget;
	return { items, operation, throwTarget, activity: 0 };
};

export const buildMonkeys = (input: string): Array<Monkey> =>
	input
		.split("\n\n")
		.map((monkeyInputSection) => monkeyInputSection.split("\n"))
		.map(buildMonkey);

/**
 * Execute a round of activity. Each monkey gets one turn.
 *
 * Beware: this is not a pure function, it modifies the input.
 */
const round = (monkeys: Array<Monkey>): void => {
	for (let i = 0; i < monkeys.length; i++) {
		const currentMonkey = monkeys[i];
		while (currentMonkey.items.length > 0) {
			currentMonkey.activity++;
			// Pop an item off the front of the array
			const currentItem = currentMonkey.items.shift();
			if (!currentItem) throw new Error("Found undefined item");
			// Apply operation and then divide by three rounded down
			const newWorry = Math.floor(currentMonkey.operation(currentItem) / 3);
			const throwTarget = currentMonkey.throwTarget(newWorry);
			monkeys[throwTarget].items.push(newWorry);
		}
	}
};

export const solvePart1 = (filePath: string): number => {
	const monkeys = buildMonkeys(getInput(filePath));

	Array.from({ length: 20 }).forEach(() => round(monkeys));

	return monkeys
		.map(({ activity }) => activity)
		.sort(descending)
		.slice(0, 2)
		.reduce((a, b) => a * b);
};
