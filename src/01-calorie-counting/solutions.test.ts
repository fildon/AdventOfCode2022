import { solvePart1, solvePart2 } from "./solutions";

test("part1 test input", () => {
	expect(solvePart1("src/01-calorie-counting/input-test.txt")).toBe(24000);
});
test("part1 real input", () => {
	expect(solvePart1("src/01-calorie-counting/input-real.txt")).toBe(70698);
});
test("part2 test input", () => {
	expect(solvePart2("src/01-calorie-counting/input-test.txt")).toBe(45000);
});
test("part2 real input", () => {
	expect(solvePart2("src/01-calorie-counting/input-real.txt")).toBe(206643);
});
