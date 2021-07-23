import * as ECS from "lofi-ecs";
import * as THREE from "three";

export class Guidance extends ECS.Component {
	constructor(entity, target) {
		super(entity);
		this._prey = target;
		this._fov = THREE.MathUtils.degToRad(90);
	}
}
