import * as ECS from "lofi-ecs";

class Hardpoint {
	constructor(entity, position) {}
}

export class Hardpoints extends ECS.Component {
	constructor(entity) {
		super(entity);

		const y = -0.04;
		const x = -0.25;

		this.h1 = new THREE.Object3D();
		this.h1.position.set(x - 0.05, 0, 0.535);
		this.entity.transform.add(this.h1);

		this.h2 = new THREE.Object3D();
		this.h2.position.set(x, y, 0.42);
		this.entity.transform.add(this.h2);

		this.h3B = new THREE.Object3D();
		this.h3B.position.set(x, y, 0.34);
		this.entity.transform.add(this.h3B);

		this.h3A = new THREE.Object3D();
		this.h3A.position.set(x, y, 0.31);
		this.entity.transform.add(this.h3A);

		this.h7A = new THREE.Object3D();
		this.h7A.position.set(x, y, -0.31);
		this.entity.transform.add(this.h7A);

		this.h7B = new THREE.Object3D();
		this.h7B.position.set(x, y, -0.34);
		this.entity.transform.add(this.h7B);

		this.h8 = new THREE.Object3D();
		this.h8.position.set(x, y, -0.42);
		this.entity.transform.add(this.h8);

		this.h9 = new THREE.Object3D();
		this.h9.position.set(x - 0.05, 0, -0.535);
		this.entity.transform.add(this.h9);
	}
}
