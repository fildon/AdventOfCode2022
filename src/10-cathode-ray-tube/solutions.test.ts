import { solvePart1, solvePart2 } from "./solutions";

test("part1 test input", () => {
	expect(solvePart1(`${__dirname}/input-test.txt`)).toBe(13140);
});
test("part1 real input", () => {
	expect(solvePart1(`${__dirname}/input-real.txt`)).toBe(13740);
});
test("part2 test input", () => {
	expect(solvePart2(`${__dirname}/input-test.txt`)).toBe(
		[
			"██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ",
			"███   ███   ███   ███   ███   ███   ███ ",
			"████    ████    ████    ████    ████    ",
			"█████     █████     █████     █████     ",
			"██████      ██████      ██████      ████",
			"███████       ███████       ███████     ",
		].join("\n")
	);
});
test("part2 real input", () => {
	expect(solvePart2(`${__dirname}/input-real.txt`)).toBe(
		[
			"████ █  █ ███  ███  ████ ████  ██  █    ",
			"   █ █  █ █  █ █  █ █    █    █  █ █    ",
			"  █  █  █ █  █ █  █ ███  ███  █    █    ",
			" █   █  █ ███  ███  █    █    █    █    ",
			"█    █  █ █    █ █  █    █    █  █ █    ",
			"████  ██  █    █  █ █    ████  ██  ████ ",
		].join("\n")
	);
});
