import * as ECS from "lofi-ecs";
import * as THREE from "three";

export class ODE extends ECS.Component {
	constructor(entity, numEqns) {
		super(entity);
		this.numEqns = numEqns;
		this.q = []; // dependant variables
		this.s = 0; // independant variable (time)
	}

	get position() {
		return new THREE.Vector3(this.q[1], this.q[5], this.q[3]);
	}

	get velocity() {
		return new THREE.Vector3(this.q[0], this.q[4], this.q[2]);
	}

	get rotation() {
		return new THREE.Euler(-this.roll, this.yaw, this.pitch, "YZX");
	}
}
