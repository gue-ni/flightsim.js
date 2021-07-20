import * as THREE from "three";
import * as ECS from "lofi-ecs";
import { FalconModel, SamModel } from "../components/model.component";
import { CockpitView, View } from "../components/view.component";
import { Joystick } from "../components/aircraft/joystick.component";
import { SamHardpoints } from "../components/aircraft/hardpoints.component";

export class FalconModelSystem extends ECS.System {
	constructor() {
		super([FalconModel, View, Joystick]);
	}

	updateEntity(entity, dt, params) {
		const view = entity.getComponent(View).current;
		const model = entity.getComponent(FalconModel);
		const joystick = entity.getComponent(Joystick);

		if (view.constructor == CockpitView) {
			model.pilot.visible = false;
			model.cannopy.visible = false;
		} else {
			model.pilot.visible = true;
			model.cannopy.visible = true;
		}

		let m;

		m = 0.5;
		if (joystick.pitch) {
			const el = -joystick.pitch * 0.5;
			model.elevator.rotation.set(el, 0, 0);
		}

		m = 0.1;
		if (joystick.roll) {
			const fl = THREE.MathUtils.clamp(-Math.PI * joystick.roll, -m, m);
			model.leftflap.rotation.set(fl, 0, 0);
			model.rightflap.rotation.set(-fl, 0, 0);
		}
	}
}

export class SamModelSystem extends ECS.System {
	constructor() {
		super([SamModel, SamHardpoints]);
	}

	updateEntity(entity, dt, params) {
		let model = entity.getComponent(SamModel);
		let hardpoints = entity.getComponent(SamHardpoints);

		let weapon = hardpoints.h1.weapon;
		//weapon.transform.rotation.set(0, -model.turret.rotation.y - Math.PI / 4, model.turret.rotation.y, "YZX");
		weapon.transform.rotation.set(0, 0, model.turret.rotation.y, "YZX");
	}
}
