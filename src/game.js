import * as THREE from "three";
import { Sky } from "three/examples/jsm/objects/Sky";
import Stats from "three/examples/jsm/libs/stats.module.js";

import * as ECS from "lofi-ecs";

import { State } from "./state/fsm";
import { Assemblage } from "./assemblage";
import { SpringSystem } from "./systems/physics/physics.system";
import { AirplaneSystem } from "./systems/physics/airplane.system";

import { Loading, Splash } from "./game_state";
import { JoystickSystem } from "./systems/aircraft/joystick.system";
import { ViewSystem } from "./systems/view.system";
import { InputSystem } from "./systems/input.system";
import { TestSystem } from "./systems/test.system";
import { Terrain } from "./terrain/terrain";
import { CollisionSystem } from "./systems/collision/collisions.system";
import { HUDSystem } from "./systems/aircraft/hud.system";
import { MissileSystem } from "./systems/physics/missile.system";
import { ControlSystem } from "./systems/control.system";
import { EventSystem } from "./systems/event.system";
import { Test2System } from "./systems/test2.system";
import { FalconModelSystem, SamModelSystem } from "./systems/model.system";
import { AfterburnerSystem } from "./systems/particles/afterburner.system";
import { TrailSystem } from "./systems/particles/trail.system";
import { Guidance } from "./components/weapons/guidance.component";
import { StoresManagmentSystem } from "./systems/sms.system";
import { SAMSystem } from "./systems/sam.system";
import { RadarTargetSystem, RadarSystem } from "./systems/collision/radar.system";
import { GuidanceSystem } from "./systems/guidance.system";

let cancel, ecs, renderer, scene, stats, assets, view, terrain, sun;
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
	skyUniforms["mieDirectionalG"].value = 0.1;

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
	const canvas = document.querySelector("#canvas");
	renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, logarithmicDepthBuffer: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.physicallyCorrectLights = true;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;

	window.addEventListener("resize", () => {
		renderer.setSize(window.innerWidth, window.innerHeight);
	});

	stats = new Stats();
	document.body.appendChild(stats.dom);

	scene = new THREE.Scene();
	const skyColor = 0x6c5959;
	scene.background = new THREE.Color(skyColor);

	setup_sky();
	sun = setup_sun();

	terrain = new Terrain(scene, { heightmap: assets.textures.heightmap.asset.image });

	ecs = new ECS.ECS();
	ecs.addSystem(new InputSystem());
	ecs.addSystem(new EventSystem());
	ecs.addSystem(new JoystickSystem());
	ecs.addSystem(new SpringSystem());
	ecs.addSystem(new AirplaneSystem());
	ecs.addSystem(new TestSystem());
	ecs.addSystem(new FalconModelSystem());
	ecs.addSystem(new StoresManagmentSystem());
	ecs.addSystem(new AfterburnerSystem());
	ecs.addSystem(new TrailSystem());
	ecs.addSystem(new Test2System());
	ecs.addSystem(new HUDSystem());
	ecs.addSystem(new GuidanceSystem());

	ecs.addSystem(new CollisionSystem());
	ecs.addSystem(new RadarSystem());
	ecs.addSystem(new RadarTargetSystem());

	ecs.addSystem(new MissileSystem());
	ecs.addSystem(new SamModelSystem());
	ecs.addSystem(new SAMSystem(ecs, assets));
	ecs.addSystem(new ControlSystem());
	view = ecs.addSystem(new ViewSystem());

	let assemblage = new Assemblage(ecs, assets, scene);

	assemblage.falcon(new THREE.Vector3(-1500, 300, 500), new THREE.Vector3(50, 0, 0));
	assemblage.sam(terrain.placeAt(0, 0));
}

function gameLoop(now) {
	now *= 0.001;
	dt = now - then;
	then = now;
	if (dt > 0.1 || isNaN(dt)) dt = 0.1;

	stats.update();
	ecs.update(dt, {});
	terrain.update(dt, { camera: view.camera });
	renderer.render(scene, view.camera);

	if (sun) {
		sun.position.copy(view.camera.position);
		sun.position.add(new THREE.Vector3(50, 75, 50));
		sun.target.position.copy(view.camera.position);
	}

	cancel = requestAnimationFrame(gameLoop);
}

export class Game extends State {
	constructor(fsm) {
		super();
		this.fsm = fsm;
	}

	enter(previous) {
		if (this == previous) return;

		if (previous.constructor == Splash || previous.constructor == Loading) {
			assets = this.fsm.assetManager.assets;
			setup();
		}

		gameLoop();
	}

	exit(next) {
		if (this == next) return;
		cancelAnimationFrame(cancel);
	}
}
