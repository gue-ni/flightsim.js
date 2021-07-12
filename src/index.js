import * as THREE from "three";
import { Sky } from "three/examples/jsm/objects/Sky";

import * as ECS from "lofi-ecs";
import { PlayerInputSystem } from "./systems/input.system";
import { Assemblage } from "./assemblage";

let camera, scene, renderer;

renderer = new THREE.WebGLRenderer({ antialias: false, logarithmicDepthBuffer: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

renderer.setAnimationLoop(animation);
document.body.appendChild(renderer.domElement);

camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
camera.position.z = 1;

scene = new THREE.Scene();
const skyColor = 0x6c5959;
scene.background = new THREE.Color(skyColor);

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

const ecs = new ECS.ECS();
ecs.addSystem(new PlayerInputSystem());
const entity = ecs.addEntity(Assemblage.player());

let dt = 0;
let then = 0;
function animation(now) {
	now *= 0.001;
	dt = now - then;
	then = now;
	if (dt > 0.1 || isNaN(dt)) dt = 0.1;

	ecs.update(dt, {});
	renderer.render(scene, camera);
}
