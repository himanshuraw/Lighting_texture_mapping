import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { TrackballControls } from "./trackballControls.js";

export class InputHandler {
    constructor(scene, camera, canvas, shaders) {
        this.canvas = canvas;
        this.scene = scene;
        this.camera = camera;
        this.shaders = shaders;

        this.keys = new Set();
        //Keystate that would tell if the key was pressed or not
        // this.keyState = {
        //     shift: false,
        //     tab: false
        // }

        this.currentShader = 'gouraud';

        this.mouse = {
            x: 0, y: 0, dx: 0, dy: 0,
            buttons: { left: false, middle: false, right: false },
        }

        this.trackballControls = new TrackballControls(camera, canvas);
        this.init();
    }

    init() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

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

    // Remove if key down will be used to toggle
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