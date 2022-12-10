import { getInputStrings, sum } from "../utils";

type NoopCommand = {
	type: "noop";
};
type AddXCommand = {
	type: "addx";
	value: number;
};
type Command = NoopCommand | AddXCommand;

const parseInputLine = (inputLine: string): Command =>
	inputLine === "noop"
		? { type: "noop" }
		: { type: "addx", value: parseInt(inputLine.split(" ")[1]) };

const computeRegisterValues = (commands: Array<Command>): Array<number> =>
	commands.reduce(
		(signals, command) => {
			const lastSignal = signals.at(-1);
			if (lastSignal === undefined) throw new Error(`Lost signal`);
			switch (command.type) {
				case "noop":
					return [...signals, lastSignal];
				case "addx":
					return [...signals, lastSignal, lastSignal + command.value];
			}
		},
		[1]
	);

export const solvePart1 = (filePath: string) => {
	const registerValues = computeRegisterValues(
		getInputStrings(filePath).map(parseInputLine)
	);
	const signalStrengths = registerValues.map((x, i) => x * (i + 1));
	const interestingSignals = signalStrengths.filter((_, i) => i % 40 === 19);
	return interestingSignals.reduce(sum, 0);
};

export const solvePart2 = (filePath: string): string => {
	const registerValues = computeRegisterValues(
		getInputStrings(filePath).map(parseInputLine)
	);

	return Array.from({ length: 240 })
		.flatMap((_, cycleIndex) => {
			const xPos = cycleIndex % 40;
			const spritePos = registerValues[cycleIndex];
			const renderedPixel = Math.abs(spritePos - xPos) <= 1 ? "█" : " ";
			return `${
				cycleIndex > 0 && cycleIndex % 40 === 0 ? "\n" : ""
			}${renderedPixel}`;
		})
		.join("");
};
