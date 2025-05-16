import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { TrackballControls } from "./trackballControls.js";

export class InputHandler {
    constructor(scene, camera, canvas, shaders) {
        this.canvas = canvas;
        this.scene = scene;
        this.camera = camera;
        this.shaders = shaders;

        this.keys = new Set();

        this.mouse = {
            x: 0, y: 0, dx: 0, dy: 0,
            buttons: { left: false, middle: false, right: false },
        };

        this.trackballControls = new TrackballControls(camera, canvas);
        this.zoomSpeed = 0.5;
        this.minDistance = 2;
        this.maxDistance = 20;

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
        e.preventDefault()
        const delta = e.deltaY;
        const direction = delta > 0 ? 1 : -1;

        const target = this.trackballControls.target;
        const cameraToTarget = target.clone().sub(this.camera.position);
        const distance = cameraToTarget.length();

        const zoomStep = direction * this.zoomSpeed;
        const newDistance = distance + zoomStep;

        if (newDistance >= this.minDistance && newDistance <= this.maxDistance) {
            cameraToTarget.normalize().multiplyScalar(-zoomStep);
            this.camera.position.add(cameraToTarget);
            this.camera.lookAt(target);
        }
    }

    handleKeyDown(e) {
        const key = e.key.toLowerCase();
        this.keys.add(key);

        switch (key) {
            case 's':
                this.toggleShading();
                break;
            case 'm':
                this.toggleMapping();
                break;
            default:
                break;
        }
    }

    handleKeyUp(e) {
        this.keys.delete(e.key.toLowerCase());
    }

    toggleShading() {
        const groundGeometry = this.scene.children.find(c => c.geometry instanceof THREE.PlaneGeometry);

        this.scene.children.forEach(child => {
            if (child instanceof THREE.Mesh && child !== groundGeometry) {
                const currentShader = child.material.name;
                const newShader = currentShader === 'blinnphong' ? 'gouraud' : 'blinnphong';

                if (!this.shaders[newShader]) {
                    console.error(`Shader ${newShader} not found!`);
                    return;
                }

                const uniforms = child.material.uniforms;
                const newMaterial = this.shaders[newShader].clone();

                const oldTexture = child.material.uniforms._texture.value;
                oldTexture.needsUpdate = true;

                newMaterial.uniforms = THREE.UniformsUtils.merge([
                    newMaterial.uniforms,
                    {
                        diffuseColor: { value: uniforms.diffuseColor.value.clone() },
                        diffuseStrength: { value: uniforms.diffuseStrength.value },
                        specularStrength: { value: uniforms.specularStrength.value },
                        ambientColor: { value: uniforms.ambientColor.value.clone() },
                        ambientStrength: { value: uniforms.ambientStrength.value },
                        lightPositions: { value: uniforms.lightPositions.value.slice() },
                        lightColors: { value: uniforms.lightColors.value.slice() },
                    }
                ]);

                newMaterial.uniforms._texture.value = oldTexture;
                newMaterial.uniforms.mappingType.value = child.material.uniforms.mappingType.value;
                newMaterial.name = newShader;

                child.material = newMaterial;
                console.log(child.material.name)
            }
        });
    }

    toggleMapping() {
        const groundGeometry = this.scene.children.find(c => c.geometry instanceof THREE.PlaneGeometry);

        this.scene.children.forEach(child => {
            if (child instanceof THREE.Mesh && child !== groundGeometry) {
                const uniforms = child.material.uniforms;
                if (uniforms?.mappingType) {
                    uniforms.mappingType.value = (uniforms.mappingType.value + 1) % 3;
                    // const current = uniforms.mappingType.value;
                    // if (current === 0 || current === 1) {
                    //     uniforms.mappingType.value = 1 - current;
                    // }
                }
            }
        });
    }
}