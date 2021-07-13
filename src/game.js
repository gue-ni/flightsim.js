import * as THREE from "three";
import { Sky } from "three/examples/jsm/objects/Sky";
import Stats from "three/examples/jsm/libs/stats.module.js";

import * as ECS from "lofi-ecs";

import { State } from "./state/fsm";
import { Assemblage } from "./assemblage";
import { Physics } from "./systems/physics.system";

import { Loading } from "./state/game_state";
import { JoystickSystem } from "./systems/joystick.system";
import { ViewSystem } from "./systems/view.system";
import { InputSystem } from "./systems/input.system";
import { TestSystem } from "./systems/test.system";

let cancel, ecs, renderer, scene, stats, assets, view;
let dt,
	then = 0;

function setup_sun() {
	const sun = new THREE.DirectionalLight(0xffffff, 1.5);
	sun.castShadow = true;
	const map_size = Math.pow(2, 17);
	sun.shadow.mapSize.width = map_size;
	sun.shadow.mapSize.height = map_size;
	sun.shadow.camera.near = 1;
	sun.shadow.camera.far = 5000;
	const val = 100;
	sun.shadow.camera.left = -val;
	sun.shadow.camera.bottom = -val;
	sun.shadow.camera.top = val;
	sun.shadow.camera.right = val;
	scene.add(sun);
	scene.add(sun.target);
	return sun;
}

function setup_sky() {
	const sky = new Sky();
	sky.scale.setScalar(450000);
	scene.add(sky);

	const sunVec = new THREE.Vector3();
	const skyUniforms = sky.material.uniforms;
	skyUniforms["turbidity"].value = 10;
	skyUniforms["rayleigh"].value = 2;
	skyUniforms["mieCoefficient"].value = 0.005;
	skyUniforms["mieDirectionalG"].value = 0.8;

	const parameters = {
		elevation: 2,
		azimuth: 180,
	};

	const pmremGenerator = new THREE.PMREMGenerator(renderer);

	const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
	const theta = THREE.MathUtils.degToRad(parameters.azimuth);
	sunVec.setFromSphericalCoords(1, phi, theta);
	sky.material.uniforms["sunPosition"].value.copy(sunVec);
	scene.environment = pmremGenerator.fromScene(sky).texture;

	return sky;
}

function setup() {
	renderer = new THREE.WebGLRenderer({ antialias: false, logarithmicDepthBuffer: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.physicallyCorrectLights = true;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	document.body.appendChild(renderer.domElement);

	stats = new Stats();
	document.body.appendChild(stats.dom);

	scene = new THREE.Scene();
	const skyColor = 0x6c5959;
	scene.background = new THREE.Color(skyColor);

	let sky = setup_sky();
	let sun = setup_sun();

	ecs = new ECS.ECS();
	ecs.addSystem(new InputSystem());
	ecs.addSystem(new JoystickSystem());
	view = ecs.addSystem(new ViewSystem());
	ecs.addSystem(new Physics());
	ecs.addSystem(new TestSystem());

	let assemblage = new Assemblage(assets, scene);

	ecs.addEntity(assemblage.player(new THREE.Vector3()));
	//ecs.addEntity(assemblage.basic(new THREE.Vector3(2, 0, 0)));
}

function gameLoop(now) {
	now *= 0.001;
	dt = now - then;
	then = now;
	if (dt > 0.1 || isNaN(dt)) dt = 0.1;

	stats.update();
	ecs.update(dt, {});
	renderer.render(scene, view.camera);

	cancel = requestAnimationFrame(gameLoop);
}

export class Game extends State {
	enter(previous) {
		if (this == previous) return;

		if (previous.constructor == Loading) {
			assets = previous.assets.assets;
			setup();
		}

		gameLoop();
	}

	exit(next) {
		if (this == next) return;
		cancelAnimationFrame(cancel);
	}
}
