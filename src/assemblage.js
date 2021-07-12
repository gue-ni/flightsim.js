import * as ECS from "lofi-ecs";
import { PlayerInputComponent } from "./components/input.component";
import { Transform } from "./components/transform.component";

export class Assemblage {
	static player() {
		const entity = new ECS.Entity();
		entity.addComponent(new Transform());
		entity.addComponent(new PlayerInputComponent());
		return entity;
	}
}
