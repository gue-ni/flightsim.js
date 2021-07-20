import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { Joystick } from "../components/aircraft/joystick.component";
import { Input } from "../components/input.component";
import { MeshModel, SamModel } from "../components/model.component";
import { Trail } from "../components/particles/trail.component";
import { Missile } from "../components/physics/missile.component";
import { Velocity } from "../components/velocity.component";
import { OrbitView, View } from "../components/view.component";
import { MissileSystem } from "./physics/missile.system";

export class SAMSystem extends ECS.System {
	constructor(ecs) {
		super([Input, SamModel]);
		this.ecs = ecs;
	}

	updateEntity(entity, dt, params) {
		let input = entity.getComponent(Input);
		let sam = entity.getComponent(SamModel);

		input.poll("keydown", (event) => {
			switch (event.code) {
				case "KeyF":
					console.log("fire", this);

					let missile = sam.missile_1;

					const scene = entity.root;
					const weapon = new ECS.Entity(scene);
					this.ecs.addEntity(weapon);

					const transform = weapon.transform;
					const parent = transform.parent;

					let wP = missile.getWorldPosition(new THREE.Vector3());
					weapon.transform.position.copy(wP);
					weapon.transform.rotation.set(sam.pitch, sam.yaw + Math.PI, 0);

					let scale = 0.015;
					missile.parent.remove(missile);
					missile.rotation.set(0, 0, -Math.PI / 2);
					missile.scale.set(scale, scale, scale);
					missile.position.set(0, 0, 0);
					weapon.transform.add(missile);

					weapon.addComponent(new Missile(weapon, new THREE.Vector3()));
					weapon.addComponent(new Velocity(weapon, new THREE.Vector3()));
					weapon.addComponent(new Trail(weapon));
					weapon.addComponent(new View(weapon, [OrbitView]));
					//weapon.addComponent(new MeshModel(weapon, missile));
					weapon.addComponent(new Joystick(weapon));

					console.log(weapon);

					break;
			}
		});
	}
}
