import { getInputStrings, createLogger } from "../utils";

type LeafMonkey = {
	type: "leaf";
	name: string;
	value: number;
};

type NodeMonkey = {
	type: "+" | "-" | "*" | "/";
	name: string;
	args: [string, string];
};

type Monkey = NodeMonkey | LeafMonkey;

const leafMonkeyRegex = /^(?<name>[a-z]{4}): (?<value>-?\d+)$/;
const nodeMonkeyRegex =
	/^(?<name>[a-z]{4}): (?<arg1>[a-z]{4}) (?<op>[+\-*/]) (?<arg2>[a-z]{4})$/;
const parseMonkey = (line: string): Monkey => {
	const leafMatch = line.match(leafMonkeyRegex);
	if (leafMatch?.groups) {
		const { name, value } = leafMatch.groups;
		return { type: "leaf", value: parseInt(value), name };
	}
	const nodeMatch = line.match(nodeMonkeyRegex);
	if (nodeMatch?.groups) {
		const { name, arg1, op, arg2 } = nodeMatch.groups;
		return { type: op as NodeMonkey["type"], args: [arg1, arg2], name };
	}
	throw new Error(`Unrecognised input line:\n${line}`);
};

const computeMonkeyValue =
	(monkeys: Record<string, Monkey>) =>
	(name: string): number => {
		const monkey = monkeys[name];
		if (monkey.type === "leaf") return monkey.value;

		const [arg1, arg2] = monkey.args.map(computeMonkeyValue(monkeys));

		switch (monkey.type) {
			case "+":
				return arg1 + arg2;
			case "-":
				return arg1 - arg2;
			case "*":
				return arg1 * arg2;
			case "/":
				return arg1 / arg2;
		}
	};

export const solvePart1 = (
	filePath: string,
	{ debug = false }: { debug?: boolean } = {}
) => {
	const debugLog = createLogger(debug);

	const monkeys = Object.fromEntries(
		getInputStrings(filePath)
			.map(parseMonkey)
			.map((monkey) => [monkey.name, monkey])
	);
	debugLog(() => JSON.stringify(monkeys));

	return computeMonkeyValue(monkeys)("root");
};
