import { getInputStrings, max, min, range } from "../utils";

type Vector = `${string},${string}`;
type NumericVector = [number, number];

type Wall = Set<Vector>;

const toNumericVector = (vector: Vector) =>
	vector.split(",").map((v) => parseInt(v)) as NumericVector;

const add =
	(a: Vector) =>
	(b: Vector): Vector => {
		const [aX, aY] = toNumericVector(a);
		const [bX, bY] = toNumericVector(b);
		return `${aX + bX},${aY + bY}`;
	};

const down = add("0,1");
const downL = add("-1,1");
const downR = add("1,1");

const merge = (a: Wall, b: Wall): Wall => new Set([...a, ...b]);

const buildWall = ([start, end]: [Vector, Vector]): Wall => {
	const [startX, startY] = toNumericVector(start);
	const [endX, endY] = toNumericVector(end);

	const step = add(
		startX < endX
			? "1,0"
			: startX > endX
			? "-1,0"
			: startY < endY
			? "0,1"
			: "0,-1"
	);

	const wallSections: Array<Vector> = [start];
	while (wallSections[wallSections.length - 1] !== end) {
		wallSections.push(step(wallSections[wallSections.length - 1]));
	}

	return new Set(wallSections);
};

const parseInputLine = (inputLine: string): Wall => {
	const vectors = inputLine.split(" -> ").map((v) => v as Vector);
	const pairs: Array<[Vector, Vector]> = [];
	for (let i = 1; i < vectors.length; i++) {
		pairs.push([vectors[i - 1], vectors[i]]);
	}
	return pairs.map(buildWall).reduce(merge, new Set());
};

const toString = (wall: Wall): string => {
	const numericVectors = [...wall].map(toNumericVector);
	const maxX = numericVectors.map(([x]) => x).reduce(max);
	const minX = numericVectors.map(([x]) => x).reduce(min);
	const maxY = numericVectors.map(([, y]) => y).reduce(max);
	const minY = numericVectors.map(([, y]) => y).reduce(min);

	return range(minY - 1, maxY + 1)
		.map((y) =>
			range(minX - 1, maxX + 1)
				.map((x) => (wall.has(`${x},${y}`) ? "#" : "."))
				.join("")
		)
		.join("\n");
};

const hasDescendedIntoVoid = (wall: Wall, vec?: Vector) => {
	if (!vec) return false;
	const [, vecY] = toNumericVector(vec);
	return [...wall].map(toNumericVector).every(([, wallY]) => wallY < vecY);
};

export const solvePart1 = (
	filePath: string,
	{ debug = false }: { debug?: boolean } = {}
): number => {
	const walls = getInputStrings(filePath)
		.map(parseInputLine)
		.reduce(merge, new Set());

	if (debug) {
		console.log(toString(walls));
	}

	let sandCount = 0;
	const fallingPath: Array<Vector> = [];

	while (!hasDescendedIntoVoid(walls, fallingPath.at(-1))) {
		const currentPosition = fallingPath.at(-1) ?? "500,0";

		// Try to descend in each of the three downward directions
		if (!walls.has(down(currentPosition))) {
			fallingPath.push(down(currentPosition));
		} else if (!walls.has(downL(currentPosition))) {
			fallingPath.push(downL(currentPosition));
		} else if (!walls.has(downR(currentPosition))) {
			fallingPath.push(downR(currentPosition));
		} else {
			// Nowhere to go, so settle
			walls.add(currentPosition);
			// The next grain will resume from one step prior on the path
			fallingPath.pop();
			sandCount++;

			if (debug) {
				console.log(toString(walls));
			}
		}
	}

	return sandCount;
};
