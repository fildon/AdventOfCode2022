import { readFileSync } from "fs";

export const getInput = (filePath: string): string =>
	readFileSync(filePath, { encoding: "utf-8" }).replace(/(\r\n)|\r|\n/g, "\n");

export const getInputStrings = (filePath: string): string[] =>
	getInput(filePath).split(/\n/g);
