import { solvePart1 } from "./solutions";

test("part1 test input", () => {
	expect(solvePart1(`${__dirname}/input-test.txt`, 10, { debug: false })).toBe(
		26
	);
});
test("part1 real input", () => {
	expect(solvePart1(`${__dirname}/input-real.txt`, 2000000)).toBe(5181556);
});
