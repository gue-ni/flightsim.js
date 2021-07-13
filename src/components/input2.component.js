import * as ECS from "lofi-ecs";

export class InputComponent extends ECS.Component {
	constructor(entity) {
		super(entity);

		this.events = {};
		this.subscribers = {};
	}

	subscribe(event, callback) {
		if (!this.subscribers[event]) {
			this.subscribers[event] = [];
		}
		this.subscribers[event].push(callback);
	}

	poll(event, callback) {
		if (this.events[event]) callback(this.events[event]);
	}

	publish(event, data) {
		if (!this.subscribers[event]) return;
		this.subscribers[event].forEach((callback) => callback(data));
	}
}
