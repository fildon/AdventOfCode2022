import { solvePart1 } from "./solutions";

test("part1 test input", () => {
	expect(solvePart1("src/04-camp-cleanup/input-test.txt")).toBe(2);
});
test("part1 real input", () => {
	expect(solvePart1("src/04-camp-cleanup/input-real.txt")).toBe(503);
});