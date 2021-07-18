import * as ECS from "lofi-ecs";
import * as THREE from "three";

import { Cannon } from "../components/cannon.component";

export class CannonSystem extends ECS.System {
	constructor() {
		super([Cannon]);
	}
}
