import { getInput } from "../utils";

type Stacks = Array<Array<string>>;
type Instruction = {
	qty: number;
	from: number;
	to: number;
};

const parseFile = (
	filePath: string
): { stacks: Stacks; instructions: Instruction[] } => {
	const [stacksSection, instructionLines] = getInput(filePath)
		.split("\n\n")
		.map((section) => section.split("\n"));

	// Slice off the last line which is the stack column labels
	const stackLines = stacksSection.slice(0, stacksSection.length - 1);

	const inputWidth = stackLines[0].length;
	const stackCount = 1 + (inputWidth - 3) / 4;
	const stacks: Stacks = Array.from({ length: stackCount }).map(() => []);

	stackLines.forEach((line) =>
		line
			.split("")
			// Fetch only the relevant input columns
			.filter((_, i) => i % 4 === 1)
			// Push only the non-empty items to their columns
			.forEach((char, i) => char !== " " && stacks[i].push(char))
	);

	const instructions = instructionLines
		.map((line) =>
			line
				.split(" ")
				.filter((_, i) => i % 2 === 1)
				.map((val) => parseInt(val))
		)
		// -1 to transform from 1-index to 0-index
		.map(([qty, from, to]) => ({ qty, from: from - 1, to: to - 1 }));

	return { stacks, instructions };
};

const executeInstruction =
	({ withMultiMove }: { withMultiMove: boolean }) =>
	(stacks: Stacks, { qty, from, to }: Instruction): Stacks => {
		const movingSlice = withMultiMove
			? stacks[from].slice(0, qty)
			: stacks[from].slice(0, qty).reverse();

		return stacks.map((stack, i) =>
			i === from
				? stack.slice(qty) // Remove the moving slice from the from column
				: i === to
				? [...movingSlice, ...stack] // Push moving slice on top of the stack
				: stack
		);
	};

const solve =
	({ withMultiMove }: { withMultiMove: boolean }) =>
	(filePath: string) => {
		const { stacks, instructions } = parseFile(filePath);

		return instructions
			.reduce(executeInstruction({ withMultiMove }), stacks)
			.map(([top]) => top)
			.join("");
	};

export const solvePart1 = solve({ withMultiMove: false });
export const solvePart2 = solve({ withMultiMove: true });
