import { readFileSync } from "fs";

export const sum = (a: number, b: number) => a + b;
export const product = (a: number, b: number) => a * b;
export const max = (a: number, b: number) => Math.max(a, b);
export const min = (a: number, b: number) => Math.min(a, b);

/**
 * Returns an array of numbers counting up from `from` to `to` inclusive.
 */
export const range = (from: number, to: number) =>
	Array.from({ length: to - from + 1 }).map((_, i) => from + i);

/**
 * Descending sort comparator
 */
export const descending = (a: number, b: number) => b - a;
/**
 * Ascending sort comparator
 */
export const ascending = (a: number, b: number) => a - b;

export const getInput = (filePath: string): string =>
	readFileSync(filePath, { encoding: "utf-8" }).replace(/(\r\n)|\r|\n/g, "\n");

export const getInputStrings = (filePath: string): string[] =>
	getInput(filePath).split(/\n/g);

export const createLogger = (debug: boolean) => (data: string) => {
	if (debug) console.log(data);
};
