import { readFileSync } from "fs";

export const getInputStrings = (filePath: string) =>
	readFileSync(filePath, { encoding: "utf-8" })
		.replace(/(\r\n)|\r|\n/g, "\n")
		.split(/\n/g);
