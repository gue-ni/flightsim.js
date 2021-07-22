import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { BoxGeometry } from "three";

export class Collider extends ECS.Component {
	constructor(entity, size = new THREE.Vector3(1, 1, 1)) {
		super(entity);
		this.geometry = new THREE.Box3(
			new THREE.Vector3(-size.x / 2, -size.y / 2, -size.z / 2),
			new THREE.Vector3(size.x / 2, size.y / 2, size.z / 2)
		);

		this.keys = [];
		this.lastHash = "";

		const cube = new THREE.Mesh(
			new THREE.BoxGeometry(size.x, size.y, size.z),
			new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
		);
		entity.transform.add(cube);
	}

	get min() {
		return this.geometry.min;
	}

	get max() {
		return this.geometry.max;
	}

	get center() {
		return this.geometry.getCenter(new THREE.Vector3());
	}

	get hash() {
		let c = this.center;
		let x = Math.floor(c.x / 100);
		let y = Math.floor(c.y / 100);
		let z = Math.floor(c.z / 100);
		return `${x},${y},${z}`;
	}
}
