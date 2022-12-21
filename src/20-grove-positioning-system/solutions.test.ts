import { solvePart1, solvePart2 } from "./solutions";

test("part1 test input", () => {
	expect(solvePart1(`${__dirname}/input-test.txt`, { debug: false })).toBe(3);
});
test("part1 real input", () => {
	expect(solvePart1(`${__dirname}/input-real.txt`)).toBe(2215);
});
test("part2 test input", () => {
	expect(solvePart2(`${__dirname}/input-test.txt`, { debug: false })).toBe(
		1623178306
	);
});
test("part2 real input", () => {
	expect(solvePart2(`${__dirname}/input-real.txt`)).toBe(8927480683);
});
