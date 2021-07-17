import * as ECS from "lofi-ecs";
import { Input } from "../components/input.component";
import { MissileControl } from "../components/weapons/missile_control.component";

import { Missile } from "../components/physics/missile.component";

export class ControlSystem extends ECS.System {
	constructor() {
		super([MissileControl, Input]);
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
