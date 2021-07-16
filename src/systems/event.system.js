import * as ECS from "lofi-ecs";

import { EventComponent } from "../components/event.component";

export class EventSystem extends ECS.System {
	constructor() {
		super([EventComponent]);

		this.events = {};
	}

	updateEntity(entity, dt, params) {}

	updateSystem(entities, dt, params) {
		for (let entity of entities) {
			const ec = entity.getComponent(EventComponent);
			let events = ec.events;

			for (let event in events) {
				if (!this.events[event]) {
					this.events[event] = [];
				}
				this.events[event].push(events[event]);
			}

			ec.events = {};
		}

		for (let entity of entities) {
			let events = entity.getComponent(EventComponent).events;
			events = JSON.parse(JSON.stringify(this.events));
		}

		this.events = {};
	}
}
