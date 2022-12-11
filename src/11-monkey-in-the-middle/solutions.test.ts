import { buildMonkey, buildMonkeys, solvePart1, solvePart2 } from "./solutions";

describe("buildMonkey", () => {
	test("with multiplier", () => {
		const inputStrings = [
			"Monkey 0:",
			"  Starting items: 79, 98",
			"  Operation: new = old * 19",
			"  Test: divisible by 23",
			"    If true: throw to monkey 2",
			"    If false: throw to monkey 3",
		];
		const testMonkey = buildMonkey(inputStrings);
		expect(testMonkey.items).toEqual([79, 98]);
		expect(testMonkey.operation(1)).toBe(19);
		expect(testMonkey.divisor).toBe(23);
		expect(testMonkey.trueTarget).toBe(2);
		expect(testMonkey.falseTarget).toBe(3);
	});
	test("with adder", () => {
		const inputStrings = [
			"Monkey 1:",
			"  Starting items: 54, 65, 75, 74",
			"  Operation: new = old + 6",
			"  Test: divisible by 19",
			"    If true: throw to monkey 2",
			"    If false: throw to monkey 0",
		];
		const testMonkey = buildMonkey(inputStrings);
		expect(testMonkey.items).toEqual([54, 65, 75, 74]);
		expect(testMonkey.operation(1)).toBe(7);
		expect(testMonkey.divisor).toBe(19);
		expect(testMonkey.trueTarget).toBe(2);
		expect(testMonkey.falseTarget).toBe(0);
	});
});

test("buildMonkeys handles multiple monkeys", () => {
	const inputString = `Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;
	const monkeys = buildMonkeys(inputString);
	expect(monkeys).toHaveLength(2);
	expect(monkeys[0].divisor).toBe(13);
	expect(monkeys[1].operation(10)).toBe(13);
});

test("part1 test input", () => {
	expect(solvePart1(`${__dirname}/input-test.txt`)).toBe(10605);
});
test("part1 real input", () => {
	expect(solvePart1(`${__dirname}/input-real.txt`)).toBe(58322);
});
test("part2 test input", () => {
	expect(solvePart2(`${__dirname}/input-test.txt`)).toBe(2713310158);
});
test("part2 real input", () => {
	expect(solvePart2(`${__dirname}/input-real.txt`)).toBe(13937702909);
});
