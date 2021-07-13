import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { PlayerInputComponent } from "../components/input.component";
import { JoystickComponent } from "../components/joystick.component";

export class JoystickSystem extends ECS.System {
	constructor() {
		super([PlayerInputComponent, JoystickComponent]);
	}

	updateEntity(entity, dt, params) {
		let input = entity.getComponent(PlayerInputComponent);
		let joystick = entity.getComponent(JoystickComponent);

		joystick.yaw = this._input(input.keys.KeyQ, input.keys.KeyE, joystick.yaw, dt);
		joystick.roll = this._input(input.keys.KeyD, input.keys.KeyA, joystick.roll, dt);
		joystick.pitch = this._input(input.keys.KeyW, input.keys.KeyS, joystick.pitch, dt);

		if (input.keys.KeyT) {
			joystick.throttle += 0.5 * dt;
		} else if (input.keys.KeyR) {
			joystick.throttle -= 0.5 * dt;
		}

		joystick.throttle = THREE.MathUtils.clamp(joystick.throttle, 0, 1);
	}

	_input(decrease, increase, value, dt) {
		const factor = 1.0;
		const epsilon = 0.001;

		if (decrease) {
			value -= factor * dt;
		} else if (increase) {
			value += factor * dt;
		} else if (Math.abs(value) > epsilon) {
			value -= value * dt * 5;
		}

		value = THREE.MathUtils.clamp(value, -1, 1);
		return value;
	}
}
