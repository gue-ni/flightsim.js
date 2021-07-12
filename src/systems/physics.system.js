import * as ECS from "lofi-ecs";
import { Transform } from "../components/transform.component";

export class Physics extends ECS.System {
	constructor() {
		super([Transform]);
	}

	updateEntity(entity, dt, params) {
		//console.log("player physics logic");
	}
}
