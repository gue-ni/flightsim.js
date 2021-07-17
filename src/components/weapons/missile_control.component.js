import * as ECS from "lofi-ecs";
import * as THREE from "three";

export class MissileControl extends ECS.Component {
	constructor(entity) {
		super(entity);
		this.fired = false;
	}
}
