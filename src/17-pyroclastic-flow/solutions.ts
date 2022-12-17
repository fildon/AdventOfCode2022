import { getInput, max } from "../utils";

type Vector = `${number},${number}`;

type Rock = Set<Vector>;

type Jet = "<" | ">";

const rocks: Array<Rock> = [
	new Set(["0,0", "1,0", "2,0", "3,0"]), // Horizontal line
	new Set(["1,2", "0,1", "1,1", "2,1", "1,0"]), // Cross
	new Set(["2,2", "2,1", "0,0", "1,0", "2,0"]), // J-block
	new Set(["0,3", "0,2", "0,1", "0,0"]), // Vertical line
	new Set(["0,1", "1,1", "0,0", "1,0"]), // Square
];

const add =
	(a: Vector) =>
	(b: Vector): Vector => {
		const [aX, aY] = a.split(",").map((val) => parseInt(val));
		const [bX, bY] = b.split(",").map((val) => parseInt(val));
		return `${aX + bX},${aY + bY}`;
	};

const moveRock = (rock: Rock, vector: Vector): Rock =>
	new Set([...rock].map(add(vector)));

/**
 * Rock A collides with Rock B if any member of A is in the set B
 */
const collides = (a: Rock, b: Rock): boolean => [...a].some((x) => b.has(x));

/**
 * Maintains a rotating pointer into the rocks array.
 *
 * Each time you get a new rock the pointer moves to the next rock.
 */
function* createRockGenerator() {
	let rockIndex = -1;
	while (true) {
		rockIndex++;
		rockIndex %= rocks.length;
		yield rocks[rockIndex];
	}
}

const parseJets = (inputLine: string): Array<Jet> =>
	inputLine.split("").map((c) => {
		if (c === "<") return "<";
		if (c === ">") return ">";
		throw new Error();
	});

const createJetGeneratorWith = (inputLine: string) => {
	const jets = parseJets(inputLine);
	return (function* createJetGenerator() {
		let jetIndex = -1;
		while (true) {
			jetIndex++;
			jetIndex %= jets.length;
			yield jets[jetIndex];
		}
	})();
};

/**
 * Return the largest Y value in this rock
 *
 * Or 0 if there are none.
 */
const heighest = (rock: Rock): number =>
	[...rock]
		.map((v) => v.split(","))
		// +1 is necessary since at rock at position 0,0 is still 1 heigh
		.map(([, y]) => parseInt(y) + 1)
		.reduce(max, 0);

/**
 * Is this rock fully within the bounds?
 */
const inBounds = (rock: Rock): boolean =>
	[...rock]
		.map((v) => v.split(",").map((val) => parseInt(val)) as [number, number])
		.every(([x, y]) => x >= 0 && y >= 0 && x <= 6);

const mergeRocks = (a: Rock, b: Rock): Rock => new Set([...a, ...b]);

/**
 * Drops the new rock into the scene. Consuming jets as it goes.
 *
 * Once settled, returns the updated mass of rocks, and the remaining jet instructions.
 */
const dropRock = (
	newRock: Rock,
	otherRocks: Rock,
	jets: Generator<Jet>,
	{ debug = false }: { debug?: boolean } = {}
): Rock => {
	// Position the rock two steps in from the left and three steps above the heighest other rock
	const leftMargin = 2;
	const bottomMargin = heighest(otherRocks) + 3;
	let fallingRock = moveRock(newRock, `${leftMargin},${bottomMargin}`);

	if (debug) {
		console.log("begin falling");
		console.log(toString(mergeRocks(fallingRock, otherRocks)));
	}

	let settled = false;
	// While not settled
	while (!settled) {
		// - Jet
		const jettedRock = moveRock(
			fallingRock,
			jets.next().value === "<" ? "-1,0" : "1,0"
		);
		// Only actually update position if the new position is valid
		if (!collides(jettedRock, otherRocks) && inBounds(jettedRock)) {
			fallingRock = jettedRock;
		}
		if (debug) {
			console.log(`Applied jet`);
			console.log(toString(mergeRocks(fallingRock, otherRocks)));
		}

		// - Fall
		const descendedRock = moveRock(fallingRock, "0,-1");
		if (!collides(descendedRock, otherRocks) && inBounds(descendedRock)) {
			fallingRock = descendedRock;
		} else {
			//   - If fall blocked, then break
			settled = true;
		}
		if (debug) {
			console.log(`Tried to descend. Settled?: ${settled.toString()}`);
			console.log(toString(mergeRocks(fallingRock, otherRocks)));
		}
	}

	// The settled rocks merges into the other rocks, and we have consumed some of the jets input
	return mergeRocks(fallingRock, otherRocks);
};

const toString = (rock: Rock): string => {
	const rowCount = heighest(rock) + 1;
	const rows = [];

	for (let y = 0; y < rowCount; y++) {
		rows.push(
			Array.from({ length: 7 })
				.map((_, x) => (rock.has(`${x},${y}`) ? "#" : "."))
				.join("")
		);
	}

	return rows.reverse().join("\n");
};

export const solvePart1 = (
	filePath: string,
	{ debug = false }: { debug?: boolean } = {}
) => {
	let rocks: Rock = new Set();
	const rockGenerator = createRockGenerator();
	const jetGenerator = createJetGeneratorWith(getInput(filePath));

	for (let i = 0; i < 2022; i++) {
		if (debug) {
			console.log(`Rocks settled: ${i}\nCurrent height: ${heighest(rocks)}`);
			console.log(toString(rocks));
		}
		const nextRock = rockGenerator.next().value;
		if (!nextRock) throw new Error("Ran out of rocks!?");
		rocks = dropRock(nextRock, rocks, jetGenerator, {
			debug: false,
		});
	}

	return heighest(rocks);
};
