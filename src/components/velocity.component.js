import * as THREE from "three";
import * as ECS from "lofi-ecs";

export class Velocity extends ECS.Component {
	constructor(entity, velocity) {
		super(entity);
		this.velocity = velocity.clone() || new THREE.Vector3();
	}

	get speed() {
		return this.velocity.length();
	}
}
