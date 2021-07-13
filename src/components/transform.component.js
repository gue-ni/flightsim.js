import * as ECS from "lofi-ecs";
import * as THREE from "three";

export class Transform extends ECS.Component {
	constructor(entity, parent) {
		super(entity);
		this.transform = new THREE.Object3D();
		parent.add(this.transform);
	}

	get position() {
		return this.transform.position;
	}

	set position(p) {
		this.transform.position.set(p.x, p.y, p.z);
	}

	get worldPosition() {
		return this.transform.getWorldPosition(new THREE.Vector3());
	}

	get rotation() {
		return this.transform.rotation;
	}

	set rotation(r) {
		this.transform.rotation.set(r.x, r.y, r.z);
	}

	get root() {
		let tmp = this.transform;
		while (tmp.parent !== null) {
			tmp = tmp.parent;
		}
		return tmp;
	}
}
