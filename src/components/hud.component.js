import * as ECS from "lofi-ecs";
import * as THREE from "three";

export class HUD extends ECS.Component {
	constructor(entity) {
		super(entity);

		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.canvas.width = 500;
		this.canvas.height = 500;

		this.info = { horizon: 0, pitch: 0 };

		const texture = new THREE.CanvasTexture(this.canvas);
		texture.magFilter = THREE.NearestFilter;
		texture.minFilter = THREE.LinearMipMapLinearFilter;

		this.plane = new THREE.Mesh(
			new THREE.PlaneGeometry(1, 1),
			new THREE.MeshBasicMaterial({
				map: texture,
				side: THREE.DoubleSide,
				transparent: true,
				opacity: 0.5,
				alphaTest: 0.1,
			})
		);
		const scale = 0.017;
		this.plane.scale.set(scale, scale, scale);
		this.plane.position.set(0.42, 0.085, 0);
		this.plane.rotateY(-Math.PI / 2);
		this.entity.transform.add(this.plane);
	}
}
