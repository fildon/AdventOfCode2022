import { createLogger, getInputStrings, max, min, range } from "../utils";

type StringCoordinate = `${number},${number}`;
type NumberCoordinate = [number, number];

type Direction = "N" | "S" | "W" | "E";

type Elves = Set<StringCoordinate>;

type ElfFormation = {
	elves: Elves;
	preferredDirections: [Direction, Direction, Direction, Direction];
};

const StepVectors = {
	NW: [-1, 1],
	N: [0, 1],
	NE: [1, 1],
	W: [-1, 0],
	E: [1, 0],
	SW: [-1, -1],
	S: [0, -1],
	SE: [1, -1],
} satisfies Record<string, NumberCoordinate>;

/**
 * For each direction, what relative coordinates must be free for an elf to propose moving?
 */
const dirVacancyRequirements: Record<Direction, Array<NumberCoordinate>> = {
	N: [StepVectors.N, StepVectors.NE, StepVectors.NW],
	S: [StepVectors.S, StepVectors.SE, StepVectors.SW],
	W: [StepVectors.W, StepVectors.NW, StepVectors.SW],
	E: [StepVectors.E, StepVectors.NE, StepVectors.SE],
};

const add =
	([aX, aY]: NumberCoordinate) =>
	([bX, bY]: NumberCoordinate): NumberCoordinate =>
		[aX + bX, aY + bY];

const toStringCoord = ([x, y]: NumberCoordinate): StringCoordinate =>
	`${x},${y}`;
const toNumberCoord = (coord: StringCoordinate): NumberCoordinate =>
	coord.split(",").map((val) => parseInt(val)) as NumberCoordinate;

const bounds = (elves: Elves) => {
	const numericCoords = [...elves].map(toNumberCoord);
	const maxX = numericCoords.map(([x]) => x).reduce(max, -Infinity);
	const minX = numericCoords.map(([x]) => x).reduce(min, Infinity);
	const maxY = numericCoords.map(([, y]) => y).reduce(max, -Infinity);
	const minY = numericCoords.map(([, y]) => y).reduce(min, Infinity);
	return { minX, maxX, minY, maxY };
};

const howManyEmptyTiles = (elves: ElfFormation["elves"]) => {
	const { minX, maxX, minY, maxY } = bounds(elves);
	const totalArea = (maxX - minX + 1) * (maxY - minY + 1);
	return totalArea - elves.size;
};

const formationToString = ({ elves, preferredDirections }: ElfFormation) => {
	const { minX, maxX, minY, maxY } = bounds(elves);
	const map = range(minY, maxY)
		.map((y) =>
			range(minX, maxX)
				.map((x) => toStringCoord([x, y]))
				.map((coord) => (elves.has(coord) ? "#" : "."))
				.join("")
		)
		.reverse()
		.join("\n");
	const directions = `Preferred Directions: ${preferredDirections.join(", ")}`;
	const emptyTiles = `Empty tiles: ${howManyEmptyTiles(elves)}`;
	return [map, directions, emptyTiles].join("\n");
};

const parseCoordinate =
	(y: number) =>
	(cell: string, x: number): Array<StringCoordinate> =>
		cell === "." ? [] : [`${x},${y}`];

const parseLine = (rowCount: number) => (line: string, i: number) =>
	line.split("").flatMap(parseCoordinate(rowCount - i));

const propose =
	(formation: ElfFormation) =>
	(
		elf: StringCoordinate
	): Array<{ from: StringCoordinate; to: StringCoordinate }> => {
		const elfPosition = toNumberCoord(elf);
		// Do not propose anything if every adjacent position is empty
		if (
			Object.values(StepVectors)
				.map(add(elfPosition))
				.map(toStringCoord)
				.every((neighbour) => !formation.elves.has(neighbour))
		)
			return [];
		// Find the first proposal direction that looks clear
		for (const dir of formation.preferredDirections) {
			if (
				dirVacancyRequirements[dir]
					.map(add(elfPosition))
					.map(toStringCoord)
					// A space is free if every elf is not there
					.every((target) => !formation.elves.has(target))
			)
				return [
					{
						from: elf,
						to: toStringCoord(add(elfPosition)(StepVectors[dir])),
					},
				];
		}
		// The elf wanted to move, but there was nowhere good to go
		return [];
	};

const step = (formation: ElfFormation): ElfFormation => {
	const { elves, preferredDirections } = formation;

	// Each elf proposes a move
	const proposals = [...elves].flatMap(propose(formation));

	// Detect duplicated targets
	const duplicatedTargets = new Set(
		Object.entries(
			proposals
				.map(({ to }) => to)
				.reduce<Record<string, number>>(
					// Count occurances of "to"
					(acc, curr) => ({ ...acc, [curr]: (acc[curr] ?? 0) + 1 }),
					{}
				)
		)
			.filter(([, count]) => count > 1)
			.map(([target]) => target)
	);

	// Retain only the proposals with unique targets
	const validProposals = proposals.filter(
		({ to }) => !duplicatedTargets.has(to)
	);

	const toRemove = new Set(validProposals.map(({ from }) => from));
	const toAdd = validProposals.map(({ to }) => to);

	const newElves = new Set([
		// Add elves according to valid move "to"s
		...toAdd,
		// Remove elves according to valid move "from"s
		...[...elves].filter((elf) => !toRemove.has(elf)),
	]);

	return {
		elves: newElves,
		preferredDirections: [
			preferredDirections[1],
			preferredDirections[2],
			preferredDirections[3],
			preferredDirections[0],
		],
	};
};

export const solvePart1 = (
	filePath: string,
	{ debug = false }: { debug?: boolean } = {}
) => {
	const debugLog = createLogger(debug);
	const lines = getInputStrings(filePath);

	const initialFormation: ElfFormation = {
		elves: new Set(lines.flatMap(parseLine(lines.length))),
		preferredDirections: ["N", "S", "W", "E"],
	};

	const tenStepsLater = range(0, 9).reduce((state, rounds) => {
		debugLog(`After ${rounds} rounds:\n${formationToString(state)}`);
		return step(state);
	}, initialFormation);

	debugLog(`Final state:\n${formationToString(tenStepsLater)}`);

	return howManyEmptyTiles(tenStepsLater.elves);
};
