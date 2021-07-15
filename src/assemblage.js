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
	constructor(ecs, assets, scene) {
		this.ecs = ecs;
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
		entity.addComponent(new FalconModel(entity, this.assets.gltf.falcon.asset));
		entity.addComponent(new ViewComponent(entity));

		this.ecs.addEntity(entity);
		return entity;
	}

	missile(parent) {
		const entity = new ECS.Entity(parent);
		this.ecs.addEntity(entity);
		return entity;
	}

	basic(position) {
		const entity = new ECS.Entity(this.scene);
		entity.transform.position.copy(position);
		entity.addComponent(new ViewComponent(entity));
		entity.addComponent(new Collider(entity, new THREE.Vector3(10, 10, 10)));
		entity.addComponent(new Box(entity, { size: new THREE.Vector3(10, 10, 10) }));
		this.ecs.addEntity(entity);
		return entity;
	}
}
