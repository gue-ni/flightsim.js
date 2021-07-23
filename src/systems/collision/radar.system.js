import * as ECS from "lofi-ecs";
import * as THREE from "three";

import { Radar, RadarTarget } from "../../components/collision/radar.component";
import { HashGrid } from "./collisions.system";

const colliders = new HashGrid(100);

export class RadarSystem extends ECS.System {
	constructor() {
		super([Radar]);
	}

	updateEntity(entity, dt, params) {
		const radar = entity.getComponent(Radar);
		colliders.updateCollider(radar, dt);

		radar.targets = [];

		for (const possible of colliders.possible_collisions(radar, RadarTarget)) {
			if (colliders.collide(radar, possible) && radar.timeToArm <= 0 && possible.timeToArm <= 0) {
				//console.log("radar detected", possible.entity.id);
				radar.targets.push(possible.entity);
			}
		}
	}
}

export class RadarTargetSystem extends ECS.System {
	constructor() {
		super([RadarTarget]);
	}

	updateEntity(entity, dt, params) {
		const collider = entity.getComponent(RadarTarget);
		colliders.updateCollider(collider, dt);
	}
}
