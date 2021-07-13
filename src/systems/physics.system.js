import * as ECS from "lofi-ecs";
import { ODE } from "../components/physics/ode.component";
import { SpringODE } from "../components/physics/spring_ode.component";
import { Transform } from "../components/transform.component";
import { Velocity } from "../components/velocity.component";

function rungeKutta4(ode, ds, getRightHandSide) {
	const numEqns = ode.numEqns;
	const s = ode.s;
	const q = ode.q;

	const dq1 = getRightHandSide(ode, s, q, q, ds, 0.0);
	const dq2 = getRightHandSide(ode, s + 0.5 * ds, q, dq1, ds, 0.5);
	const dq3 = getRightHandSide(ode, s + 0.5 * ds, q, dq2, ds, 0.5);
	const dq4 = getRightHandSide(ode, s + ds, q, dq3, ds, 1.0);

	ode.s = s + ds;

	for (let j = 0; j < numEqns; j++) {
		q[j] = q[j] + (dq1[j] + 2.0 * dq2[j] + 2.0 * dq3[j] + dq4[j]) / 6.0;
		ode.q[j] = q[j];
	}
}

export class Physics extends ECS.System {
	constructor() {
		super([Transform, SpringODE]);
	}

	getRightHandSide(ode, s, q, deltaQ, ds, qScale) {
		let dq = [];
		let newQ = [];

		for (let i = 0; i < 2; i++) {
			newQ[i] = q[i] + qScale * deltaQ[i];
		}

		dq[0] = (-ds * (ode.mu * newQ[0] + ode.k * newQ[1])) / ode.mass;
		dq[1] = ds * newQ[0];

		return dq;
	}

	updateEntity(entity, dt, params) {
		let ode = entity.getComponent(SpringODE);
		let transform = entity.getComponent(Transform).transform;

		rungeKutta4(ode, dt, this.getRightHandSide);

		transform.position.set(ode.position.x, ode.position.y, ode.position.z);
	}
}
