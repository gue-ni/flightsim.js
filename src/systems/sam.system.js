import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { Joystick } from "../components/aircraft/joystick.component";
import { Input } from "../components/input.component";
import { MeshModel, SamModel, SimpleModel } from "../components/model.component";
import { Trail } from "../components/particles/trail.component";
import { Missile } from "../components/physics/missile.component";
import { Velocity } from "../components/velocity.component";
import { HudView, OrbitView, View } from "../components/view.component";
import { MissileSystem } from "./physics/missile.system";

export class SAMSystem extends ECS.System {
	constructor(ecs, assets) {
		super([Input, SamModel]);
		this.ecs = ecs;
		this.assets = assets;
	}

	updateEntity(entity, dt, params) {
		let input = entity.getComponent(Input);
		let sam = entity.getComponent(SamModel);

		input.poll("keydown", (event) => {
			switch (event.code) {
				case "KeyF":
					console.log("fire", this);

					let missile = sam.missile;

					if (!missile) {
						return;
					}

					const scene = entity.root;
					const weapon = new ECS.Entity(scene);
					this.ecs.addEntity(weapon);

					let wP = missile.getWorldPosition(new THREE.Vector3());
					weapon.transform.position.copy(wP);
					weapon.transform.rotation.set(0, sam.yaw + Math.PI, sam.pitch + Math.PI / 2);

					missile.parent.remove(missile);

					weapon.addComponent(new Missile(weapon, new THREE.Vector3()));
					weapon.addComponent(new Velocity(weapon, new THREE.Vector3()));
					weapon.addComponent(new Trail(weapon));
					weapon.addComponent(new View(weapon, [OrbitView, HudView]));
					weapon.addComponent(new SimpleModel(weapon, this.assets.gltf.missile.asset));
					weapon.addComponent(new Joystick(weapon));

					console.log(weapon);

					break;
			}
		});
	}
}
