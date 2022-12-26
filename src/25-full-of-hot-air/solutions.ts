import { getInputStrings, startPipe, sum, validateWith } from "../utils";

type SnafuDigit = "2" | "1" | "0" | "-" | "=";
type SnafuNumber = Array<SnafuDigit>;

const snafuLookup = {
	"2": 2,
	"1": 1,
	"0": 0,
	"-": -1,
	"=": -2,
};

const isSnafuDigit = (x: string): x is SnafuDigit => "210-=".includes(x);
const parseSnafu = (line: string): SnafuNumber =>
	[...line].map(validateWith(isSnafuDigit));

const toNumber = (snafu: SnafuNumber) =>
	[...snafu]
		.map((digit, i) => snafuLookup[digit] * 5 ** (snafu.length - i - 1))
		.reduce(sum);

const digitLookup = [
	{ diff: +0, digit: "0" },
	{ diff: -1, digit: "1" },
	{ diff: -2, digit: "2" },
	{ diff: +2, digit: "=" },
	{ diff: +1, digit: "-" },
];

const toSnafuFormat = (number: number): string => {
	if (number === 0) return "";

	const { diff, digit } = digitLookup[number % 5];

	return `${toSnafuFormat((number + diff) / 5)}${digit}`;
};

const getFileTotal = (filePath: string) =>
	getInputStrings(filePath).map(parseSnafu).map(toNumber).reduce(sum);

export const solvePart1 = (filePath: string) =>
	startPipe(filePath).map(getFileTotal).map(toSnafuFormat).value;
