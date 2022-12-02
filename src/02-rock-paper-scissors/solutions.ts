import { getInputStrings } from "../utils";

type Shape = "Rock" | "Paper" | "Scissors";
type Round = [Shape, Shape];

/**
 * 1 for Rock, 2 for Paper, and 3 for Scissors
 */
const shapeScore = (shape: Shape): 1 | 2 | 3 =>
	shape === "Rock" ? 1 : shape === "Paper" ? 2 : 3;

/**
 * 0 if you lost, 3 if the round was a draw, and 6 if you won
 */
const outcomeScore = ([theirPlay, myPlay]: Round): number => {
	const outcomeMap: Record<Shape, Record<Shape, 0 | 3 | 6>> = {
		Rock: { Rock: 3, Paper: 6, Scissors: 0 },
		Paper: { Rock: 0, Paper: 3, Scissors: 6 },
		Scissors: { Rock: 6, Paper: 0, Scissors: 3 },
	};
	return outcomeMap[theirPlay][myPlay];
};

/**
 * The score for a single round is the score for the shape
 * you selected (1 for Rock, 2 for Paper, and 3 for Scissors)
 * plus the score for the outcome of the round
 * (0 if you lost, 3 if the round was a draw, and 6 if you won).
 */
const getRoundScore = ([theirPlay, myPlay]: Round) =>
	shapeScore(myPlay) + outcomeScore([theirPlay, myPlay]);

/**
 * A for Rock, B for Paper, and C for Scissors.
 * X for Rock, Y for Paper, and Z for Scissors.
 */
const parseLetter = (letter: string): Shape => {
	switch (letter) {
		case "A":
		case "X":
			return "Rock";
		case "B":
		case "Y":
			return "Paper";
		default:
			return "Scissors";
	}
};

const parseRound = (line: string): Round =>
	line.split(" ").map(parseLetter) as Round;

/**
 * X means you need to lose,
 * Y means you need to end the round in a draw,
 * and Z means you need to win.
 */
const decryptRound = (line: string): Round => {
	const [theirLetter, myLetter] = line.split(" ");
	const theirPlay = parseLetter(theirLetter);
	const decryptionMap: Record<Shape, Record<string, Shape>> = {
		Rock: { X: "Scissors", Y: "Rock", Z: "Paper" },
		Paper: { X: "Rock", Y: "Paper", Z: "Scissors" },
		Scissors: { X: "Paper", Y: "Scissors", Z: "Rock" },
	};
	return [theirPlay, decryptionMap[theirPlay][myLetter]];
};

/**
 *
 * @see https://adventofcode.com/2022/day/2
 */
export const solvePart1 = (filePath: string) =>
	getInputStrings(filePath)
		.map(parseRound)
		.map(getRoundScore)
		.reduce((a, b) => a + b);

/**
 * @see https://adventofcode.com/2022/day/2#part2
 */
export const solvePart2 = (filePath: string) =>
	getInputStrings(filePath)
		.map(decryptRound)
		.map(getRoundScore)
		.reduce((a, b) => a + b);
