import { solvePart1, solvePart2 } from "./solutions";

test("part1 test input", () => {
	expect(solvePart1(`${__dirname}/input-test.txt`)).toBe(15);
});
test("part1 real input", () => {
	expect(solvePart1(`${__dirname}/input-real.txt`)).toBe(14069);
});
test("part2 test input", () => {
	expect(solvePart2(`${__dirname}/input-test.txt`)).toBe(12);
});
test("part2 real input", () => {
	expect(solvePart2(`${__dirname}/input-real.txt`)).toBe(12411);
});
