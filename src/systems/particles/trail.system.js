import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { TrailComponent } from "../../components/particles/trail.component";

export class TrailSystem extends ECS.System {
	constructor() {
		super([TrailComponent]);
	}

	updateEntity(entity, dt, params) {
		let trail = entity.getComponent(TrailComponent);

		function setVert(v1, i, v) {
			v1[i * 3 + 0] = v.x;
			v1[i * 3 + 1] = v.y;
			v1[i * 3 + 2] = v.z;
		}

		function setElement(i, params) {
			let pos = params.position;
			let width = trail.trailWidth;

			const vertical = trail.geometry1.attributes.position.array;
			const horizontal = trail.geometry2.attributes.position.array;

			setVert(vertical, i, new THREE.Vector3(pos.x, pos.y, pos.z + width));
			setVert(vertical, i + trail.length + 1, new THREE.Vector3(pos.x, pos.y, pos.z - width));

			setVert(horizontal, i, new THREE.Vector3(pos.x, pos.y + width, pos.z));
			setVert(horizontal, i + trail.length + 1, new THREE.Vector3(pos.x, pos.y - width, pos.z));

			trail.geometry1.attributes.position.needsUpdate = true;
			trail.geometry2.attributes.position.needsUpdate = true;
		}

		trail._time += dt;

		if (trail._time > trail.intervall) {
			trail._time = 0;

			if (trail.active) {
				trail.tail.unshift({
					position: entity.position.clone(),
				});
				trail.tail.pop();

				for (let i = 0; i < trail.tail.length; i++) {
					setElement(i, trail.tail[i]);
				}
			} else {
				trail.model.visible = false;
			}
		}
	}
}
