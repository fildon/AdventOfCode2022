# Advent Of Code 2022

[![CI](https://github.com/fildon/AdventOfCode2022/actions/workflows/ci.yml/badge.svg)](https://github.com/fildon/AdventOfCode2022/actions/workflows/ci.yml)

These are my solutions to [Advent of Code 2022](https://adventofcode.com/2022/).

## Dependencies

- Node v16.13.2
- NPM v8.1.2

Later versions might also work, but I can't guarantee this.

All other dependencies should be installed via NPM:

```shell
npm install
```

## Structure

Each day exports a `solvePart1` and `solvePart2` function. They each take a single argument: a path to an input file to parse. They each return a single value (the answer), the type of which will vary from day to day.

Each day has a corresponding test file `solutions.test.ts` which match the solution outputs to known correct answers.

You can verify the correctness of all solutions by running `npm run test`.
