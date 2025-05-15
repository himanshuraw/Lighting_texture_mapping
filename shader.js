import { GouraudShader } from "./Shaders/GouraudShader.js";
import { PhongShader } from "./Shaders/PhongShader.js";
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';

export const createShader = (camera) => {
    const commonUniforms = {
        lightPosition: { value: new THREE.Vector3(5, 5, 5) },
        lightColor: { value: new THREE.Color(0xffffff) },
        cameraPosition: { value: camera.position },
        specularPower: { value: 32 },
        diffuseStrength: { value: 1.0 },
        specularStrength: { value: 1.0 }

    };
    return {
        gouraud: new THREE.ShaderMaterial({
            vertexShader: GouraudShader.vertex,
            fragmentShader: GouraudShader.fragment,
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib.lights,
                commonUniforms
            ])
        }),
        phong: new THREE.ShaderMaterial({
            vertexShader: PhongShader.vertex,
            fragmentShader: PhongShader.fragment,
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib.lights,
                commonUniforms
            ])
        })
    };
};
