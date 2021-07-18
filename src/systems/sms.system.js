import * as ECS from "lofi-ecs";
import * as THREE from "three";

import { Hardpoints } from "../components/aircraft/hardpoints.component";
import { Joystick } from "../components/aircraft/joystick.component";
import { Input } from "../components/input.component";
import { TrailComponent } from "../components/particles/trail.component";
import { Airplane } from "../components/physics/airplane.component";
import { Missile } from "../components/physics/missile.component";
import { Velocity } from "../components/velocity.component";

export class StoresManagmentSystem extends ECS.System {
	constructor() {
		super([Hardpoints, Input, Velocity]);
	}

	updateEntity(entity, dt, params) {
		const input = entity.getComponent(Input);
		const hardpoints = entity.getComponent(Hardpoints);
		const velocity = entity.getComponent(Velocity).velocity;

		input.poll("keydown", (event) => {
			switch (event.code) {
				case "KeyF":
					const weapon = hardpoints.h1.weapon;
					const scene = weapon.root;
					const transform = weapon.transform;
					const parent = transform.parent;

					let wP = transform.getWorldPosition(new THREE.Vector3());
					let wQ = transform.getWorldQuaternion(new THREE.Quaternion());

					transform.position.copy(wP);
					transform.quaternion.copy(wQ);

					parent.remove(transform);
					scene.add(transform);

					const v = velocity.clone().multiplyScalar(10);

					weapon.addComponent(new Missile(weapon, v));
					weapon.addComponent(new Velocity(weapon, v));
					weapon.addComponent(new TrailComponent(weapon));
					weapon.addComponent(new Joystick(weapon));

					break;
			}
		});
	}
}
