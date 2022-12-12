import { solvePart1, solvePart2 } from "./solutions";

test("part1 test input", () => {
	expect(solvePart1(`${__dirname}/input-test.txt`)).toBe(31);
});
test("part1 real input", () => {
	expect(solvePart1(`${__dirname}/input-real.txt`)).toBe(391);
});
test("part2 test input", () => {
	expect(solvePart2(`${__dirname}/input-test.txt`)).toBe(29);
});
test("part2 real input", () => {
	expect(solvePart2(`${__dirname}/input-real.txt`)).toBe(386);
});
