import * as ECS from "lofi-ecs";
import { PlayerInputComponent } from "../components/input.component";
import { Transform } from "../components/transform.component";

export class PlayerInputSystem extends ECS.System {
	constructor() {
		super([PlayerInputComponent, Transform]);
	}

	updateEntity(entity, dt, params) {
		//console.log("player input logic");
	}
}
