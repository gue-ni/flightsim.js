import * as ECS from "lofi-ecs";
import { InputComponent } from "../components/input.component";

export class TestSystem extends ECS.System {
	constructor() {
		super([InputComponent]);
	}

	updateEntity(entity, dt, params) {
		const input = entity.getComponent(InputComponent);

		input.poll("keydown", (event) => {
			switch (event.code) {
				case "KeyA":
					console.log("A was pressed");
					break;
			}
		});

		input.poll("pointermove", (event) => {
			console.log("move");
		});
	}
}
