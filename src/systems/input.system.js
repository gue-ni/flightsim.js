import * as ECS from "lofi-ecs";
import { PlayerInputComponent } from "../components/input.component";
import { Transform } from "../components/transform.component";

export class Keys {
	constructor() {
		this.KeyA = false;
		this.KeyD = false;
		this.KeyW = false;
		this.KeyS = false;
		this.KeyV = false;
		this.KeyT = false;
		this.KeyR = false;
		this.KeyQ = false;
		this.KeyE = false;
	}
}

export class PlayerInputSystem extends ECS.System {
	constructor() {
		super([PlayerInputComponent]);

		this.keys = new Keys();

		document.addEventListener("keydown", (event) => {
			switch (event.code) {
				case "KeyA":
					this.keys.KeyA = true;
					break;

				case "KeyD":
					this.keys.KeyD = true;
					break;

				case "KeyW":
					this.keys.KeyW = true;
					break;

				case "KeyS":
					this.keys.KeyS = true;
					break;

				case "KeyT":
					this.keys.KeyT = true;
					break;

				case "KeyR":
					this.keys.KeyR = true;
					break;

				case "KeyV":
					this.keys.KeyV = !this.keys.KeyV;
					break;

				case "KeyQ":
					this.keys.KeyQ = true;
					break;

				case "KeyE":
					this.keys.KeyE = true;
					break;
			}
		});

		document.addEventListener("keyup", (event) => {
			switch (event.code) {
				case "KeyA":
					this.keys.KeyA = false;
					break;

				case "KeyD":
					this.keys.KeyD = false;
					break;

				case "KeyW":
					this.keys.KeyW = false;
					break;

				case "KeyS":
					this.keys.KeyS = false;
					break;

				case "KeyT":
					this.keys.KeyT = false;
					break;

				case "KeyR":
					this.keys.KeyR = false;
					break;

				case "KeyQ":
					this.keys.KeyQ = false;
					break;

				case "KeyE":
					this.keys.KeyE = false;
					break;
			}
		});
	}

	updateEntity(entity, dt, params) {
		const input = entity.getComponent(PlayerInputComponent);
		input.keys = Object.assign({}, this.keys);
	}
}
