export const GouraudShader = {
    vertex: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vLighting;
        uniform vec3 lightPositions[10];
        uniform vec3 lightColors[10];
        uniform float specularPower;
        uniform vec3 diffuseColor;
        uniform float diffuseStrength;
        uniform float specularStrength;
        uniform vec3 ambientColor;
        uniform float ambientStrength;

        void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vViewPosition = (viewMatrix * worldPosition).xyz;
            
            vec3 totalLight = vec3(0.0);
            vec3 ambient = ambientColor * ambientStrength;
            
            for(int i = 0; i < 10; i++) {
                
                vec3 lightDir = normalize(lightPositions[i] - worldPosition.xyz);
                vec3 viewDir = normalize(cameraPosition - worldPosition.xyz);
                vec3 reflectDir = reflect(-lightDir, vNormal);
                
                float diffuse = max(dot(vNormal, lightDir), 0.0);
                float specular = pow(max(dot(viewDir, reflectDir), 0.0), specularPower);
                
                totalLight += (diffuse * diffuseStrength + specular * specularStrength) * lightColors[i];
            }
            
            vLighting = ambient + totalLight;
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