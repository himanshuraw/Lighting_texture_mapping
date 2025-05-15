import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';

export class Lighting {
    constructor(scene) {
        this.scene = scene;
        this.ambient = {
            color: 0x404040,
            intensity: 0.2
        };
        this.lights = [];
    }

    addAmbientLight(color, intensity) {
        this.ambient.color = color;
        this.ambient.intensity = intensity;
    }

    addPointLight(color, intensity, position, distance = 50) {
        const light = new THREE.PointLight(color, intensity, distance);
        light.position.copy(position);
        this.lights.push(light);
        this.scene.add(light);
    }

    updateShaderUniforms(materials) {
        materials.forEach(material => {
            if (material.uniforms?.ambientColor) {
                material.uniforms.ambientColor.value.set(this.ambient.color);
                material.uniforms.ambientStrength.value = this.ambient.intensity;
            }

            if (material.uniforms?.lightPositions) {
                const positions = [];
                for (let i = 0; i < 10; i++) {
                    positions.push(this.lights[i] ? this.lights[i].position : new THREE.Vector3(0, 0, 0));
                }
                material.uniforms.lightPositions.value = positions;
            }
            if (material.uniforms?.lightColors) {
                const colors = [];
                for (let i = 0; i < 10; i++) {
                    colors.push(this.lights[i] ? this.lights[i].color : new THREE.Color(0, 0, 0));
                }
                material.uniforms.lightColors.value = colors;
            }
        });
    }

}