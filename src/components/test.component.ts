import * as ECS from "lofi-ecs";
import * as THREE from "three";

export class TestComponent extends ECS.Component {

	cube: THREE.Mesh;

	constructor(entity: ECS.Entity) {
		super(entity);
		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		this.cube = new THREE.Mesh(geometry, material);
		this.cube.position.set(100, 0, 0);
		entity.transform.add(this.cube);
	}
}
