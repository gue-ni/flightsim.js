import * as ECS from "lofi-ecs";
import * as THREE from "three";

export class Trail extends ECS.Component {
	constructor(entity, thickness = 0.08, color = 0xb2b2b2) {
		super(entity);

		this.active = true;
		this.length = 150;
		this.popped = 0;
		this.trailWidth = thickness;
		this.intervall = 0.01;
		this._time = 0;

		this.geometry1 = new THREE.PlaneGeometry(this.length, 1, this.length, 1);
		this.geometry1.computeBoundingSphere();
		this.geometry1.boundingSphere.set(new THREE.Vector3(), 16000);

		this.geometry2 = new THREE.PlaneGeometry(this.length, 1, this.length, 1);
		this.geometry2.computeBoundingSphere();
		this.geometry2.boundingSphere.set(new THREE.Vector3(), 16000);

		this.tail = new Array(this.length + 1);
		for (let i = 0; i < this.tail.length; i++) {
			this.tail[i] = { position: this.entity.position.clone() };
			//this.tail[i] = { position: new THREE.Vector3() };
		}

		const texture = new THREE.TextureLoader().load("assets/textures/alpha.png");

		this.material = new THREE.MeshBasicMaterial({
			color: color,
			side: THREE.DoubleSide,
			wireframe: false,
			transparent: true,
			alphaMap: texture,
			blending: THREE.NormalBlending,
		});

		const vert = new THREE.Mesh(this.geometry1, this.material);
		const horiz = new THREE.Mesh(this.geometry2, this.material);

		this.model = new THREE.Object3D();
		this.model.add(vert);
		this.model.add(horiz);

		let scene = this.entity.root;
		scene.add(this.model);
	}

	destroy() {
		this.material.dispose();
		this.geometry1.dispose();
		this.geometry2.dispose();
		this.model.parent.remove(this.model);
	}
}
