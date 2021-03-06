import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { FiniteStateMachine, State } from "../state/fsm";

export class OrbitView extends State {
	constructor(entity) {
		super();
		this.entity = entity;
		this.theta = -Math.PI / 2;
		this.radius = 4;
		this.phi = Math.PI / 2 - 0.25;

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100000);

		let vec = new THREE.Vector3().setFromSphericalCoords(this.radius, this.phi, this.theta);
		let pos = this.entity.transform.getWorldPosition(new THREE.Vector3());
		this.camera.position.addVectors(pos, vec);
		this.camera.lookAt(pos);

		window.addEventListener("resize", () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
		});
	}
}

export class ThirdPersonView extends State {
	constructor(entity) {
		super();
		this.entity = entity;

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100000);
		this.camera.position.set(-3, 0.5, 0);

		this.camera.zoom = 1.0;
		this.camera.updateProjectionMatrix();

		let a = 100;
		let cameraHeight = this.camera.position.y;

		let r = Math.PI / 2 - (Math.PI / 2 - Math.atan(cameraHeight / a));
		this._default = new THREE.Euler(-r, -Math.PI / 2, 0, "YZX");
		this._rotation = this._default.clone();

		this.camera.rotation.copy(this._rotation);
		this.entity.transform.add(this.camera);

		window.addEventListener("resize", () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
		});
	}
}

export class HudView extends State {
	constructor(entity) {
		super();
		this.entity = entity;
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100000);

		this._default = new THREE.Euler(0, -Math.PI / 2, 0, "YZX");
		this.camera.rotation.copy(this._default);
		this.camera.position.set(1, 0, 0);
		this.entity.transform.add(this.camera);
	}
}

export class CockpitView extends State {
	constructor(entity) {
		super();
		this.entity = entity;

		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100000);
		//this.camera.position.set(0.37, 0.085, 0);
		this.camera.position.set(0.36, 0.085, 0);

		this.camera.zoom = 1.0;
		this.camera.updateProjectionMatrix();

		let a = 100;
		let cameraHeight = this.camera.position.y;

		let r = Math.PI / 2 - (Math.PI / 2 - Math.atan(cameraHeight / a));
		this._default = new THREE.Euler(-r, -Math.PI / 2, 0, "YZX");
		this._rotation = this._default.clone();

		this.camera.rotation.copy(this._rotation);
		this.entity.transform.add(this.camera);

		window.addEventListener("resize", () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
		});
	}
}

export class View extends ECS.Component {
	constructor(entity, states) {
		super(entity);
		this.views = new FiniteStateMachine();

		for (let state of states) {
			this.views.addState(new state(entity));
		}
		this.views.setState(states[0]);
	}

	get current() {
		return this.views.current;
	}

	get camera() {
		return this.views.current.camera;
	}
}
