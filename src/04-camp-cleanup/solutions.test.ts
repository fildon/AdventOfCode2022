import { solvePart1, solvePart2 } from "./solutions";

test("part1 test input", () => {
	expect(solvePart1(`${__dirname}/input-test.txt`)).toBe(2);
});
test("part1 real input", () => {
	expect(solvePart1(`${__dirname}/input-real.txt`)).toBe(503);
});
test("part2 test input", () => {
	expect(solvePart2(`${__dirname}/input-test.txt`)).toBe(4);
});
test("part2 real input", () => {
	expect(solvePart2(`${__dirname}/input-real.txt`)).toBe(827);
});
