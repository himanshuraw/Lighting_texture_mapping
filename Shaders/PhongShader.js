export const PhongShader = {
    vertex: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vWorldPosition;
        uniform vec3 diffuseColor;
        
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            vViewPosition = (viewMatrix * worldPosition).xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
    `,
    fragment: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 vViewPosition;
        uniform vec3 lightPosition;
        uniform vec3 lightColor;
        uniform float specularPower;
        uniform vec3 diffuseColor;
        uniform float diffuseStrength;
        uniform float specularStrength;
        
        void main() {
            // Diffuse lighting
            vec3 lightDir = normalize(lightPosition - vWorldPosition);
            float diffuse = max(dot(normalize(vNormal), lightDir), 0.0);
            
            // Specular lighting
            vec3 viewDir = normalize(cameraPosition - vWorldPosition);
            vec3 reflectDir = reflect(-lightDir, normalize(vNormal));
            float specular = pow(max(dot(viewDir, reflectDir), 0.0), specularPower);
            
            vec3 lighting = (diffuse * diffuseStrength + specular * specularStrength) * lightColor;
            gl_FragColor = vec4(diffuseColor * lighting, 1.0);
        }
    `
};