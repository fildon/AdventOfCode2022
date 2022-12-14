import { compare, solvePart1, solvePart2 } from "./solutions";

describe("compare", () => {
	test("examples", () => {
		expect(compare([1, 1, 3, 1, 1], [1, 1, 5, 1, 1])).toBeLessThan(0);
		expect(compare([[1], [2, 3, 4]], [[1], 4])).toBeLessThan(0);
		expect(compare([9], [[8, 7, 6]])).toBeGreaterThan(0);
		expect(compare([[4, 4], 4, 4], [[4, 4], 4, 4, 4])).toBeLessThan(0);
		expect(compare([7, 7, 7, 7], [7, 7, 7])).toBeGreaterThan(0);
		expect(compare([], [3])).toBeLessThan(0);
		expect(compare([[[]]], [[]])).toBeGreaterThan(0);
		expect(
			compare(
				[1, [2, [3, [4, [5, 6, 7]]]], 8, 9],
				[1, [2, [3, [4, [5, 6, 0]]]], 8, 9]
			)
		).toBeGreaterThan(0);
	});
});

test("part1 test input", () => {
	expect(solvePart1(`${__dirname}/input-test.txt`)).toBe(13);
});
test("part1 real input", () => {
	expect(solvePart1(`${__dirname}/input-real.txt`)).toBe(5196);
});

test("part2 test input", () => {
	expect(solvePart2(`${__dirname}/input-test.txt`)).toBe(140);
});
test("part2 real input", () => {
	expect(solvePart2(`${__dirname}/input-real.txt`)).toBe(22134);
});
