import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { Scene } from "three";
import { Collider } from "./components/collider.component";
import { HUD } from "./components/hud.component";

import { InputComponent } from "./components/input.component";
import { Joystick } from "./components/joystick.component";
import { Box, FalconModel, SimpleModel } from "./components/model.component";
import { Airplane } from "./components/physics/airplane.component";
import { SpringODE } from "./components/physics/spring_ode.component";
import { TestComponent } from "./components/test.component";
import { Velocity } from "./components/velocity.component";
import { ViewComponent } from "./components/view.component";

export class Assemblage {
	constructor(assets, scene) {
		this.assets = assets;
		this.scene = scene;
	}

	player(position) {
		const entity = new ECS.Entity(this.scene);
		entity.transform.position.copy(position);

		entity.addComponent(new InputComponent(entity));
		//entity.addComponent(new SpringODE(entity, 1, 0.5, 50, 0.5));
		entity.addComponent(new Airplane(entity));
		entity.addComponent(new Velocity(entity));
		entity.addComponent(new Joystick(entity));
		entity.addComponent(new HUD(entity));
		entity.addComponent(new TestComponent(entity));
		entity.addComponent(new Collider(entity));
		entity.addComponent(
			new FalconModel(entity, this.assets.gltf.falcon.asset, {
				rotation: new THREE.Vector3(0, Math.PI * -0.5, 0),
			})
		);
		entity.addComponent(new ViewComponent(entity));
		return entity;
	}

	basic(position) {
		const entity = new ECS.Entity(this.scene);
		entity.transform.position.copy(position);
		entity.addComponent(new ViewComponent(entity));
		entity.addComponent(new Collider(entity, new THREE.Vector3(10, 10, 10)));
		entity.addComponent(new Box(entity, { size: new THREE.Vector3(10, 10, 10) }));
		return entity;
	}
}
