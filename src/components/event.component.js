import * as ECS from "lofi-ecs";

export class EventComponent extends ECS.Component {
	constructor(entity) {
		super(entity);
		this.events = {};
	}

	post(event, data) {
		this.events[event] = data;
	}

	poll(event, callback) {
		if (this.events[event]) {
			callback(this.events[event]);
		}
	}
}
