import * as THREE from "three";
import * as ECS from "lofi-ecs";

export class Velocity extends ECS.Component {
	constructor(entity) {
		super(entity);
		this.velocity = new THREE.Vector3();
	}
}
