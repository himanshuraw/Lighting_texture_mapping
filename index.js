import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { InputHandler } from "./inputHandler.js";
import { TrackballControls } from './trackballControls.js';
import { createShader } from './shader.js';
import { Lighting } from './lighting.js';
import { createCheckerTexture, createTextureFromJPG, createWhiteTexture, createWoodTexture } from './textures.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
const canvas = renderer.domElement;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(canvas);

const shaders = createShader(camera);
new InputHandler(scene, camera, canvas, shaders);
const trackball = new TrackballControls(camera, canvas);
trackball.setTarget(new THREE.Vector3(0, 0, 0))

const lighting = new Lighting(scene);
lighting.addAmbientLight(0x404040, 0.5);
lighting.addPointLight(0xffeecc, 1.0, new THREE.Vector3(6, 0, 5));
lighting.addPointLight(0xffeecc, 1.0, new THREE.Vector3(8, -2, 0));

camera.position.set(10, 0, -4);
camera.lookAt(0, 0, 0);

const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = shaders.gouraud.clone();
groundMaterial.uniforms = {
    ...groundMaterial.uniforms,
    diffuseColor: { value: new THREE.Color(0.6, 0.7, 0.8) },
    diffuseStrength: { value: 0.7 },
    specularStrength: { value: 0.1 },
    _texture: { value: createWhiteTexture() },
    mappingType: { value: 2 }
};

const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.75;
scene.add(ground);

// const checkerTexture = createCheckerTexture();
// const woodTexture = createWoodTexture();
// const pineTexture = createTextureFromJPG('./Textures/pine_wood.jpg')
// const plankTexture = createTextureFromJPG('./Textures/plank_wood.jpg')

const texture = [
    createCheckerTexture(),
    createWoodTexture(),
    createTextureFromJPG('./Textures/pine_wood.jpg'),
    createTextureFromJPG('./Textures/plank_wood.jpg')
]

const dominoCount = 9;
const spacing = 1.3;
const startX = -((dominoCount - 1) * spacing) / 2;

for (let i = 0; i < dominoCount; i++) {
    const geometry = new THREE.BoxGeometry(0.5, 1.5, 1, 30, 9, 400);
    const domino = new THREE.Mesh(geometry, shaders.gouraud.clone());

    const diffuseStrength = Math.floor(i / 3) * 0.5;
    const specularStrength = (i % 3) * 0.5;

    domino.material.uniforms = {
        ...domino.material.uniforms,
        diffuseColor: { value: new THREE.Color(0.8, 0.8, 0.8) },
        diffuseStrength: { value: diffuseStrength },
        specularStrength: { value: specularStrength },
        _texture: { value: texture[i % texture.length] },
        mappingType: { value: 2 }
    };


    domino.position.x = startX + i * spacing;
    scene.add(domino);
}


function animate() {
    requestAnimationFrame(animate);

    const materials = scene.children
        .filter(child => child instanceof THREE.Mesh)
        .map(child => child.material);

    lighting.updateShaderUniforms(materials);


    renderer.render(scene, camera);
}

window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

animate();