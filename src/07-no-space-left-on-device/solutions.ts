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

const handleCDLine = (
	root: Directory,
	fileSystem: Directory,
	currentDir: Directory,
	target: string
) => {
	// $ cd /
	if (target === "/") {
		return { fileSystem: root, currentDir: root };
	}
	// $ cd ..
	if (target === "..") {
		return { fileSystem, currentDir: currentDir?.parent ?? root };
	}
	// $ cd foo
	const targetDirectory = currentDir.subDirectories.find(
		({ name }) => name === target
	);
	if (!targetDirectory) {
		throw new Error(`Could not find cd target: ${target}`);
	}
	return { fileSystem, currentDir: targetDirectory };
};

const handleDirLine = (
	fileSystem: Directory,
	currentDir: Directory,
	name: string
) => {
	// Avoid duplicating a directory we have already seen
	const alreadyExists = currentDir.subDirectories.find(
		({ name: subName }) => subName === name
	);
	if (!alreadyExists) {
		currentDir.subDirectories.push({
			name,
			parent: currentDir,
			files: [],
			subDirectories: [],
		});
	}
	return { fileSystem, currentDir };
};

const handleFileLine = (
	fileSystem: Directory,
	currentDir: Directory,
	name: string,
	size: number
) => {
	const alreadyExists = currentDir.files.find(
		({ name: otherName }) => otherName === name
	);
	// Avoid duplicating a file we've already seen
	if (!alreadyExists) {
		currentDir.files.push({
			name,
			size,
		});
	}
	return { fileSystem, currentDir };
};

const constructFileSystem = (commands: Array<Line>): Directory => {
	const root: Directory = { name: "/", files: [], subDirectories: [] };

	return commands.reduce(
		({ fileSystem, currentDir }, curr) => {
			switch (curr.type) {
				case "cd":
					return handleCDLine(root, fileSystem, currentDir, curr.target);
				case "ls":
					// Happy to treat ls as a no-op
					return { fileSystem, currentDir };
				case "dir":
					return handleDirLine(fileSystem, currentDir, curr.name);
				case "file":
					return handleFileLine(fileSystem, currentDir, curr.name, curr.size);
			}
		},
		{
			fileSystem: root,
			currentDir: root,
		}
	).fileSystem;
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
 * Recursively flatten the directory hierarchy to a simple list
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
