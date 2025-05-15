export const BlinnPhongShader = {
    vertex: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 vViewPosition;
        
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
        uniform vec3 lightPositions[10];
        uniform vec3 lightColors[10];
        uniform float specularPower;
        uniform vec3 diffuseColor;
        uniform float diffuseStrength;
        uniform float specularStrength;
        uniform vec3 ambientColor;
        uniform float ambientStrength;
        
        void main() {
            vec3 totalLight = vec3(0.0);
            
            // Ambient lighting
            vec3 ambient = ambientColor * ambientStrength;
            
            // Process each light
            for(int i = 0; i < 10; i++) {
                
                vec3 lightDir = normalize(lightPositions[i] - vWorldPosition);
                vec3 viewDir = normalize(cameraPosition - vWorldPosition);
                vec3 halfwayDir = normalize(lightDir + viewDir);
                
                float diffuse = max(dot(normalize(vNormal), lightDir), 0.0);
                float specular = pow(max(dot(normalize(vNormal), halfwayDir), 0.0), specularPower);
                
                totalLight += (diffuse * diffuseStrength + specular * specularStrength) * lightColors[i];
            }
            
            gl_FragColor = vec4(diffuseColor * (ambient + totalLight), 1.0);
        }
    `
};