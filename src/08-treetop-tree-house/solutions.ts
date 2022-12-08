import { getInputStrings } from "../utils";

type Tree = { visible: boolean; height: number };

const parseInputLine = (inputLine: string): Array<Tree> =>
	inputLine
		.split("")
		.map((char) => ({ visible: false, height: parseInt(char) }));

const applyVisibility = (trees: Array<Array<Tree>>) => {
	for (let row = 0; row < trees.length; row++) {
		// From Left
		let heighest = -1;
		for (let col = 0; col < trees[row].length; col++) {
			if (trees[row][col].height > heighest) {
				trees[row][col].visible = true;
				heighest = trees[row][col].height;
			}
		}
	}

	for (let row = 0; row < trees.length; row++) {
		// From Right
		let heighest = -1;
		for (let col = trees[row].length - 1; col >= 0; col--) {
			if (trees[row][col].height > heighest) {
				trees[row][col].visible = true;
				heighest = trees[row][col].height;
			}
		}
	}

	for (let col = 0; col < trees[0].length; col++) {
		// From Top
		let heighest = -1;
		for (let row = 0; row < trees.length; row++) {
			if (trees[row][col].height > heighest) {
				trees[row][col].visible = true;
				heighest = trees[row][col].height;
			}
		}
	}

	for (let col = 0; col < trees[0].length; col++) {
		// From Bottom
		let heighest = -1;
		for (let row = trees.length - 1; row >= 0; row--) {
			if (trees[row][col].height > heighest) {
				trees[row][col].visible = true;
				heighest = trees[row][col].height;
			}
		}
	}

	return trees;
};

export const solvePart1 = (filePath: string) =>
	applyVisibility(getInputStrings(filePath).map(parseInputLine))
		.flat()
		.filter(({ visible }) => visible).length;
