import { GouraudShader } from "./Shaders/GouraudShader.js";
import { BlinnPhongShader } from "./Shaders/BlinnPhongShader.js";
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';

export const createShader = (camera) => {
    const commonUniforms = {
        lightPosition: { value: new THREE.Vector3(5, 5, 5) },
        lightColor: { value: new THREE.Color(0xffffff) },
        cameraPosition: { value: camera.position },
        specularPower: { value: 64 },
        diffuseStrength: { value: 1.0 },
        specularStrength: { value: 1.0 }

    };
    return {
        gouraud: new THREE.ShaderMaterial({
            name: 'gouraud',
            vertexShader: GouraudShader.vertex,
            fragmentShader: GouraudShader.fragment,
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib.lights,
                commonUniforms
            ]),
        }),
        blinnphong: new THREE.ShaderMaterial({
            name: 'blinnphong',
            vertexShader: BlinnPhongShader.vertex,
            fragmentShader: BlinnPhongShader.fragment,
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib.lights,
                commonUniforms
            ]),
        })
    };
};
