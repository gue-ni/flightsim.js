import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { EventComponent } from "../components/event.component";
import { Input } from "../components/input.component";

export class TestSystem extends ECS.System {
	constructor() {
		super([Input, EventComponent]);
		this.c = 0;
	}

	updateEntity(entity, dt, params) {
		const input = entity.getComponent(Input);
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
