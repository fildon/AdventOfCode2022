import { solvePart1, solvePart2 } from "./solutions";

test("part1 test input", () => {
	expect(solvePart1(`${__dirname}/input-test.txt`, 10, { debug: false })).toBe(
		26
	);
});
test("part1 real input", () => {
	expect(solvePart1(`${__dirname}/input-real.txt`, 2000000)).toBe(5181556);
});
test("part2 test input", () => {
	expect(solvePart2(`${__dirname}/input-test.txt`, 20)).toBe(56000011);
});
test("part2 real input", () => {
	expect(solvePart2(`${__dirname}/input-real.txt`, 4000000)).toBe(
		12817603219131
	);
});
