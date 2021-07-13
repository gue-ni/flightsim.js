import * as ECS from "lofi-ecs";
import { Transform } from "../components/transform.component";
import { ViewComponent } from "../components/view.component";

export class ViewSystem extends ECS.System {
	constructor() {
		super([Transform, ViewComponent]);
	}

	updateEntity(entity, dt, params) {
		//console.log("player physics logic");
	}
}
