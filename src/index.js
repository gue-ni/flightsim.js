import * as THREE from "three";
import * as ECS from "lofi-ecs";
import { PlayerInputSystem } from "./systems/input.system";
import { Assemblage } from "./assemblage";

let camera, scene, renderer;
let geometry, material, mesh;

const ecs = new ECS.ECS();
ecs.addSystem(new PlayerInputSystem());

const entity = ecs.addEntity(Assemblage.player());

console.log(entity, ecs);

init();

function init() {
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
	camera.position.z = 1;

	scene = new THREE.Scene();

	geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
	material = new THREE.MeshNormalMaterial();

	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	renderer = new THREE.WebGLRenderer({ antialias: false });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setAnimationLoop(animation);
	document.body.appendChild(renderer.domElement);
}

let dt = 0;
let then = 0;
function animation(now) {
	now *= 0.001;
	dt = now - then;
	then = now;

	if (dt > 0.1 || isNaN(dt)) dt = 0.1;

	mesh.rotation.x += dt;
	mesh.rotation.y += dt;

	ecs.update(dt, {});
	renderer.render(scene, camera);
}
