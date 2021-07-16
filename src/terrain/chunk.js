import * as THREE from "three";

const SEGMENTS = 15;
const TEXTURE = new THREE.TextureLoader().load("assets/textures/red.png");
TEXTURE.minFilter = THREE.NearestFilter;
TEXTURE.magFilter = THREE.NearestFilter;

const load = function (key) {
	return new THREE.TextureLoader().load(`assets/textures/terrain/tile_${key}.png`);
};

const TEXTURES = {
	/*
    "256_-256": load("256_-256"),
    "-256_-256": load("-256_-256"),
    "256_256": load("256_256"),
    "-256_256": load("-256_256"),
*/
};

export class Chunk {
	constructor(root, offset, dimensions, heightmap, key) {
		this.oldDim = dimensions.clone();

		const t = dimensions.x / (SEGMENTS - 2);
		dimensions.x += 2 * t;
		dimensions.y += 2 * t;

		// just for debugging
		const color1 = new THREE.Color(Math.random(), Math.random(), Math.random());
		const color2 = new THREE.Color().lerpColors(
			new THREE.Color(0x523415),
			new THREE.Color(0x745c43),
			dimensions.x / (65536 / 2)
		);
		const color3 = new THREE.Color(0x87683b);

		let material;

		/*
        if (TEXTURES[key]) {
            material = new THREE.MeshStandardMaterial({
                color: color3,
                map: TEXTURES[key],
                wireframe: false,
                side: THREE.DoubleSide,
                flatShading: true,
            });
        } else {
            material = new THREE.MeshStandardMaterial({
                color: color3,
                wireframe: false,
                side: THREE.DoubleSide,
                flatShading: true,
            });
        }
        */

		material = new THREE.MeshStandardMaterial({
			color: color3,
			//vertexColors: true,
			wireframe: false,
			side: THREE.DoubleSide,
			flatShading: true,
		});

		let geometry = new THREE.PlaneGeometry(dimensions.x, dimensions.y, SEGMENTS, SEGMENTS);

		this._plane = new THREE.Mesh(geometry, material);

		this.buildChunk(heightmap, offset);
		this.buildSkirts();
		this.buildUVs();
		//this.buildColor();

		this._plane.position.set(offset.x, 0, offset.y);
		this._plane.rotation.x = Math.PI * -0.5;
		this._plane.receiveShadow = true;
		root.add(this._plane);
	}

	buildChunk(heightmap, offset) {
		let vertices = this._plane.geometry.attributes.position.array;

		for (let i = 0; i < vertices.length; i = i + 3) {
			const x = vertices[i] + offset.x;
			const y = -vertices[i + 1] + offset.y;
			let h = heightmap.get(x, y) * 3;
			vertices[i + 2] = h;
		}

		this._plane.geometry.attributes.position.needsUpdate = true;
		this._plane.geometry.computeVertexNormals();
	}

	buildSkirts() {
		let vertices = this._plane.geometry.attributes.position.array;

		function setHeight(x, z) {
			vertices[(x + z * (SEGMENTS + 1)) * 3 + 2] -= 10;
		}

		for (let i = 0; i <= SEGMENTS; i++) setHeight(0, i);
		for (let i = 0; i <= SEGMENTS; i++) setHeight(SEGMENTS, i);
		for (let i = 0; i <= SEGMENTS; i++) setHeight(i, 0);
		for (let i = 0; i <= SEGMENTS; i++) setHeight(i, SEGMENTS);

		this._plane.geometry.attributes.position.needsUpdate = true;
	}

	buildColor() {
		let color = this._plane.geometry.attributes;
		console.log(color);
	}

	buildUVs() {
		let uv = this._plane.geometry.attributes.uv.array;

		function setUV(x, y, u, v) {
			const i = (y * (SEGMENTS + 1) + x) * 2;
			uv[i + 0] = u;
			uv[i + 1] = v;
		}

		let u = 0;
		const step = 1 / (SEGMENTS - 2);
		for (let x = 1; x < SEGMENTS; x++) {
			let v = 1;
			for (let y = 1; y < SEGMENTS; y++) {
				setUV(x, y, u, v);
				v -= step;
			}
			u += step;
		}

		this._plane.geometry.attributes.uv.needsUpdate = true;
	}

	destroy() {
		const parent = this._plane.parent;
		this._plane.geometry.dispose();
		this._plane.material.dispose();
		parent.remove(this._plane);
	}
}
