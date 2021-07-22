import * as ECS from "lofi-ecs";
import * as THREE from "three";

import { Collider } from "../../components/collision/collider.component";

export class HashGrid {
	constructor(size) {
		this.size = size || 100;
		this.space = new Map();
	}

	collide(a, b) {
		if (a.geometry.intersectsBox(b.geometry)) {
			let d0;
			let d1;

			d0 = a.max.x - b.min.x;
			d1 = b.max.x - a.min.x;
			let x = d0 < d1 ? d0 : -d1;

			d0 = a.max.y - b.min.y;
			d1 = b.max.y - a.min.y;
			let y = d0 < d1 ? d0 : -d1;

			d0 = a.max.z - b.min.z;
			d1 = b.max.z - a.min.z;
			let z = d0 < d1 ? d0 : -d1;

			return true;
		} else {
			return false;
		}
	}

	_hash(vec) {
		const h = new THREE.Vector3();
		h.x = Math.floor(vec.x / this.size);
		h.y = Math.floor(vec.y / this.size);
		h.z = Math.floor(vec.z / this.size);
		return h;
	}

	_remove(collider) {
		for (let key of collider.keys) {
			if (this.space.has(key)) {
				let list = this.space.get(key);
				list = list.filter((c) => c != collider);
				if (list.length > 0) {
					this.space.set(key, list);
				} else {
					this.space.delete(key);
				}
			}
		}
	}

	_insert(collider) {
		let min = this._hash(collider.min);
		let max = this._hash(collider.max);

		let keys = [];

		for (let i = min.x; i <= max.x; i++) {
			for (let j = min.y; j <= max.y; j++) {
				for (let k = min.z; k <= max.z; k++) {
					let key = `${i},${j},${k}`;

					keys.push(key);

					if (this.space.has(key)) {
						let l = this.space.get(key);
						l.push(collider);
						this.space.set(key, l);
					} else {
						this.space.set(key, [collider]);
					}
				}
			}
		}

		collider.keys = keys;
		return keys;
	}

	updateCollider(collider) {
		const offset = new THREE.Vector3().subVectors(collider.entity.worldPosition, collider.center);
		collider.geometry.translate(offset);

		const hash = collider.hash;

		if (hash !== collider.lastHash) {
			collider.lastHash = hash;
			this._remove(collider);
			this._insert(collider);
		}
	}

	possible_collisions(aabb, type = Collider) {
		let min = this._hash(aabb.min);
		let max = this._hash(aabb.max);

		let possible = new Set();

		for (let i = min.x; i <= max.x; i++) {
			for (let j = min.y; j <= max.y; j++) {
				for (let k = min.z; k <= max.z; k++) {
					let key = `${i},${j},${k}`;

					if (this.space.has(key)) {
						for (let item of this.space.get(key)) {
							if (item != aabb) {
								if (item instanceof type) {
									possible.add(item);
								} else {
									console.log("wrong type, is ", item.constructor.name);
								}
							}
						}
					}
				}
			}
		}
		return possible;
	}

	possible_ray_collisions(ray) {
		let possible = new Set();

		const ray_length = 100;

		let p0 = ray.origin.clone();

		let len = ray.direction.clone();
		len.normalize();
		len.multiplyScalar(ray_length);

		let p1 = new THREE.Vector3();
		p1.addVectors(p0, len);

		let dx = p1.x - p0.x;
		let dy = p1.y - p0.y;
		let dz = p1.z - p0.z;

		const step = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));

		dx = dx / step;
		dy = dy / step;
		dz = dz / step;

		let x = p0.x;
		let y = p0.y;
		let z = p0.z;

		let tmp = "";

		for (let i = 0; i <= Math.ceil(step); i++) {
			let key = `${Math.floor(x / this.size)},${Math.floor(y / this.size)},${Math.floor(z / this.size)}`;

			if (this.space.has(key)) {
				for (let item of this.space.get(key)) {
					possible.add(item);
				}
			}
			x += dx;
			y += dy;
			z += dz;
		}
		return possible;
	}

	possible_point_collisions(point) {
		let h = this._hash(point);

		let key = `${h.x},${h.y},${h.z}`;
		if (this.space.has(key)) {
			return this.space.get(key);
		} else {
			return [];
		}
	}
}

export class CollisionSystem extends ECS.System {
	constructor() {
		super([Collider]);
		this.colliders = new HashGrid(100);
	}

	updateEntity(entity, dt, params) {
		const collider = entity.getComponent(Collider);

		this.colliders.updateCollider(collider);

		for (const possible of this.colliders.possible_collisions(collider, Collider)) {
			if (this.colliders.collide(collider, possible)) {
				console.log("collision", possible.entity.id, collider.entity.id);
			}
		}
	}

	updateSystem(entities, dt, params) {
		for (const entity of entities) {
			this.updateEntity(entity, dt, params);
		}
	}
}
