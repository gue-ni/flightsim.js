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
		const collider = entity.getComponent(Radar);

		colliders.updateCollider(collider);

		for (const possible of colliders.possible_collisions(collider, RadarTarget)) {
			if (colliders.collide(collider, possible)) {
				console.log("radar detected", possible.entity.id);
			}
		}
	}
}

export class PassiveColliderSystem extends ECS.System {
	constructor() {
		super([RadarTarget]);
	}

	updateEntity(entity, dt, params) {
		const collider = entity.getComponent(RadarTarget);
		colliders.updateCollider(collider);
	}
}
