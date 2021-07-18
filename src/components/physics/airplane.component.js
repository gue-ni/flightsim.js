import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { ODE } from "./ode.component";

export class Airplane extends ODE {
	constructor(entity, velocity) {
		super(entity, 6);

		this.s = 0;

		let position = this.entity.position;
		console.log(velocity, position);

		this.q[0] = velocity.x * 10;
		this.q[2] = velocity.z * 10;
		this.q[4] = velocity.y * 10;

		this.q[1] = position.x * 10;
		this.q[3] = position.z * 10;
		this.q[5] = position.y * 10;

		this.time = 0;
		this.wingArea = 28;
		this.wingSpan = 9.96;
		this.tailArea = 2.0;

		this.clSlope0 = 0.0889;
		this.clSlope1 = -0.1;

		this.cl0 = 0.178;
		this.cl1 = 3.2;

		this.alphaClMax = 16.0;

		this.cdp = 0.034;
		this.eff = 0.77;

		this.mass = 8573.0;

		this.a = 1.83;
		this.b = -1.32;

		this.flap = 0;
		this.bank = 0;
		this.alpha = 0;
		this.throttle = 0.5;
		this.thrust = 50000;

		this.yaw = 0;
		this.roll = 0;
		this.pitch = 0;
	}
}
