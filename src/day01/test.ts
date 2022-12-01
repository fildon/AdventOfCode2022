import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { solvePart1 } from "./calories.ts";

Deno.test("part1 testinput", () => {
  assertEquals(solvePart1("src/day01/testinput.txt"), 24000);
});
Deno.test("part1 realinput", () => {
  assertEquals(solvePart1("src/day01/input.txt"), 70698);
});
