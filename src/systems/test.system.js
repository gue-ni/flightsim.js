import * as ECS from "lofi-ecs";
import { InputComponent } from "../components/input.component";

export class TestSystem extends ECS.System {
	constructor() {
		super([InputComponent]);
	}

	updateEntity(entity, dt, params) {
		const input = entity.getComponent(InputComponent);
	}
}
