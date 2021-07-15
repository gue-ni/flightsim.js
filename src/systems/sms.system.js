import * as ECS from "lofi-ecs";
import { Hardpoints } from "../components/aircraft/hardpoints.component";

export class StoresManagmentSystem extends ECS.System {
	constructor() {
		super([Hardpoints]);
	}

	updateEntity(entity, dt, params) {}
}
