import { solvePart1 } from "./solutions";

test("part1 test input", () => {
	expect(solvePart1(`${__dirname}/input-test.txt`, { debug: true })).toBe(NaN);
});
test.skip("part1 real input", () => {
	expect(solvePart1(`${__dirname}/input-real.txt`)).toBe(NaN);
});
