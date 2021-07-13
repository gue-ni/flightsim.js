import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { ODE } from "./ode.component";

export class SpringODE extends ODE {
	constructor(entity, mass, mu, k, x0) {
		super(entity, 2);
		this.mass = mass;
		this.mu = mu;
		this.k = k;
		this.x0 = x0;
		this.time = 0.0;

		this.q[0] = 0.0;
		this.q[1] = x0;
	}

	get position() {
		return new THREE.Vector3(0, this.q[1], 0);
	}
}
