import { getInputStrings } from "../utils.ts";

const getElfInventories = (inputLines: string[]) =>
  inputLines.reduce(
    ([head, ...tail], line) =>
      line.length === 0
        ? [[], head, ...tail]
        : [[...head, parseInt(line)], ...tail],
    [[]] as number[][],
  );

export const solvePart1 = (filePath: string) => {
  const elves = getElfInventories(getInputStrings(filePath));

  return elves.reduce(
    (greatest, elf) =>
      Math.max(greatest, elf.reduce((cals, meal) => cals + meal, 0)),
    -Infinity,
  );
};
