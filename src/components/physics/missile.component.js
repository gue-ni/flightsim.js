import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { ODE } from "./ode.component";

export class Missile extends ODE {
	constructor(entity, velocity) {
		super(entity, 6);

		const position = this.entity.position;
		const heading = new THREE.Vector3(1, 0, 0).applyQuaternion(this.entity.transform.quaternion);
		heading.multiplyScalar(0.01);

		this.s = 0;
		this.q[0] = velocity.x + heading.x * 10;
		this.q[2] = velocity.z + heading.z * 10;
		this.q[4] = velocity.y + heading.y * 10;
		this.q[1] = position.x * 10;
		this.q[3] = position.z * 10;
		this.q[5] = position.y * 10;

		this.mass = 50;
		this.diameter = 0.18;
		this.wingArea = 0.5;
		this.thrust = 15000;
		this.burntime = 7;

		this.rudder = 0;
		this.elevator = 0;
		this.time = 0;
		this.alpha = 0;
		this.yaw = 0;
		this.roll = 0;
		this.pitch = 0;
	}
}
