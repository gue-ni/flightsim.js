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
			//color: color3,
			vertexColors: true,
			wireframe: false,
			side: THREE.DoubleSide,
			flatShading: true,
		});

		let geometry = new THREE.PlaneGeometry(dimensions.x, dimensions.y, SEGMENTS, SEGMENTS);

		this._plane = new THREE.Mesh(geometry, material);

		this.buildChunk(heightmap, offset);
		this.buildSkirts();
		this.buildUVs();
		this.buildColor();

		this._plane.position.set(offset.x, 0, offset.y);
		this._plane.rotation.x = Math.PI * -0.5;
		this._plane.receiveShadow = true;
		root.add(this._plane);
	}

	buildChunk(heightmap, offset) {
		const positions = this._plane.geometry.attributes.position;

		for (let i = 0; i < positions.count; i++) {
			const x = positions.getX(i) + offset.x;
			const y = -positions.getY(i) + offset.y;
			let h = heightmap.get(x, y);
			positions.setZ(i, h);
		}

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
		let geometry = this._plane.geometry;
		const positions = geometry.attributes.position;
		const count = positions.count;

		geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
		const colors = geometry.attributes.color;

		let rock = new THREE.Color(0x7d745d);
		let voliage = new THREE.Color(0x848659);
		let snow = new THREE.Color(0xe5f0f8);

		for (let i = 0; i < count; i++) {
			let h = positions.getZ(i);

			if (h > 350) {
				colors.setXYZ(i, snow.r, snow.g, snow.b);
				//colors.setXYZ(i, rock.r, rock.g, rock.b);
			} else if (h > 150) {
				colors.setXYZ(i, rock.r, rock.g, rock.b);
			} else {
				colors.setXYZ(i, voliage.r, voliage.g, voliage.b);
			}
		}
		this._plane.geometry.attributes.color.needsUpdate = true;
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
