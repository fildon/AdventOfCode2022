import { buildMonkey, buildMonkeys, solvePart1 } from "./solutions";

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
		expect(testMonkey.throwTarget(23)).toBe(2);
		expect(testMonkey.throwTarget(24)).toBe(3);
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
		expect(testMonkey.throwTarget(18)).toBe(0);
		expect(testMonkey.throwTarget(19)).toBe(2);
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
	expect(monkeys[0].throwTarget(13)).toBe(1);
	expect(monkeys[1].operation(10)).toBe(13);
});

test("part1 test input", () => {
	expect(solvePart1(`${__dirname}/input-test.txt`)).toBe(10605);
});
test("part1 real input", () => {
	expect(solvePart1(`${__dirname}/input-real.txt`)).toBe(58322);
});
