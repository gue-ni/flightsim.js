import * as ECS from "lofi-ecs";
import { EventComponent } from "../components/event.component";
import { InputComponent } from "../components/input.component";

export class TestSystem extends ECS.System {
	constructor() {
		super([InputComponent, EventComponent]);
		this.c = 0;
	}

	updateEntity(entity, dt, params) {
		const input = entity.getComponent(InputComponent);
		const events = entity.getComponent(EventComponent);

		input.poll("keydown", (event) => {
			switch (event.code) {
				case "KeyG":
					events.post("test", { c: this.c++ });
					break;
			}
		});
	}
}
