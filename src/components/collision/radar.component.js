import * as ECS from "lofi-ecs";
import * as THREE from "three";

import { Collider } from "./collider.component";

export class RadarTarget extends Collider {
	constructor(entity, size = new THREE.Vector3(1, 1, 1)) {
		super(entity, size);
	}
}

export class Radar extends Collider {
	constructor(entity, size = new THREE.Vector3(1, 1, 1)) {
		super(entity, size);
		this.targets = [];
	}
}
