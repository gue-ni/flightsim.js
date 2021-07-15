import * as ECS from "lofi-ecs";

export class EventComponent extends ECS.Component {
	constructor(entity) {
		super(entity);
		this.events = {};
	}
}
