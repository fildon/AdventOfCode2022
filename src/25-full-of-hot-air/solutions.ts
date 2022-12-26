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

const toSnafu = (number: number): string => {
	if (number === 0) return "";
	const nextDigit = number % 5;

	switch (nextDigit) {
		case 4:
			return `${toSnafu((number + 1) / 5)}-`;
		case 3:
			return `${toSnafu((number + 2) / 5)}=`;
		case 2:
			return `${toSnafu((number - 2) / 5)}2`;
		case 1:
			return `${toSnafu((number - 1) / 5)}1`;
		case 0:
			return `${toSnafu((number + 0) / 5)}0`;
		default:
			throw new Error(`Unexpected value: ${nextDigit}`);
	}
};

export const solvePart1 = (filePath: string) =>
	toSnafu(getInputStrings(filePath).map(parseDigits).map(toNumber).reduce(sum));
