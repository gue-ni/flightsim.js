import * as ECS from "lofi-ecs";
import * as THREE from "three";

import { Keys } from "../systems/input.system";

export class PlayerInputComponent extends ECS.Component {
	constructor(entity) {
		super(entity);
		this.keys = new Keys();
	}
}
