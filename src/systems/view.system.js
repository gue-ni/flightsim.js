import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { Input } from "../components/input.component";
import { View, OrbitView, CockpitView } from "../components/view.component";

export class ViewSystem extends ECS.System {
	constructor() {
		super([View]);

		this.activeEntity = null;
		this.pointerdown = false;
	}

	get camera() {
		return this.activeEntity.getComponent(View).camera;
	}

	getNext(entities) {
		let current = entities.indexOf(this.activeEntity);
		let next = (current + 1) % entities.length;
		console.log(current, next);

		entities[current].removeComponent(Input);
		entities[next].addComponent(new Input(entities[next]));
		this.activeEntity = entities[next];
	}

	updateSystem(entities, dt, params) {
		if (!this.activeEntity) {
			this.activeEntity = entities[0];
		}
		this.updateEntity(this.activeEntity, dt, { ...params, entities: entities });
	}

	updateEntity(entity, dt, params) {
		const view = entity.getComponent(View).current;
		const input = entity.getComponent(Input);
		const transform = entity.transform;

		if (!input) {
			throw new Error("something is wrong");
			return;
		}

		input.poll("keydown", (event) => {
			switch (event.code) {
				case "Digit1":
					this.getNext(params.entities);
					break;

				case "Digit2":
					entity.getComponent(View).views.setState(CockpitView);
					break;

				case "Digit3":
					entity.getComponent(View).views.setState(OrbitView);
					break;
			}
		});

		if (view.constructor == OrbitView) {
			input.poll("pointermove", (event) => {
				if (this.pointerdown) {
					(view.phi -= event.movementY * dt), (view.theta -= event.movementX * dt);
					view.phi = THREE.MathUtils.clamp(view.phi, 0.1, Math.PI * 0.9);
				}
			});

			input.poll("wheel", (event) => {
				view.radius += event.deltaY * dt * 0.1;
			});

			input.poll("pointerup", () => {
				this.pointerdown = false;
			});

			input.poll("pointerdown", () => {
				this.pointerdown = true;
			});

			let vec = new THREE.Vector3().setFromSphericalCoords(view.radius, view.phi, view.theta);
			let pos = transform.getWorldPosition(new THREE.Vector3());
			view.camera.position.addVectors(pos, vec);
			view.camera.lookAt(pos);
		} else if (view.constructor == CockpitView) {
			input.poll("pointerdown", () => {
				this.pointerdown = true;
			});

			input.poll("pointerup", () => {
				this.pointerdown = false;
				view._rotation.copy(view._default);
			});

			input.poll("pointermove", (event) => {
				if (this.pointerdown) {
					console.log("test");
					view._rotation.x -= event.movementY * dt;
					view._rotation.y -= event.movementX * dt;
				}
			});

			input.poll("touchstart", (event) => {
				console.log("touchstart");
				event.preventDefault();
			});

			input.poll("touchend", (event) => {
				event.preventDefault();
				console.log("touchend");
			});

			input.poll("touchmove", (event) => {
				event.preventDefault();
				console.log("touchmove");
				console.log(event);
			});

			view.camera.rotation.copy(view._rotation);
		}
	}
}
