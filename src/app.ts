import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "three.meshline";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  globalThis.window.innerWidth / globalThis.window.innerHeight,
  0.1,
  1000,
);
scene.background = new THREE.Color(0xFAFAFA);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(globalThis.window.innerWidth, globalThis.window.innerHeight);
document.body.appendChild(renderer.domElement);

const mat = new MeshLineMaterial({
  color: new THREE.Color(0x000000),
  lineWidth: 1,
  resolution: new THREE.Vector2(
    globalThis.window.innerWidth,
    globalThis.window.innerHeight,
  ),
});

const points: THREE.Vector3[] = [];

let freq = 500;
let width = 0.01;

for (let i = 0; i < 1000; i++) {
  points.push(new THREE.Vector3(i * 0.01 - 5, Math.cos(i * 3.14 / 100), 0));
}

const geometry = new MeshLineGeometry();
geometry.setPoints(points);
const mesh = new THREE.Mesh(geometry, mat);
scene.add(mesh);

function updatePoints(t: number) {
  for (let i = 0; i < 1000; i++) {
    points[i].y = Math.cos(i * 3.14 / freq + 0.01 + t * 0.001);
  }
  geometry.setPoints(points, (p: number) => p * width);
}

camera.position.z = 3;

function animate(t: number) {
  requestAnimationFrame(animate);

  updatePoints(t);

  renderer.render(scene, camera);
}

animate(0);

globalThis.window.addEventListener("resize", () => {
  camera.aspect = globalThis.window.innerWidth / globalThis.window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(globalThis.window.innerWidth, globalThis.window.innerHeight);
});

globalThis.window.addEventListener("mousemove", (e) => {
  freq = e.clientX / 4;
  width = e.clientY / 100;
});
