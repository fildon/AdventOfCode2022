import { getInputStrings } from "../utils";

type Vector = [number, number];
type Direction = "U" | "D" | "L" | "R";
const isDirection = (dir: string): dir is Direction =>
	["U", "D", "L", "R"].includes(dir);
export type Rope = Array<Vector>;

const parseInputLine = (inputLine: string): Array<Direction> => {
	const [dir, qty] = inputLine.split(" ");
	if (!isDirection(dir)) {
		throw new Error(`Unrecognised inputLine: ${inputLine}`);
	}
	const quantity = parseInt(qty);
	if (isNaN(quantity)) {
		throw new Error(`Unrecognised inputLine: ${inputLine}`);
	}
	return Array.from({ length: parseInt(qty) }).map(() => dir);
};

const move = (position: Vector, direction: Direction): Vector => {
	switch (direction) {
		case "U":
			return [position[0], position[1] + 1];
		case "D":
			return [position[0], position[1] - 1];
		case "L":
			return [position[0] - 1, position[1]];
		case "R":
			return [position[0] + 1, position[1]];
	}
};

const follow = (head: Vector, tail: Vector): Vector => {
	const [headX, headY] = head;
	const [tailX, tailY] = tail;

	// No-op if the tail is within 1 of both x and y
	if (Math.abs(headX - tailX) <= 1 && Math.abs(headY - tailY) <= 1) return tail;

	let newTail: Vector = [tailX, tailY];
	if (tailY < headY) newTail = move(newTail, "U");
	if (tailY > headY) newTail = move(newTail, "D");
	if (tailX > headX) newTail = move(newTail, "L");
	if (tailX < headX) newTail = move(newTail, "R");
	return newTail;
};

export const solvePart1 = (filePath: string): number =>
	getInputStrings(filePath)
		.flatMap(parseInputLine)
		.reduce(
			({ head, tail, visited }, direction) => {
				const newHead = move(head, direction);
				const newTail = follow(newHead, tail);
				visited.add(`${newTail[0]},${newTail[1]}`);
				return { head: newHead, tail: newTail, visited };
			},
			{
				head: [0, 0] as Vector,
				tail: [0, 0] as Vector,
				visited: new Set(["0,0"]),
			}
		).visited.size;

/**
 * Given a rope which might have gaps in it
 * contract it until each segment is a neighbour to its prior segment
 */
const contract = (rope: Rope): Rope => {
	for (let i = 1; i < rope.length; i++) {
		rope[i] = follow(rope[i - 1], rope[i]);
	}
	return rope;
};

/**
 * Move the head of the rope by the given direction
 * then contract the tail so it all follows
 */
export const advanceRope = (rope: Rope, direction: Direction): Rope => {
	const [head, ...tail] = rope;
	const newHead = move(head, direction);
	return contract([newHead, ...tail]);
};

export const solvePart2 = (filePath: string): number =>
	getInputStrings(filePath)
		.flatMap(parseInputLine)
		.reduce(
			({ rope, visited }, direction) => {
				const newRope = advanceRope(rope, direction);
				// The tail is at the 9th index
				visited.add(`${newRope[9][0]},${newRope[9][1]}`);
				return { rope: newRope, visited };
			},
			{
				rope: Array.from({ length: 10 }).map(() => [0, 0]) as Rope,
				visited: new Set(["0,0"]),
			}
		).visited.size;
