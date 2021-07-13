import * as ECS from "lofi-ecs";
import { Transform } from "../components/transform.component";
import { ViewComponent } from "../components/view.component";

export class ViewSystem extends ECS.System {
	constructor() {
		super([Transform, ViewComponent]);

		this.activeEntity = 0;

		document.addEventListener("keydown", (event) => {
			switch (event.code) {
				case "Digit3":
					console.log(3);
					break;

				case "Digit4":
					console.log(4);
					break;
			}
		});
	}

	updateSystem(ecs, dt, params) {
		let entities = ecs.entities.filter((entity) => this.componentMatch(entity));
		this.updateEntity(entities[this.activeEntity], dt, params);
	}

	updateEntity(entity, dt, params) {}
}
