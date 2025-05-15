import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { InputHandler } from "./inputHandler.js";
import { TrackballControls } from './trackballControls.js';
import { createShader } from './shader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const canvas = renderer.domElement;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(canvas);

const shaders = createShader(camera);

const inputHandler = new InputHandler(scene, camera, canvas, shaders);
const trackball = new TrackballControls(camera, canvas);
trackball.setTarget(new THREE.Vector3(0, 0, 0))


const dominoCount = 9;
const spacing = 1.3;
const startX = -((dominoCount - 1) * spacing) / 2;

for (let i = 0; i < dominoCount; i++) {
<<<<<<< HEAD
    const geometry = new THREE.BoxGeometry(0.4, 1.5, 0.8, 4, 4, 4);
    const domino = new THREE.Mesh(geometry, shaders.gouraud);
=======
    const geometry = new THREE.BoxGeometry(0.4, 1.5, 0.8);
    const domino = new THREE.Mesh(geometry, shaders.gouraud.clone());
>>>>>>> e9c3cb8 (Added blinnphong)

    const diffuseStrength = (i % 3) * 0.5;;
    const specularStrength = Math.floor(i / 3) * 0.5;

    domino.material.uniforms = {
        ...domino.material.uniforms,
        diffuseColor: { value: new THREE.Color(0.8, 0.8, 0.8) },
        diffuseStrength: { value: diffuseStrength },
        specularStrength: { value: specularStrength }
    };


    domino.position.x = startX + i * spacing;
    domino.position.y = 0; // Ensure y is 0
    domino.position.z = 0; // Ensure z is 0
    scene.add(domino);
}

camera.position.set(0, 0, 12);
const light = new THREE.PointLight(0xffffff, 1);
light.position.set(5, 5, 5);
scene.add(light);

function animate() {
    requestAnimationFrame(animate);

    scene.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
            child.material.uniforms.cameraPosition.value.copy(camera.position);
            child.material.uniforms.lightPosition.value.copy(light.position);
        }
    });

    renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

animate();