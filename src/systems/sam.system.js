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
import { azimuthDifference } from "../util/util";
import { MissileSystem } from "./physics/missile.system";

const vec = new THREE.Vector3();

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

		if (radar.targets.length > 0) {
			const target = radar.targets[0];
			const A = vec.subVectors(target.position.clone(), entity.position.clone());
			A.y = 0;
			A.normalize();
			const B = new THREE.Vector3(-1, 0, 0);
			control.yaw = azimuthDifference(A, B);
		}

		sam.turret.rotation.set(0, control.yaw, 0);
		sam.launcher.rotation.set(control.pitch, 0, 0);

		const fireMissile = () => {
			let missile = sam.missile;

			if (!missile || radar.targets.length < 1) {
				return;
			}

			const scene = entity.root;
			const weapon = new ECS.Entity(scene);
			weapon.lifetime = 15;
			this.ecs.addEntity(weapon);

			let wP = missile.getWorldPosition(new THREE.Vector3());
			let wQ = missile.getWorldQuaternion(new THREE.Quaternion());
			weapon.transform.position.copy(wP);
			weapon.transform.rotation.set(0, control.yaw + Math.PI, control.pitch + Math.PI / 2);

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

		if (control.sleep > 0) control.sleep -= dt;
	}
}
