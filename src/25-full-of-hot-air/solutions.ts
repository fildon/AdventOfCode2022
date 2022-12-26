import { getInputStrings, sum } from "../utils";

type SnafuDigit = "2" | "1" | "0" | "-" | "=";
const SnafuDigits = new Set("210-=");

const snafuLookup = {
	"2": 2,
	"1": 1,
	"0": 0,
	"-": -1,
	"=": -2,
};

const isSnafuDigit = (char: string): char is SnafuDigit =>
	SnafuDigits.has(char);

const parseDigits = (line: string): Array<SnafuDigit> =>
	[...line].map((char) => {
		if (!isSnafuDigit(char))
			throw new Error(`Unrecognised input character: ${char}`);
		return char;
	});

const toNumber = (snafu: Array<SnafuDigit>): number =>
	[...snafu]
		.reverse()
		.map((digit, i) => snafuLookup[digit] * 5 ** i)
		.reduce(sum);

const digitLookup = [
	{ diff: +0, digit: "0" },
	{ diff: -1, digit: "1" },
	{ diff: -2, digit: "2" },
	{ diff: +2, digit: "=" },
	{ diff: +1, digit: "-" },
];

const toSnafu = (number: number): string => {
	if (number === 0) return "";

	const { diff, digit } = digitLookup[number % 5];

	return `${toSnafu((number + diff) / 5)}${digit}`;
};

export const solvePart1 = (filePath: string) =>
	toSnafu(getInputStrings(filePath).map(parseDigits).map(toNumber).reduce(sum));
