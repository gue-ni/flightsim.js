import * as ECS from "lofi-ecs";

export class SamControl extends ECS.Component {
	constructor(entity) {
		super(entity);
		this.sleep = 0;
		//this.yaw = Math.PI / 4;
		this.yaw = 0;
		this.pitch = -Math.PI / 4;
	}
}
