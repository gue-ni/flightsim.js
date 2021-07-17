import * as ECS from "lofi-ecs";
import * as THREE from "three";

import { InputComponent } from "../../components/input.component";

export class MissileSystem extends ECS.System {
	constructor() {
		super([InputComponent]);
	}

	updateEntity(entity, dt, params) {}
}
