import * as ECS from "lofi-ecs";

export class InputComponent extends ECS.Component {
	constructor(entity) {
		super(entity);
		this.events = {};
	}

	poll(event, callback) {
		if (this.events[event]) callback(this.events[event]);
	}
}
