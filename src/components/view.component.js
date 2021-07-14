import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { FiniteStateMachine, State } from "../state/fsm";

export class OrbitView extends State {
	constructor(entity) {
		super();
		this.entity = entity;
		this.theta = 0;
		this.radius = 5;
		this.phi = Math.PI / 2;
		this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10000);
	}
}

export class CockpitView extends State {
	constructor(entity) {
		super();
		this.entity = entity;

		this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10000);
		this.camera.position.set(0.38, 0.08, 0);
		this.camera.rotation.copy(new THREE.Euler(0, -Math.PI / 2, 0, "YZX"));
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
