import * as ECS from "lofi-ecs";
import * as THREE from "three";

import { RungeKutta } from "./physics.system";
import { Input } from "../../components/input.component";
import { Missile } from "../../components/physics/missile.component";
import { Joystick } from "../../components/aircraft/joystick.component";
import { Velocity } from "../../components/velocity.component";

export class MissileSystem extends ECS.System {
	constructor() {
		super([Missile, Joystick, Velocity]);
	}

	updateEntity(entity, dt, params) {
		const ode = entity.getComponent(Missile);
		let joystick = entity.getComponent(Joystick);
		let velocity = entity.getComponent(Velocity).velocity;
		let transform = entity.transform;

		//console.log("missile", entity.position);

		function getRightHandSide(ode, s, q, deltaQ, ds, qScale) {
			let dQ = [];
			let newQ = [];

			for (let i = 0; i < 6; i++) {
				newQ[i] = q[i] + qScale * deltaQ[i];
			}

			let vx = newQ[0];
			let vy = newQ[2];
			let vz = newQ[4];
			let x = newQ[1];
			let y = newQ[3];
			let z = newQ[5];

			let vh = Math.sqrt(vx * vx + vy * vy);
			let vtotal = Math.sqrt(vx * vx + vy * vy + vz * vz);

			let temperature = 288.15 - 0.0065 * z;
			let grp = 1.0 - (0.0065 * z) / 288.15;
			let pressure = 101325.0 * Math.pow(grp, 5.25);
			let density = (0.00348 * pressure) / temperature;

			let thrust = ode.burntime > 0 ? ode.thrust : 0;

			const cd = 0.5;
			let area = 0.25 * Math.PI * ode.rocketDiameter * ode.rocketDiameter;
			let drag = 0.5 * cd * density * vtotal * vtotal * area;

			let cosRoll = Math.cos(0);
			let sinRoll = Math.sin(0);
			ode.roll = 0;

			let cosPitch;
			let sinPitch;
			let cosYaw;
			let sinYaw;

			if (vtotal == 0.0) {
				cosPitch = 1.0;
				sinPitch = 0.0;
				ode.pitch = 0;
			} else {
				ode.pitch = Math.atan(vz / vh);
				cosPitch = Math.cos(ode.pitch);
				sinPitch = Math.sin(ode.pitch);
			}

			if (vh == 0.0) {
				cosYaw = 1.0;
				sinYaw = 0.0;
				ode.yaw = 0;
			} else {
				cosYaw = vx / vh;
				sinYaw = vy / vh;
				ode.yaw = Math.atan2(vx, vy) - Math.PI / 2;
			}

			const cl = 0.5;

			const a = thrust - drag;
			const b = 0.5 * cl * density * vtotal * vtotal * ode.wingArea * joystick.yaw;
			//const b = 0.5 * cl * density * vtotal * vtotal * ode.wingArea * ode.rudder;
			//const c = 0.5 * cl * density * vtotal * vtotal * ode.wingArea * ode.elevator;
			const c = 0.5 * cl * density * vtotal * vtotal * ode.wingArea * joystick.pitch;

			let Fx =
				cosYaw * cosPitch * a +
				(-sinYaw * cosRoll - cosYaw * sinPitch * sinRoll) * b +
				(sinYaw * sinRoll - cosYaw * sinPitch * cosRoll) * c;
			let Fy =
				sinYaw * cosPitch * a +
				(cosYaw * cosRoll - sinYaw * sinPitch * sinRoll) * b +
				(-cosYaw * sinRoll - sinYaw * sinPitch * cosRoll) * c;
			let Fz = sinPitch * a + cosPitch * sinRoll * b + cosPitch * cosRoll * c;

			Fz += ode.mass * -9.81;

			if (z <= 0.0 && Fz <= 0.0) {
				Fz = 0.0;
			}

			dQ[0] = ds * (Fx / ode.mass);
			dQ[1] = ds * vx;
			dQ[2] = ds * (Fy / ode.mass);
			dQ[3] = ds * vy;
			dQ[4] = ds * (Fz / ode.mass);
			dQ[5] = ds * vz;
			return dQ;
		}

		RungeKutta.rungeKutta4(ode, dt, getRightHandSide);

		transform.position.copy(ode.position);
		transform.position.multiplyScalar(0.1);
		transform.setRotationFromEuler(ode.rotation);

		velocity.copy(ode.velocity);
		velocity.multiplyScalar(0.1);
	}
}
