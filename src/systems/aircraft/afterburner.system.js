import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { Joystick } from "../../components/aircraft/joystick.component";

import { Afterburner } from "../../components/particles/afterburner.component";

export class AfterburnerSystem extends ECS.System {
	constructor() {
		super([Afterburner, Joystick]);
	}

	updateEntity(entity, dt, params) {
		const afterburner = entity.getComponent(Afterburner);
		const joystick = entity.getComponent(Joystick);

		let inside = afterburner.inside.mesh;
		let outside = afterburner.outside.mesh;

		const factor = 0.2;
		const size = joystick.throttle * 2;

		let insideScale = size + (Math.random() - 0.5) * factor;
		inside.scale.set(insideScale, 1, 1);

		let outsideScale = size + (Math.random() - 0.5) * factor;
		outside.scale.set(outsideScale, 1, 1);
	}
}
