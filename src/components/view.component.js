import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { FiniteStateMachine, State } from "../state/fsm";

class OrbitView extends State {
	constructor() {
		super();
	}
}

class CockpitView extends State {
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
}
