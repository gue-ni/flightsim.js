import * as ECS from "lofi-ecs";

export class JoystickComponent extends ECS.Component {
	constructor(entity) {
		super(entity);
		this.roll = 0;
		this.pitch = 0;
		this.throttle = 0.5;
		this.yaw = 0;
	}
}
