import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { FiniteStateMachine, State } from "../state/fsm";
import { Transform } from "./transform.component";

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
		console.log(this.entity);
		this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10000);
		this.entity.getComponent(Transform).transform.add(this.camera);
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
