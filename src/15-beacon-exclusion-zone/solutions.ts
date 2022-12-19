import { getInputStrings, range } from "../utils";

type Vector = [number, number];

const lineRegex =
	/^Sensor at x=(?<sensorX>-?\d+), y=(?<sensorY>-?\d+): closest beacon is at x=(?<beaconX>-?\d+), y=(?<beaconY>-?\d+)$/;

const parseInputLine = (
	inputLine: string
): { sensor: Vector; beacon: Vector } => {
	const lineMatch = inputLine.match(lineRegex);
	if (!lineMatch?.groups)
		throw new Error(`Unrecognised input line:\n${inputLine}`);

	const { sensorX, sensorY, beaconX, beaconY } = lineMatch.groups;
	return {
		sensor: [parseInt(sensorX), parseInt(sensorY)],
		beacon: [parseInt(beaconX), parseInt(beaconY)],
	};
};

const serialize = ([x, y]: Vector) => `${x},${y}`;

const distance = ([ax, ay]: Vector, [bx, by]: Vector) =>
	Math.abs(ax - bx) + Math.abs(ay - by);

const createBeaconSet = (beacons: Array<Vector>) => {
	const innerSet = new Set(beacons.map(serialize));
	return {
		has: (v: Vector) => innerSet.has(serialize(v)),
	};
};

const createExclusionZone = () => {
	const innerSet = new Set<string>();
	return {
		add: (v: Vector) => innerSet.add(serialize(v)),
		size: () => innerSet.size,
	};
};

export const solvePart1 = (
	filePath: string,
	targetY: number,
	{ debug = false }: { debug?: boolean } = {}
) => {
	const sensorReports = getInputStrings(filePath).map(parseInputLine);
	const knownBeacons = createBeaconSet(
		sensorReports.map(({ beacon }) => beacon)
	);
	const exclusionZone = createExclusionZone();
	sensorReports.forEach(({ sensor, beacon }) => {
		const radius = distance(sensor, beacon);

		// Is this sensor in range to say anything about the target line?
		if (Math.abs(sensor[1] - targetY) > radius) return;

		const xOffset = radius - Math.abs(sensor[1] - targetY);
		const startX = sensor[0] - xOffset;
		const endX = sensor[0] + xOffset;
		if (debug) {
			console.log(
				[
					`Sensor: ${serialize(sensor)}`,
					`Beacon: ${serialize(beacon)}`,
					`Radius: ${radius.toString()}`,
					`xOffset: ${xOffset.toString()}`,
					`startX: ${startX.toString()}`,
					`endX: ${endX.toString()}`,
				].join("\n")
			);
		}

		range(startX, endX)
			.map<Vector>((x) => [x, targetY])
			.filter((v) => !knownBeacons.has(v))
			.forEach((v) => {
				exclusionZone.add(v);
			});
	});

	return exclusionZone.size();
};

const tuningFrequency = ([x, y]: Vector) => 4000000 * x + y;

export const solvePart2 = (filePath: string, upperLimit: number) => {
	const sensors = getInputStrings(filePath)
		.map(parseInputLine)
		.map(({ sensor, beacon }) => ({
			centre: sensor,
			radius: distance(sensor, beacon),
		}));
	for (let y = 0; y <= upperLimit; y++) {
		let x = 0;
		while (x <= upperLimit) {
			const intersectingSensor = sensors.find(
				({ centre, radius }) => distance(centre, [x, y]) <= radius
			);

			if (!intersectingSensor) return tuningFrequency([x, y]);
			const { centre, radius } = intersectingSensor;

			// advance x to beyond the sensor range
			const xOffset = radius - Math.abs(centre[1] - y);
			x = centre[0] + xOffset + 1;
		}
	}

	throw new Error("No valid beacon location found");
};
