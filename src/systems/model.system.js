import * as THREE from "three";
import * as ECS from "lofi-ecs";
import { FalconModel } from "../components/model.component";
import { CockpitView, OrbitView, ViewComponent } from "../components/view.component";

export class ModelSystem extends ECS.System {
	constructor() {
		super([FalconModel, ViewComponent]);
	}

	updateEntity(entity, dt, params) {
		const view = entity.getComponent(ViewComponent).current;
		const model = entity.getComponent(FalconModel);

		if (view.constructor == CockpitView) {
			model.pilot.visible = false;
		} else {
			model.pilot.visible = true;
		}
	}
}
