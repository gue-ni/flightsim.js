import * as ECS from "lofi-ecs";
import * as THREE from "three";

class Fire {
	constructor(radius, length, opacity, color = 0xff0000) {
		const texture = new THREE.TextureLoader().load("assets/textures/alpha.png");
		texture.rotation = Math.PI / 2;

		const geometry = new THREE.CylinderGeometry(radius * 0.75, radius, length, 10);
		geometry.rotateZ(Math.PI / 2);
		geometry.translate(-length / 2, 0, 0);

		const sideMaterial = new THREE.MeshBasicMaterial({
			alphaMap: texture,
			color: color,
			wireframe: false,
			transparent: true,
			opacity: opacity,
		});

		const topMaterial = new THREE.MeshBasicMaterial({
			color: color,
			side: THREE.DoubleSide,
			wireframe: false,
			transparent: true,
			opacity: 0.0,
		});

		const materials = [sideMaterial, topMaterial, topMaterial];

		this.mesh = new THREE.Mesh(geometry, materials);
	}

	update(dt, params) {}

	destroy() {
		this.mesh.geometry.dispose();
		this.mesh.material.dispose();
	}
}

export class Afterburner extends ECS.Component {
	constructor(entity) {
		super(entity);
		this._muzzlePosition = new THREE.Vector3(-0.75, 0, 0);

		this.inside = new Fire(0.03, 0.2, 1.0, "orange");
		this.outside = new Fire(0.04, 0.3, 0.5, 0x5d6b97);

		this.inside.mesh.position.copy(this._muzzlePosition);
		this.outside.mesh.position.copy(this._muzzlePosition);
		this.entity.transform.add(this.inside.mesh);
		this.entity.transform.add(this.outside.mesh);

		const circle = new THREE.Mesh(
			new THREE.CircleGeometry(0.03, 8),
			new THREE.MeshBasicMaterial({ color: "orange", side: THREE.DoubleSide })
		);

		circle.position.copy(this._muzzlePosition);
		circle.rotateY(Math.PI / 2);
		this.entity.transform.add(circle);
	}

	destroy() {
		this.inside.destroy();
		this.outside.destroy();
	}
}
