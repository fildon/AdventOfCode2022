import { solvePart1 } from "./solutions";

test("part1 test input", () => {
	expect(solvePart1(`${__dirname}/input-test.txt`)).toBe(7);
});
test("part1 real input", () => {
	expect(solvePart1(`${__dirname}/input-real.txt`)).toBe(1142);
});
// test("part2 test input", () => {
// 	expect(solvePart2(`${__dirname}/input-test.txt`)).toBe(-1);
// });
// test("part2 real input", () => {
// 	expect(solvePart2(`${__dirname}/input-real.txt`)).toBe(-1);
// });
