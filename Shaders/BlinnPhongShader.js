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
        uniform vec3 lightPosition;
        uniform vec3 lightColor;
        uniform float specularPower;
        uniform vec3 diffuseColor;
        uniform float diffuseStrength;
        uniform float specularStrength;
        
        void main() {
            // Light direction
            vec3 lightDir = normalize(lightPosition - vWorldPosition);
            
            // View direction
            vec3 viewDir = normalize(cameraPosition - vWorldPosition);
            
            // Halfway vector
            vec3 halfwayDir = normalize(lightDir + viewDir);
            
            // Diffuse calculation
            float diffuse = max(dot(normalize(vNormal), lightDir), 0.0);
            
            // Blinn-Phong specular calculation
            float specular = pow(
                max(dot(normalize(vNormal), halfwayDir), 0.0),
                specularPower
            );
            
            // Combine lighting components
            vec3 lighting = (diffuse * diffuseStrength + specular * specularStrength) * lightColor;
            gl_FragColor = vec4(diffuseColor * lighting, 1.0);
        }
    `

};