import * as ECS from "lofi-ecs";
import { InputComponent } from "../components/input.component";

export class InputSystem extends ECS.System {
	constructor() {
		super([InputComponent]);

		this.eventQueue = {};

		document.addEventListener("keydown", (event) => {
			this.addToQueue("keydown", event);
		});

		document.addEventListener("keyup", (event) => {
			this.addToQueue("keyup", event);
		});

		document.addEventListener("wheel", (event) => {
			this.addToQueue("wheel", event);
		});

		document.addEventListener("pointerup", (event) => {
			this.addToQueue("pointerup", event);
		});

		document.addEventListener("pointerdown", (event) => {
			this.addToQueue("pointerdown", event);
		});

		document.addEventListener("pointermove", (event) => {
			this.addToQueue("pointermove", event);
		});
	}

	addToQueue(type, event) {
		this.eventQueue[type] = event;
	}

	updateEntity(entity, dt, params) {
		let input = entity.getComponent(InputComponent);
		input.events = Object.assign({}, this.eventQueue);
	}

	updateSystem(ecs, dt, params) {
		for (let entity of ecs.entities.filter((entity) => this.componentMatch(entity))) {
			this.updateEntity(entity, dt, params);
		}
		this.eventQueue = {};
	}
}
