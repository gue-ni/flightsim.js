import * as THREE from "three";

function azimuthDifference(heading, target) {
	let t = Math.atan2(target.z, target.x);
	let h = Math.atan2(heading.z, heading.x);
	let diff = t - h;
	if (diff > Math.PI) diff -= Math.PI * 2;
	if (diff < -Math.PI) diff += Math.PI * 2;
	return diff;
}

function rollDifference(target, up) {
	target.x = 0;
	target.normalize();
	up.normalize();
	let r = Math.acos(target.dot(up));
	console.log(target, r);
	return r;
}

// positive means too high, negativ is too low
function elevationDifference(heading, target) {
	// angle between vector and x/z plane
	let vh = Math.sqrt(heading.x * heading.x + heading.z * heading.z);
	let pitchV = Math.atan(heading.y / vh);
	let dh = Math.sqrt(target.x * target.x + target.z * target.z);
	let pitchD = Math.atan(target.y / dh);
	return pitchV - pitchD || 0;
}

export { azimuthDifference, elevationDifference, rollDifference };
