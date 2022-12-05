import { getInputStrings } from "../utils";

type Stacks = Array<Array<string>>;
type Instruction = {
	qty: number;
	from: number;
	to: number;
};

const parse = (
	lines: string[]
): { stacks: Stacks; instructions: Instruction[] } => {
	const inputWidth = lines[0].length;
	const stackCount = 1 + (inputWidth - 3) / 4;
	const stacks: Stacks = Array.from({ length: stackCount }).map(() => []);

	let inputStage = 1;
	let linePointer = 0;
	while (inputStage === 1) {
		const currentLine = lines[linePointer];
		// Detect the end of the first input stage
		if (currentLine.slice(0, 2) === " 1") {
			// Skip to start of next section
			linePointer += 2;
			inputStage = 2;
			break;
		} else {
			currentLine
				.split("")
				// Fetch only the relevant input columns
				.filter((_, i) => (i - 1) % 4 === 0)
				// Push only the non-empty items to their columns
				.forEach((char, i) => char !== " " && stacks[i].push(char));
		}

		linePointer++;
	}

	const instructions: Instruction[] = [];
	for (let i = linePointer; i < lines.length; i++) {
		const [qty, from, to] = lines[i]
			.split(" ")
			.filter((_, i) => i % 2 === 1)
			.map((val) => parseInt(val));
		// -1 to convert from 1-index to 0-index
		instructions.push({ qty, from: from - 1, to: to - 1 });
	}

	return { stacks, instructions };
};

const executeInstruction =
	({ withMultiMove }: { withMultiMove: boolean }) =>
	(stacks: Stacks, { qty, from, to }: Instruction): Stacks => {
		const movingSlice = withMultiMove
			? stacks[from].slice(0, qty)
			: stacks[from].slice(0, qty).reverse();

		const newStacks = stacks.map((stack, i) => {
			if (i === from) {
				return stack.slice(qty); // Remove the moving slice from the from column
			}
			if (i === to) {
				return [...movingSlice, ...stack]; // Push moving slice on top of the stack
			}
			return stack;
		});

		return newStacks;
	};

const solve =
	({ withMultiMove }: { withMultiMove: boolean }) =>
	(filePath: string) => {
		const { stacks, instructions } = parse(getInputStrings(filePath));

		return instructions
			.reduce(executeInstruction({ withMultiMove }), stacks)
			.map(([top]) => top)
			.join("");
	};

export const solvePart1 = solve({ withMultiMove: false });
export const solvePart2 = solve({ withMultiMove: true });
