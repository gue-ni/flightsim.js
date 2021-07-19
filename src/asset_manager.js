import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class AssetManager {
	constructor(oncomplete) {
		this.assets = {
			gltf: {
				sam: {
					url: "assets/objects/SA-6.glb",
				},
				drone: {
					url: "assets/objects/MQ-9v2.glb",
				},
				hellfire: {
					url: "assets/objects/AGM-114.glb",
				},
				paveway: {
					url: "assets/objects/GBU-12.glb",
				},
				pickup: {
					url: "assets/objects/Pickup.glb",
				},
				house_1: {
					url: "assets/objects/House_1.glb",
				},
				pickup_wreck: {
					url: "assets/objects/Pickup_wreck.glb",
				},
				falcon: {
					url: "assets/objects/Falcon.glb",
				},
				amraam: {
					url: "assets/objects/AIM-120.glb",
				},
			},
			textures: {
				heightmap: {
					url: "assets/textures/heightmap3.png",
				},
				hexagon: {
					url: "assets/textures/hexagon.png",
				},
				rectangle: {
					url: "assets/textures/rectangle.png",
				},
				red: {
					url: "assets/textures/red.png",
				},
			},
			audio: {
				engine: {
					url: "assets/audio/engine2.mp3",
				},
			},
		};

		this.init(oncomplete);
	}

	async init(oncomplete) {
		const promises = [];

		const load = function (loader, asset) {
			for (const resource of Object.values(asset)) {
				const p = new Promise((resolve, reject) => {
					loader.load(
						resource.url,
						(data) => {
							resource.asset = data;
							resolve(resource);
						},
						null,
						reject
					);
				});
				promises.push(p);
			}
		};

		load(new GLTFLoader(), this.assets.gltf);
		//load(new THREE.AudioLoader(), this.assets.audio);
		load(new THREE.TextureLoader(), this.assets.textures);
		await Promise.all(promises);

		//await new Promise((resolve) => setTimeout(resolve, 1000));

		oncomplete();
	}
}
