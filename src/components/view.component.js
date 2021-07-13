import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { FiniteStateMachine, State } from "../state/fsm";

export class OrbitView extends State {
	constructor() {
		super();

		this.phi = Math.PI / 2;
		this.theta = 0;
		this.radius = 10;

		this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10000);
	}
}

export class CockpitView extends State {
	constructor() {
		super();
	}
}

export class ViewComponent extends ECS.Component {
	constructor(entity) {
		super(entity);
		this.views = new FiniteStateMachine();
		this.views.addState(new OrbitView());
		this.views.addState(new CockpitView());
		this.views.setState(OrbitView);
	}

	get current() {
		return this.views.current;
	}

	get camera() {
		return this.views.current.camera;
	}
}
