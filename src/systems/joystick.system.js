import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { InputComponent } from "../components/input.component";
import { Joystick } from "../components/joystick.component";

export class JoystickSystem extends ECS.System {
	constructor() {
		super([InputComponent, Joystick]);
	}

	updateEntity(entity, dt, params) {
		const input = entity.getComponent(InputComponent);
		const joystick = entity.getComponent(Joystick);

		input.poll("keydown", (event) => {
			switch (event.code) {
				case "KeyA":
					joystick.KeyA = true;
					break;

				case "KeyD":
					joystick.KeyD = true;
					break;

				case "KeyW":
					joystick.KeyW = true;
					break;

				case "KeyS":
					joystick.KeyS = true;
					break;

				case "KeyT":
					joystick.KeyT = true;
					break;

				case "KeyR":
					joystick.KeyR = true;
					break;
			}
		});

		input.poll("keyup", (event) => {
			switch (event.code) {
				case "KeyA":
					joystick.KeyA = false;
					break;

				case "KeyD":
					joystick.KeyD = false;
					break;

				case "KeyW":
					joystick.KeyW = false;
					break;

				case "KeyS":
					joystick.KeyS = false;
					break;

				case "KeyT":
					joystick.KeyT = false;
					break;

				case "KeyR":
					joystick.KeyR = false;
					break;
			}
		});

		joystick.yaw = this._input(joystick.KeyQ, joystick.KeyE, joystick.yaw, dt);
		joystick.roll = this._input(joystick.KeyD, joystick.KeyA, joystick.roll, dt);
		joystick.pitch = this._input(joystick.KeyW, joystick.KeyS, joystick.pitch, dt);

		if (joystick.KeyT) {
			joystick.throttle += 0.5 * dt;
		} else if (joystick.KeyR) {
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
