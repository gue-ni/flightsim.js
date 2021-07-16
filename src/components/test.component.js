import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { BoxBufferGeometry } from "three";

export class TestComponent extends ECS.Component {
	constructor(entity) {
		super(entity);
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		cube.position.set(100, 0, 0);
		entity.transform.add(cube);
	}
}
