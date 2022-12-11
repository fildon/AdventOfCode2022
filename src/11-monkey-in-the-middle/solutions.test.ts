import { buildMonkey } from "./solutions";

test("monkey builder with multiplier", () => {
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
test("monkey builder with adder", () => {
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
