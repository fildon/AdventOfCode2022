import { getInputStrings, max, min, range } from "../utils";

type Vector = `${string},${string}`;

type Wall = Set<Vector>;

const add =
	(a: Vector) =>
	(b: Vector): Vector => {
		const [aX, aY] = a.split(",").map((val) => parseInt(val));
		const [bX, bY] = b.split(",").map((val) => parseInt(val));
		return `${aX + bX},${aY + bY}`;
	};

const merge = (a: Wall, b: Wall): Wall => new Set([...a, ...b]);

const buildWall = ([start, end]: [Vector, Vector]): Wall => {
	const [startX, startY] = start.split(",").map((c) => parseInt(c));
	const [endX, endY] = end.split(",").map((c) => parseInt(c));

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
	const numericVectors = [...wall].map(
		(vec) => vec.split(",").map((v) => parseInt(v)) as [number, number]
	);
	const maxX = numericVectors.map(([x, _]) => x).reduce(max);
	const minX = numericVectors.map(([x, _]) => x).reduce(min);
	const maxY = numericVectors.map(([_, y]) => y).reduce(max);
	const minY = numericVectors.map(([_, y]) => y).reduce(min);

	return range(minY - 1, maxY + 1)
		.map((y) =>
			range(minX - 1, maxX + 1)
				.map((x) => (wall.has(`${x},${y}`) ? "#" : "."))
				.join("")
		)
		.join("\n");
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

	return -1;
};
