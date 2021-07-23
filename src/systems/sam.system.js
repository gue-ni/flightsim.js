import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { Joystick } from "../components/aircraft/joystick.component";
import { Collider } from "../components/collision/collider.component";
import { Radar } from "../components/collision/radar.component";
import { Input } from "../components/input.component";
import { MeshModel, SamModel, SimpleModel } from "../components/model.component";
import { Trail } from "../components/particles/trail.component";
import { Missile } from "../components/physics/missile.component";
import { SamControl } from "../components/sam.component";
import { Velocity } from "../components/velocity.component";
import { HudView, OrbitView, View } from "../components/view.component";
import { Guidance } from "../components/weapons/guidance.component";
import { MissileSystem } from "./physics/missile.system";

export class SAMSystem extends ECS.System {
	constructor(ecs, assets) {
		super([SamModel, Radar, SamControl]);
		this.ecs = ecs;
		this.assets = assets;
	}

	updateEntity(entity, dt, params) {
		let sam = entity.getComponent(SamModel);
		let control = entity.getComponent(SamControl);
		let radar = entity.getComponent(Radar);

		const fireMissile = () => {
			let missile = sam.missile;

			if (!missile || radar.targets.length < 1) {
				return;
			}

			const scene = entity.root;
			const weapon = new ECS.Entity(scene);
			this.ecs.addEntity(weapon);

			let wP = missile.getWorldPosition(new THREE.Vector3());
			let wQ = missile.getWorldQuaternion(new THREE.Quaternion());
			weapon.transform.position.copy(wP);
			weapon.transform.rotation.set(0, sam.yaw + Math.PI, sam.pitch + Math.PI / 2);

			missile.parent.remove(missile);

			weapon.addComponent(new Missile(weapon, new THREE.Vector3()));
			weapon.addComponent(new Velocity(weapon, new THREE.Vector3()));
			weapon.addComponent(new Trail(weapon, 0.5));
			weapon.addComponent(new Guidance(weapon, radar.targets[0]));
			weapon.addComponent(new Collider(weapon));
			weapon.addComponent(new View(weapon, [OrbitView, HudView]));
			weapon.addComponent(new SimpleModel(weapon, this.assets.gltf.sa6_missile.asset));
			weapon.addComponent(new Joystick(weapon));
		};

		if (radar.targets.length > 0 && control.sleep <= 0) {
			fireMissile();
			control.sleep = 10;
		}

		if (control.sleep > 0) {
			control.sleep -= dt;
		}
	}
}
