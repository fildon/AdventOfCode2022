import { getInputStrings } from "../utils";

type Coordinate = [number, number];
type HeightMap = Array<Array<number>>;

const serialize = ([row, col]: Coordinate): string => `${row},${col}`;
const deserialize = (coord: string): Coordinate =>
	coord.split(`,`).map((x) => parseInt(x)) as Coordinate;

const parseInput = (inputLines: Array<string>) => {
	let start: Coordinate | undefined;
	let end: Coordinate | undefined;
	const heightMap: HeightMap = inputLines.map((inputLine, row) =>
		inputLine.split("").map((char, col) => {
			if (char === "S") {
				start = [row, col];
				return "a".charCodeAt(0);
			}
			if (char === "E") {
				end = [row, col];
				return "z".charCodeAt(0);
			}
			return char.charCodeAt(0);
		})
	);
	if (!start) throw new Error("No start symbol found");
	if (!end) throw new Error("No end symbol found");
	return { start, end, heightMap };
};

const dedupe = (coords: Array<Coordinate>): Array<Coordinate> =>
	[...new Set(coords.map(serialize)).values()].map(deserialize);

export const solvePart1 = (filePath: string) => {
	const { start, end, heightMap } = parseInput(getInputStrings(filePath));
	const visited = new Set<string>([serialize(start)]);
	let frontier: Array<Coordinate> = [start];
	let steps = 0;

	while (!visited.has(serialize(end))) {
		steps++;
		const newFrontier = frontier.flatMap(([row, col]) =>
			[
				[row, col + 1] as Coordinate,
				[row, col - 1] as Coordinate,
				[row + 1, col] as Coordinate,
				[row - 1, col] as Coordinate,
			].filter(([newRow, newCol]) => {
				// Target is out of bounds
				if (
					newRow < 0 ||
					newRow >= heightMap.length ||
					newCol < 0 ||
					newCol >= heightMap[0].length
				)
					return false;
				// Target is too high
				if (heightMap[newRow][newCol] > heightMap[row][col] + 1) return false;
				// Target has already been visited
				if (visited.has(`${newRow},${newCol}`)) return false;
				return true;
			})
		);
		frontier = dedupe(newFrontier);
		newFrontier.forEach(([newRow, newCol]) =>
			visited.add(`${newRow},${newCol}`)
		);
	}
	return steps;
};
export const solvePart2 = (filePath: string) => {
	const { end, heightMap } = parseInput(getInputStrings(filePath));
	const visited = new Set<string>([serialize(end)]);
	let frontier: Array<Coordinate> = [end];
	let steps = 0;

	while (
		![...visited.values()]
			.map(deserialize)
			.map(([row, col]) => heightMap[row][col])
			.includes("a".charCodeAt(0))
	) {
		steps++;
		const newFrontier = frontier.flatMap(([row, col]) =>
			[
				[row, col + 1] as Coordinate,
				[row, col - 1] as Coordinate,
				[row + 1, col] as Coordinate,
				[row - 1, col] as Coordinate,
			].filter(([newRow, newCol]) => {
				// Target is out of bounds
				if (
					newRow < 0 ||
					newRow >= heightMap.length ||
					newCol < 0 ||
					newCol >= heightMap[0].length
				)
					return false;
				// Target is too low
				if (heightMap[newRow][newCol] < heightMap[row][col] - 1) return false;
				// Target has already been visited
				if (visited.has(`${newRow},${newCol}`)) return false;
				return true;
			})
		);
		frontier = dedupe(newFrontier);
		newFrontier.map(serialize).forEach((x) => visited.add(x));
	}
	return steps;
};
