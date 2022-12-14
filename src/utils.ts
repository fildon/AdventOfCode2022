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

export type LazyLogger = (callback: () => string) => void;

export const createLogger =
	(debug: boolean): LazyLogger =>
	(callback) => {
		if (debug) console.log(callback());
	};

type PipeStage<T> = {
	value: T;
	map: <U>(cb: (current: T) => U) => PipeStage<U>;
};

export const startPipe = <T>(value: T): PipeStage<T> => ({
	value,
	map: (cb) => startPipe(cb(value)),
});

/**
 * Given a type predicate construct an identity function which narrows the input type using the type predicate.
 */
export const validateWith =
	<T, U extends T>(validator: (x: T) => x is U) =>
	(value: T) => {
		if (!validator(value))
			throw new Error(`Invalid value: ${JSON.stringify(value)}`);
		return value;
	};
