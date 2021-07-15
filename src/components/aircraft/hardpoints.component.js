import * as ECS from "lofi-ecs";
import * as THREE from "three";

class Hardpoint {
	constructor(entity, position) {
		this.transform = new THREE.Object3D();
		this.transform.position.copy(position);
		entity.transform.add(this.transform);
		this.weapon = null;
	}

	add(weapon) {
		this.weapon = weapon;
		this.transform.add(weapon.transform);
	}
}

export class Hardpoints extends ECS.Component {
	constructor(entity) {
		super(entity);

		const y = -0.04;
		const x = -0.25;

		this.h1 = new Hardpoint(entity, new THREE.Vector3(x - 0.05, 0, 0.535));
		this.h2 = new Hardpoint(entity, new THREE.Vector3(x, y, 0.42));
		this.h3B = new Hardpoint(entity, new THREE.Vector3(x, y, 0.34));
		this.h3A = new Hardpoint(entity, new THREE.Vector3(x, y, 0.31));
		this.h7A = new Hardpoint(entity, new THREE.Vector3(x, y, -0.31));
		this.h7B = new Hardpoint(entity, new THREE.Vector3(x, y, -0.34));
		this.h8 = new Hardpoint(entity, new THREE.Vector3(x, y, -0.42));
		this.h9 = new Hardpoint(entity, new THREE.Vector3(x - 0.05, 0, -0.535));
	}
}
