import { getInputStrings } from "../utils";

type Vector = [number, number];
type Direction = "U" | "D" | "L" | "R";
const isDirection = (dir: string): dir is Direction =>
	["U", "D", "L", "R"].includes(dir);

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
