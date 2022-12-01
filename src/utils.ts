import { readFileSync } from "fs";

export const getInputStrings = (filePath: string) =>
	readFileSync(filePath, { encoding: "utf-8" }).split(/\r\n/);
