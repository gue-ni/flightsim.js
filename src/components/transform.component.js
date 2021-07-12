import * as ECS from "lofi-ecs";
import * as THREE from "three";

export class Transform extends ECS.Component {
	constructor() {
		super();
		this.transform = new THREE.Object3D();
	}
}
