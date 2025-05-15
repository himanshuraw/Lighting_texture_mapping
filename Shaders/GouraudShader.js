export const GouraudShader = {
    vertex: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vLighting;
        uniform vec3 lightPosition;
        uniform vec3 lightColor;
        uniform float specularPower;
        uniform vec3 diffuseColor;
        uniform float diffuseStrength;
        uniform float specularStrength;

        void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vViewPosition = (viewMatrix * worldPosition).xyz;
            
            vec3 lightDir = normalize(lightPosition - worldPosition.xyz);
            float diffuse = max(dot(vNormal, lightDir), 0.0);
            
            vec3 viewDir = normalize(cameraPosition - worldPosition.xyz);
            vec3 reflectDir = reflect(-lightDir, vNormal);
            float specular = pow(max(dot(viewDir, reflectDir), 0.0), specularPower);
            
            vLighting = (diffuse * diffuseStrength + specular * specularStrength) * lightColor;
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
    `,
    fragment: `
        varying vec3 vLighting;
        uniform vec3 diffuseColor;
        
        void main() {
            gl_FragColor = vec4(diffuseColor * vLighting, 1.0);
        }
    `
};