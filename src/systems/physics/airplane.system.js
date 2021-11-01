import * as ECS from "lofi-ecs";
import * as THREE from "three";

import { Joystick } from "../../components/aircraft/joystick.component";
import { Airplane } from "../../components/physics/airplane.component";
import { SpringODE } from "../../components/physics/spring_ode.component";
import { Velocity } from "../../components/velocity.component";
import { RungeKutta } from "./physics.system";

export class AirplaneSystem extends ECS.System {
	constructor() {
		super([Airplane, Velocity, Joystick]);

		this.previous_pitch = 0;
		this.trimAlpha = -1.5;
	}

	updateEntity(entity, dt, params) {
		let ode = entity.getComponent(Airplane);
		let joystick = entity.getComponent(Joystick);
		let velocity = entity.getComponent(Velocity).velocity;
		let transform = entity.transform;

		//console.log("airplane", entity.position);

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

			let thrust = joystick.throttle * ode.thrust;

			let cl;
			if (ode.alpha < ode.alphaClMax) {
				cl = ode.clSlope0 * ode.alpha + ode.cl0;
			} else {
				cl = ode.clSlope1 * ode.alpha + ode.cl1;
			}

			if (ode.flap == 20) {
				cl += 0.25;
			}
			if (ode.flap == 40) {
				cl += 0.5;
			}
			if (z < 5.0) {
				cl += 0.25;
			}

			let lift = 0.5 * cl * density * vtotal * vtotal * ode.wingArea;

			let aspectRatio = (ode.wingSpan * ode.wingSpan) / ode.wingArea;
			let cd = ode.cdp + (cl * cl) / (Math.PI * aspectRatio * ode.eff);
			let drag = 0.5 * cd * density * vtotal * vtotal * ode.wingArea;

			let cosR = Math.cos(ode.bank);
			let sinR = Math.sin(ode.bank);
			ode.roll = Number(ode.bank);

			let cosP;
			let sinP;
			let cosY;
			let sinY;

			if (vtotal == 0.0) {
				cosP = 1.0;
				sinP = 0.0;
				ode.pitch = 0;
			} else {
				ode.pitch = Math.atan(vz / vh);
				cosP = Math.cos(ode.pitch);
				sinP = Math.sin(ode.pitch);
			}

			if (vh == 0.0) {
				cosY = 1.0;
				sinY = 0.0;
				ode.yaw = 0;
			} else {
				cosY = vx / vh;
				sinY = vy / vh;
				ode.yaw = Math.atan2(vx, vy) - Math.PI / 2;
			}

			const a = thrust - drag;
			const b = 0;
			const c = lift;

			let Fx = cosY * cosP * a + (-sinY * cosR - cosY * sinP * sinR) * b + (sinY * sinR - cosY * sinP * cosR) * c;
			let Fy = sinY * cosP * a + (cosY * cosR - sinY * sinP * sinR) * b + (-cosY * sinR - sinY * sinP * cosR) * c;
			let Fz = sinP * a + cosP * sinR * b + cosP * cosR * c;

			Fz += ode.mass * -9.81;

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

		const maxRollRate = 10.0;
		const maxPitchRate = 50.0;

		ode.throttle = joystick.throttle;
		ode.bank += joystick.roll * maxRollRate * dt;
		ode.alpha += joystick.pitch * maxPitchRate * dt;
		ode.alpha = THREE.MathUtils.clamp(ode.alpha, -5, 20);

		let wQ = transform.getWorldQuaternion(new THREE.Quaternion());
		let worldRotation = new THREE.Euler().setFromQuaternion(wQ, "YZX");
		let pitchrate = worldRotation.z - this.previous_pitch;
		this.previous_pitch = worldRotation.z;

		console.log(worldRotation.x);

		let degRoll = ode.roll % (Math.PI * 2);

		const epsilon = 0.1;
		if (Math.abs(joystick.pitch) < epsilon) {
			if (Math.abs(degRoll) < Math.PI / 2 || Math.abs(degRoll) > (3 / 2) * Math.PI) {
				ode.alpha -= pitchrate * 50;
			} else {
				ode.alpha += pitchrate * 50;
			}
		}
	}
}
