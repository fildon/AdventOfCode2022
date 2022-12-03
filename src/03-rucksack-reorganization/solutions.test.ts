import { solvePart1, solvePart2 } from "./solutions";

test("part1 test input", () => {
	expect(solvePart1("src/03-rucksack-reorganization/input-test.txt")).toBe(157);
});
test("part1 real input", () => {
	expect(solvePart1("src/03-rucksack-reorganization/input-real.txt")).toBe(
		8018
	);
});
test("part2 test input", () => {
	expect(solvePart2("src/03-rucksack-reorganization/input-test.txt")).toBe(70);
});
test("part2 real input", () => {
	expect(solvePart2("src/03-rucksack-reorganization/input-real.txt")).toBe(
		2518
	);
});
