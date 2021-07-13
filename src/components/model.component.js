import * as THREE from "three";
import * as ECS from "lofi-ecs";
import { Transform } from "./transform.component";

export class Box extends ECS.Component {
	constructor(entity, params) {
		super(entity);

		params = params || {};
		let rotation = params.rotation ? params.rotation : new THREE.Vector3();
		let position = params.position ? params.position : new THREE.Vector3();
		let size = params.size ? params.size : new THREE.Vector3(1, 1, 1);
		let castShadow = params.castShadow ? params.castShadow : false;
		let receiveShadow = params.receiveShadow ? params.receiveShadow : false;
		let color = params.color ? params.color : 0xff0000;

		let geometry = new THREE.BoxBufferGeometry(size.x, size.y, size.z);
		let material = new THREE.MeshStandardMaterial({
			color: color,
			flatShading: true,
			emissive: 0xffffff,
			emissiveIntensity: 0,
			roughness: 1.0,
		});

		this.model = new THREE.Mesh(geometry, material);

		this.model.castShadow = true;
		this.model.receiveShadow = receiveShadow;

		this.model.rotateX(rotation.x);
		this.model.rotateY(rotation.y);
		this.model.rotateZ(rotation.z);

		this.model.position.copy(position);

		this.entity.getComponent(Transform).transform.add(this.model);
	}

	destroy() {
		this.model.geometry.dispose();
		this.model.material.dispose();
		this.model.parent.remove(this.model);
	}
}

export class SimpleModel extends ECS.Component {
	constructor(entity, gltf, params) {
		super(entity);
		params = params || {};
		const position = params.position || new THREE.Vector3();
		const scale = params.scale || new THREE.Vector3(0.1, 0.1, 0.1);
		const rotation = params.rotation || new THREE.Vector3(0, Math.PI / 2, 0);

		this.model = gltf.scene.clone();
		this.model.position.copy(position);
		this.model.rotateX(rotation.x);
		this.model.rotateY(rotation.y);
		this.model.rotateZ(rotation.z);
		this.model.scale.copy(scale);

		this.model.traverse(function (mesh) {
			if (mesh.isMesh) {
				mesh.castShadow = true;
				//mesh.receiveShadow = true;
				//mesh.material.side = THREE.FrontSide;
				mesh.material.roughness = 1.0;
				mesh.material.flatShading = true;
			}
		});

		this.entity.getComponent(Transform).transform.add(this.model);
	}

	destroy() {
		for (const child of this.model.children) {
			if (child.geometry) child.geometry.dispose();
			if (child.material) child.material.dispose();
		}
		this.model.parent.remove(this.model);
	}
}
