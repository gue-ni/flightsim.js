import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { Input } from "../components/input.component";
import { ViewComponent, OrbitView, CockpitView } from "../components/view.component";

export class ViewSystem extends ECS.System {
	constructor() {
		super([ViewComponent]);

		this.activeEntity = 0;
		this.pointerdown = false;
	}

	get camera() {
		return this.activeEntity.getComponent(ViewComponent).camera;
	}

	updateSystem(entities, dt, params) {
		this.activeEntity = entities[0];
		this.updateEntity(this.activeEntity, dt, params);
		//this.updateEntity(entities[this.activeEntity], dt, params);
	}

	updateEntity(entity, dt, params) {
		const view = entity.getComponent(ViewComponent).current;
		const input = entity.getComponent(Input);
		const transform = entity.transform;

		input.poll("keydown", (event) => {
			switch (event.code) {
				case "Digit3":
					entity.getComponent(ViewComponent).views.setState(CockpitView);
					break;

				case "Digit4":
					entity.getComponent(ViewComponent).views.setState(OrbitView);
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

			view.camera.rotation.copy(view._rotation);
		}
	}
}
