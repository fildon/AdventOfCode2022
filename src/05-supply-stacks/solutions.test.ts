import { solvePart1, solvePart2 } from "./solutions";

test("part1 test input", () => {
	expect(solvePart1(`${__dirname}/input-test.txt`)).toBe("CMZ");
});
test("part1 real input", () => {
	expect(solvePart1(`${__dirname}/input-real.txt`)).toBe("SHMSDGZVC");
});
test("part2 test input", () => {
	expect(solvePart2(`${__dirname}/input-test.txt`)).toBe("MCD");
});
test("part2 real input", () => {
	expect(solvePart2(`${__dirname}/input-real.txt`)).toBe("VRZGHDFBQ");
});
