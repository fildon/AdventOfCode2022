import { getInputStrings } from "../utils";

type FileLine = {
	type: "file";
	name: string;
	size: number;
};
type DirLine = {
	type: "dir";
	name: string;
};
type CDLine = {
	type: "cd";
	target: string;
};
type LSCommand = {
	type: "ls";
};
type Line = FileLine | DirLine | CDLine | LSCommand;

type FileMeta = {
	name: string;
	size: number;
};
type Directory = {
	name: string;
	parent?: Directory;
	files: Array<FileMeta>;
	subDirectories: Array<Directory>;
};

type SizedDirectory = {
	name: string;
	parent?: Directory;
	files: Array<FileMeta>;
	size: number;
	subDirectories: Array<SizedDirectory>;
};

const cdRegex = /\$ cd (?<target>[\w|/|..]+)/;
const dirRegex = /dir (?<name>\w+)/;
const fileRegex = /(?<size>\d+) (?<name>[\w|.]+)/;
const parseInputLine = (inputLine: string): Line => {
	const cdMatch = inputLine.match(cdRegex);
	if (cdMatch?.groups) {
		const { target } = cdMatch.groups;
		return { type: "cd", target };
	}

	if (inputLine === "$ ls") {
		return { type: "ls" };
	}

	const dirMatch = inputLine.match(dirRegex);
	if (dirMatch?.groups) {
		const { name } = dirMatch.groups;
		return { type: "dir", name };
	}

	const fileMatch = inputLine.match(fileRegex);
	if (fileMatch?.groups) {
		const { size, name } = fileMatch.groups;
		return { type: "file", name, size: parseInt(size) };
	}

	throw new Error(`Unrecognised inputLine: ${inputLine}`);
};

const constructFileSystem = (commands: Array<Line>): Directory => {
	const root: Directory = { name: "/", files: [], subDirectories: [] };

	return commands.reduce(
		({ fileSystem, currentDir }, curr) => {
			if (curr.type === "cd") {
				// $ cd /
				if (curr.target === "/") {
					return { fileSystem: root, currentDir: root };
				}
				// $ cd ..
				if (curr.target === "..") {
					return { fileSystem, currentDir: currentDir?.parent ?? root };
				}
				// $ cd foo
				const targetDirectory = currentDir.subDirectories.find(
					({ name }) => name === curr.target
				);
				if (!targetDirectory) {
					throw new Error(`Could not find cd target: ${curr.target}`);
				}
				return { fileSystem, currentDir: targetDirectory };
			}
			if (curr.type === "ls") {
				// Happy to treat ls as a no-op
				return { fileSystem, currentDir };
			}
			if (curr.type === "dir") {
				// Avoid duplicating a directory we have already seen
				const alreadyExists = currentDir.subDirectories.find(
					({ name }) => name === curr.name
				);
				if (!alreadyExists) {
					currentDir.subDirectories.push({
						name: curr.name,
						parent: currentDir,
						files: [],
						subDirectories: [],
					});
				}
				return { fileSystem, currentDir };
			}
			if (curr.type === "file") {
				// Avoid duplicating a file we've already seen
				const alreadyExists = currentDir.files.find(
					({ name }) => name === curr.name
				);
				if (!alreadyExists) {
					currentDir.files.push({
						name: curr.name,
						size: curr.size,
					});
				}
				return { fileSystem, currentDir };
			}
			throw new Error("Unhandled Line");
		},
		{
			fileSystem: root,
			currentDir: root,
		}
	).fileSystem;
};

const _prettyString =
	(indentSize = 0) =>
	({ name, subDirectories, files }: Directory): string => {
		const indent = Array.from({ length: indentSize * 2 })
			.map(() => " ")
			.join("");
		const prettySubDirs = subDirectories.map(_prettyString(indentSize + 1));
		const prettyFiles = files.map(
			({ name, size }) => `${indent}  - ${name} (file, size=${size})`
		);
		return [`${indent}- ${name} (dir)`, ...prettyFiles, ...prettySubDirs].join(
			"\n"
		);
	};

/**
 * Given a directory annotates it with a size.
 *
 * Runs recursively down through all children.
 */
const measureDirectory = (dir: Directory): SizedDirectory => {
	const measuredSubDirectories = dir.subDirectories.map(measureDirectory);
	return {
		...dir,
		subDirectories: measuredSubDirectories,
		size:
			dir.files.reduce((acc, { size }) => acc + size, 0) +
			measuredSubDirectories.reduce((acc, { size }) => acc + size, 0),
	};
};

/**
 * Recursively flatten the directory hierachy to a simple list
 */
const flattenDirectories = (dir: SizedDirectory): Array<SizedDirectory> => [
	dir,
	...dir.subDirectories.flatMap(flattenDirectories),
];

export const solvePart1 = (filePath: string): number =>
	flattenDirectories(
		measureDirectory(
			constructFileSystem(getInputStrings(filePath).map(parseInputLine))
		)
	)
		.filter(({ size }) => size <= 100000)
		.reduce((acc, { size }) => acc + size, 0);

export const solvePart2 = (filePath: string): number => {
	const root = measureDirectory(
		constructFileSystem(getInputStrings(filePath).map(parseInputLine))
	);

	const totalDiskSpace = 70000000;
	const requiredSpace = 30000000;
	const usedSpace = root.size;
	const availableSpace = totalDiskSpace - usedSpace;
	const needToFreeUp = requiredSpace - availableSpace;

	return flattenDirectories(root)
		.map(({ size }) => size)
		.filter((size) => size >= needToFreeUp)
		.sort((a, b) => a - b)[0];
};
