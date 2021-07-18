import * as ECS from "lofi-ecs";
import { Input } from "../components/input.component";
import { Guidance } from "../components/weapons/guidance.component";

import { Missile } from "../components/physics/missile.component";

export class ControlSystem extends ECS.System {
	constructor() {
		super([Guidance, Input]);
	}

	updateEntity(entity, dt, params) {
		const input = entity.getComponent(Input);

		input.poll("keydown", (event) => {
			switch (event.code) {
				case "KeyF":
					let scene = entity.root;
					break;
			}
		});
	}
}
