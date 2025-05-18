export const GouraudShader = {
    vertex: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        varying vec3 vLighting;
        varying vec2 vUv;
        uniform int mappingType;
        uniform vec3 lightPositions[10];
        uniform vec3 lightColors[10];
        uniform float specularPower;
        uniform vec3 diffuseColor;
        uniform float diffuseStrength;
        uniform float specularStrength;
        uniform vec3 ambientColor;
        uniform float ambientStrength;
        #define PI 3.141592653589793

        void main() {
            vec3 pos = position.xyz;
            
            if (mappingType == 2) {
                vUv = uv;
            } 
            else if (mappingType == 0) { // Spherical
                vec3 pos = position.xyz;
                float radius = length(pos);
                float theta = atan(pos.z, pos.x) + PI/2.0;
                float phi = acos(pos.y / radius);
                vUv = vec2(theta / (2.0 * PI), 1.0 - phi / PI);
            }
            else { // Cylindrical
                float yPos = position.y;
                if (abs(yPos) > 0.74) {
                    vec2 xz = position.xz;
                    float radius = length(xz);
                    float maxRadius = length(vec2(0.2, 0.5));
                    
                    // Calculate angle with same offset as cylindrical mapping
                    float theta = atan(xz.y, xz.x) + PI/2.0;
                    
                    // Normalize coordinates
                    float u = theta / (2.0 * PI);
                    float v = radius / maxRadius;
                    
                    if (yPos > 0.0) { // Top cap
                        vUv = vec2(u, 0.9 + v * 0.1);
                    } else { // Bottom cap
                        vUv = vec2(u, v * 0.1);
                    }
                } 
                else {
                    float theta = atan(position.z, position.x) + PI/2.0;
                    vUv = vec2(theta / (2.0 * PI), (yPos + 0.75) / 1.5);
                }
            }

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
        varying vec2 vUv;
        uniform vec3 diffuseColor;
        uniform sampler2D _texture;
        
        void main() {
            vec4 texColor = texture2D(_texture, vUv);
            gl_FragColor = vec4(texColor.rgb * diffuseColor * vLighting, 1.0);
        }
    `
};