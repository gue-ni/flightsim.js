import * as ECS from "lofi-ecs";

export class SamControl extends ECS.Component {
	constructor(entity) {
		super(entity);
		this.sleep = 0;
	}
}
