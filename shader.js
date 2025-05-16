import { GouraudShader } from "./Shaders/GouraudShader.js";
import { BlinnPhongShader } from "./Shaders/BlinnPhongShader.js";
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';

export const createShader = (camera) => {
    const commonUniforms = {
        lightPositions: { value: [] },
        lightColors: { value: [] },
        cameraPosition: { value: camera.position },
        specularPower: { value: 64 },
        diffuseStrength: { value: 1.0 },
        specularStrength: { value: 1.0 },
        ambientColor: { value: new THREE.Color(0x404040) },
        ambientStrength: { value: 0.2 },
        _texture: { value: null },
        mappingType: { value: 0 }
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
