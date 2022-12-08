import { getInputStrings } from "../utils";

type Tree = { visible: boolean; height: number };

/**
 * [Row, Col]
 */
type Position = [number, number];

const parseInputLine = (inputLine: string): Array<Tree> =>
	inputLine
		.split("")
		.map((char) => ({ visible: false, height: parseInt(char) }));

const buildWalker =
	<Cell>(grid: Array<Array<Cell>>) =>
	(start: Position) =>
	(step: (position: Position) => Position): Array<Cell> => {
		let position: Position = [...start];
		const walk: Array<Cell> = [];

		while (
			// Left bound
			position[0] >= 0 &&
			// Top bound
			position[1] >= 0 &&
			// Right bound
			position[0] < grid.length &&
			// Bottom bound
			position[1] < grid[0].length
		) {
			walk.push(grid[position[0]][position[1]]);
			position = step(position);
		}
		return walk;
	};

const ltr = ([row, col]: Position): Position => [row, col + 1];
const rtl = ([row, col]: Position): Position => [row, col - 1];
const btt = ([row, col]: Position): Position => [row - 1, col];
const ttb = ([row, col]: Position): Position => [row + 1, col];

const visibilityReducer = (heighest: number, tree: Tree) => {
	if (tree.height > heighest) {
		tree.visible = true;
		return tree.height;
	}
	return heighest;
};

const applyVisibility = (trees: Array<Array<Tree>>) => {
	const treeWalker = buildWalker(trees);

	trees.forEach((_, row) => {
		treeWalker([row, 0])(ltr).reduce(visibilityReducer, -1);
		treeWalker([row, trees[row].length - 1])(rtl).reduce(visibilityReducer, -1);
	});

	trees[0].forEach((_, col) => {
		treeWalker([0, col])(ttb).reduce(visibilityReducer, -1);
		treeWalker([trees.length - 1, col])(btt).reduce(visibilityReducer, -1);
	});

	return trees;
};

export const solvePart1 = (filePath: string) =>
	applyVisibility(getInputStrings(filePath).map(parseInputLine))
		.flat()
		.filter(({ visible }) => visible).length;

const countVisibility = ([treeHouse, ...trees]: Array<Tree>): number => {
	for (let i = 0; i < trees.length; i++) {
		if (trees[i].height >= treeHouse.height) {
			return i + 1;
		}
	}
	return trees.length;
};

export const solvePart2 = (filePath: string) => {
	const treeGrid = getInputStrings(filePath).map(parseInputLine);
	const treeWalker = buildWalker(treeGrid);
	let bestScore = -1;

	for (let row = 0; row < treeGrid.length; row++) {
		for (let col = 0; col < treeGrid[row].length; col++) {
			const walkWithDir = treeWalker([row, col]);
			const scoreHere = [ltr, rtl, ttb, btt]
				.map(walkWithDir)
				.map(countVisibility)
				.reduce((a, b) => a * b);
			bestScore = Math.max(scoreHere, bestScore);
		}
	}

	return bestScore;
};
