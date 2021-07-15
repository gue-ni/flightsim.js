import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { FiniteStateMachine, State } from "../state/fsm";

export class OrbitView extends State {
	constructor(entity) {
		super();
		this.entity = entity;
		this.theta = 0;
		this.radius = 2;
		this.phi = Math.PI / 2;
		this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10000);
	}
}

export class CockpitView extends State {
	constructor(entity) {
		super();
		this.entity = entity;

		this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10000);
		//this.camera.position.set(0.375, 0.085, 0);
		this.camera.position.set(0.383, 0.085, 0);

		let a = 100;
		let o = this.camera.position.y;

		let x = Math.PI / 2 - (Math.PI / 2 - Math.atan(o / a));

		this._default = new THREE.Euler(-x, -Math.PI / 2, 0, "YZX");
		this._rotation = this._default.clone();

		this.camera.rotation.copy(this._rotation);
		this.entity.transform.add(this.camera);
	}
}

export class ViewComponent extends ECS.Component {
	constructor(entity) {
		super(entity);
		this.views = new FiniteStateMachine();
		this.views.addState(new OrbitView(entity));
		this.views.addState(new CockpitView(entity));
		this.views.setState(OrbitView);
	}

	get current() {
		return this.views.current;
	}

	get camera() {
		return this.views.current.camera;
	}
}
