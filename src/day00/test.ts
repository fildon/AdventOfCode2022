import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { solve } from "./part1.ts";

Deno.test("day00/reads a file", () => {
  assertEquals(solve("src/day00/testinput.txt"), [
    "success",
    "you read the file!",
  ]);
});
