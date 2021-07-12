import * as THREE from "three";
import { Sky } from "three/examples/jsm/objects/Sky";

import * as ECS from "lofi-ecs";
import { State } from "./state/fsm";
import { Assemblage } from "./assemblage";
import { Physics } from "./systems/physics.system";
import { PlayerInputSystem } from "./systems/input.system";

import { Loading } from "./state/game_state";

let cancel, ecs, renderer, scene, camera;
let dt = 0;
let then = 0;

function setup() {
	renderer = new THREE.WebGLRenderer({ antialias: false, logarithmicDepthBuffer: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
	camera.position.z = 1;

	scene = new THREE.Scene();
	const skyColor = 0x6c5959;
	scene.background = new THREE.Color(skyColor);

	ecs = new ECS.ECS();
	ecs.addSystem(new PlayerInputSystem());
	ecs.addSystem(new Physics());
	ecs.addEntity(Assemblage.player());
}

function animation(now) {
	console.log("animation");
	now *= 0.001;
	dt = now - then;
	then = now;
	if (dt > 0.1 || isNaN(dt)) dt = 0.1;

	ecs.update(dt, {});
	renderer.render(scene, camera);

	cancel = requestAnimationFrame(animation);
}

export class Game extends State {
	enter(previous) {
		if (this == previous) return;
		console.log(previous == Loading);

		if (previous.constructor == Loading) {
			console.log("loaded");
			// TODO get asset manager
			setup();
		}

		animation();
	}

	exit(next) {
		if (this == next) return;
		cancelAnimationFrame(cancel);
	}
}
