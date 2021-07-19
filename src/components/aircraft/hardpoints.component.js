import * as ECS from "lofi-ecs";
import * as THREE from "three";

class Hardpoint {
	constructor(transform, position) {
		this.transform = new THREE.Object3D();
		this.transform.position.copy(position);
		transform.add(this.transform);
		this.weapon = null;
	}

	add(weapon) {
		this.weapon = weapon;
		this.transform.add(weapon.transform);
	}
}

export class FalconHardpoints extends ECS.Component {
	constructor(entity) {
		super(entity);

		const y = -0.04;
		const x = -0.25;

		this.h1 = new Hardpoint(entity.transform, new THREE.Vector3(x - 0.05, 0, 0.535));
		this.h2 = new Hardpoint(entity.transform, new THREE.Vector3(x, y, 0.42));
		this.h3B = new Hardpoint(entity.transform, new THREE.Vector3(x, y, 0.34));
		this.h3A = new Hardpoint(entity.transform, new THREE.Vector3(x, y, 0.31));
		this.h7A = new Hardpoint(entity.transform, new THREE.Vector3(x, y, -0.31));
		this.h7B = new Hardpoint(entity.transform, new THREE.Vector3(x, y, -0.34));
		this.h8 = new Hardpoint(entity.transform, new THREE.Vector3(x, y, -0.42));
		this.h9 = new Hardpoint(entity.transform, new THREE.Vector3(x - 0.05, 0, -0.535));
	}
}

export class SamHardpoints extends ECS.Component {
	constructor(entity, transform) {
		super(entity);

		this.h1 = new Hardpoint(entity.transform, new THREE.Vector3(0, 0.5, 0.5));
		console.log(entity.transform);
		console.log(transform);
	}
}
