import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { TrackballControls } from "./trackballControls.js";

export class InputHandler {
    constructor(scene, camera, canvas, shaders) {
        this.canvas = canvas;
        this.scene = scene;
        this.camera = camera;
        this.shaders = shaders;

        this.keys = new Set();
        this.currentShader = 'gouraud';

        this.mouse = {
            x: 0, y: 0, dx: 0, dy: 0,
            buttons: { left: false, middle: false, right: false },
        };

        this.trackballControls = new TrackballControls(camera, canvas);
        this.zoomSpeed = 0.1; // Adjust zoom sensitivity
        this.minDistance = 2; // Minimum distance from target
        this.maxDistance = 20; // Maximum distance from target

        this.init();
    }

    init() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));

        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleMouseDown(e) {
        this.mouse.buttons[e.button] = true;
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        if (e.button === 1) {
            this.trackballControls.startRotation(e.clientX, e.clientY);
        }
    }

    handleMouseUp(e) {
        this.mouse.buttons[e.button] = false;
        this.mouse.dx = this.mouse.dy = 0;

        if (e.button === 1) {
            this.trackballControls.endRotation();
        }
    }

    handleMouseMove(e) {
        this.mouse.dx = e.clientX - this.mouse.x;
        this.mouse.dy = e.clientY - this.mouse.y;

        if (this.trackballControls.isRotating) {
            this.trackballControls.handleRotation(e.clientX, e.clientY);
        }

        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }

    handleWheel(e) {
        e.preventDefault(); // Prevent page scrolling
        const delta = e.deltaY; // Positive for scroll down, negative for scroll up
        const direction = delta > 0 ? 1 : -1; // Zoom out if scrolling down, zoom in if scrolling up

        // Calculate the vector from camera to target
        const target = this.trackballControls.target;
        const cameraToTarget = target.clone().sub(this.camera.position);
        const distance = cameraToTarget.length();

        // Calculate the zoom step
        const zoomStep = direction * this.zoomSpeed;
        const newDistance = distance + zoomStep;

        console.log(`Distance: ${distance}, New Distance: ${newDistance}, Zoom Step: ${zoomStep}`);

        // Check if the new distance is within bounds
        if (newDistance >= this.minDistance && newDistance <= this.maxDistance) {
            // Move camera along the camera-to-target direction
            cameraToTarget.normalize().multiplyScalar(-zoomStep); // Negative because we add to position
            this.camera.position.add(cameraToTarget);
            this.camera.lookAt(target); // Ensure camera continues looking at target
        }
    }

    handleKeyDown(e) {
        const key = e.key.toLowerCase();
        this.keys.add(key);

        switch (key) {
            case 'shift':
                this.toggleShading();
                break;
            default:
                break;
        }
    }

    handleKeyUp(e) {
        this.keys.delete(e.key.toLowerCase());
    }

    toggleShading() {
        this.currentShader = this.currentShader === 'phong' ? 'gouraud' : 'phong';

        this.scene.children.forEach(child => {
            if (child instanceof THREE.Mesh) {
                const uniforms = child.material.uniforms;
                const newMaterial = this.shaders[this.currentShader].clone();

                newMaterial.uniforms = THREE.UniformsUtils.merge([
                    newMaterial.uniforms,
                    {
                        diffuseColor: { value: uniforms.diffuseColor.value.clone() },
                        diffuseStrength: { value: uniforms.diffuseStrength.value },
                        specularStrength: { value: uniforms.specularStrength.value }
                    }
                ]);

                child.material = newMaterial;
            }
        });
    }
}