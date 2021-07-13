import * as ECS from "lofi-ecs";
import { Scene } from "three";

import { InputComponent } from "./components/input2.component";
import { JoystickComponent } from "./components/joystick.component";
import { Box, SimpleModel } from "./components/model.component";
import { Transform } from "./components/transform.component";
import { ViewComponent } from "./components/view.component";

export class Assemblage {
	constructor(assets, scene) {
		this.assets = assets;
		this.scene = scene;
	}

	player(position) {
		const entity = new ECS.Entity();
		entity.addComponent(new Transform(entity, this.scene));
		entity.getComponent(Transform).position = position;

		entity.addComponent(new InputComponent());
		entity.addComponent(new JoystickComponent(entity));
		entity.addComponent(new SimpleModel(entity, this.assets.gltf.falcon.asset));
		entity.addComponent(new ViewComponent());
		return entity;
	}

	basic(position) {
		const entity = new ECS.Entity();
		entity.addComponent(new Transform(entity, this.scene));
		entity.getComponent(Transform).position = position;
		entity.addComponent(new ViewComponent());

		entity.addComponent(new Box(entity));
		return entity;
	}
}
