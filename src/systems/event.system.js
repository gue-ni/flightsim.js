import * as ECS from "lofi-ecs";
import { EventComponent } from "../components/event.component";

export class EventSystem extends ECS.System {
	constructor() {
		super([EventComponent]);
	}

	updateEntity(entity, dt, params) {}

	updateSystem(entities, dt, params) {}
}
