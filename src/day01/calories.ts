import { getInputStrings } from "../utils.ts";

const getElfInventories = (inputLines: string[]) =>
  inputLines.reduce(
    ([head, ...tail], line) =>
      line.length === 0 ? [0, head, ...tail] : [head + parseInt(line), ...tail],
    [0],
  );

export const solvePart1 = (filePath: string) => {
  const elves = getElfInventories(getInputStrings(filePath));

  return elves.reduce(
    (greatest, elf) => Math.max(greatest, elf),
    -Infinity,
  );
};

export const solvePart2 = (filePath: string) => {
  const elves = getElfInventories(getInputStrings(filePath));

  return elves.sort((a, b) => b - a).slice(0, 3).reduce((acc, curr) =>
    acc + curr
  );
};
