import * as ECS from "lofi-ecs";
import { EventComponent } from "../components/event.component";
import { Input } from "../components/input.component";

export class Test2System extends ECS.System {
	constructor() {
		super([EventComponent]);
	}

	updateEntity(entity, dt, params) {
		const events = entity.getComponent(EventComponent);

		events.poll("test", (event) => {
			console.log("poll", event);
		});
	}
}
