import * as ECS from "lofi-ecs";

export class JoystickComponent extends ECS.Component {
	constructor(entity) {
		super(entity);

		this.yaw = 0;
		this.roll = 0;
		this.pitch = 0;
		this.throttle = 0.5;

		this.KeyA = false;
		this.KeyD = false;
		this.KeyW = false;
		this.KeyS = false;
		this.KeyV = false;
		this.KeyT = false;
		this.KeyR = false;
		this.KeyQ = false;
		this.KeyE = false;
	}
}
