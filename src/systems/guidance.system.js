import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { Joystick } from "../components/aircraft/joystick.component";
import { Velocity } from "../components/velocity.component";

import { Guidance } from "../components/weapons/guidance.component";

import * as UTIL from "../util/util";

export class GuidanceSystem extends ECS.System {
	constructor() {
		super([Guidance, Velocity, Joystick]);
	}

	updateEntity(entity, dt, params) {
		const guidance = entity.getComponent(Guidance);
		const joystick = entity.getComponent(Joystick);
		const velocity = entity.getComponent(Velocity).velocity;

		if (guidance._prey) {
			const predator = entity;
			const prey = guidance._prey;
			const prey_velocity = prey.getComponent(Velocity).velocity;

			const velocityDifference = new THREE.Vector3().subVectors(prey_velocity, velocity);
			const positionDifference = new THREE.Vector3().subVectors(prey.position, predator.position);
			const timeToIntercept = positionDifference.length() / velocityDifference.length();
			const interceptPoint = prey.position.clone().addScaledVector(prey_velocity, timeToIntercept);

			const target = new THREE.Vector3().subVectors(interceptPoint, predator.position).normalize();
			const heading = velocity.clone().normalize();

			let yaw = UTIL.azimuthDifference(heading, target);
			let pitch = UTIL.elevationDifference(heading, target);

			if (Math.abs(yaw) > this._fov || Math.abs(pitch) > this._fov) {
				(yaw = 0), (pitch = 0);
			}

			joystick.yaw = THREE.MathUtils.clamp(yaw, -1, 1);
			joystick.pitch = -THREE.MathUtils.clamp(pitch, -1, 1);
		}
	}
}
