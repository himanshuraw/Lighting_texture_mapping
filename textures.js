import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';

export function createCheckerTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.fillStyle = 'black';
    const size = 64;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if ((i + j) % 2 === 0) {
                ctx.fillRect(i * size, j * size, size, size);
            }
        }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    texture.needsUpdate = true;
    return texture;
}

export function createWhiteTexture() {
    const texture = new THREE.DataTexture(
        new Uint8Array([255, 255, 255, 255]),
        1, 1,
        THREE.RGBAFormat
    );
    texture.needsUpdate = true;
    return texture;
}

export function createWoodTexture() {
    const canvas = document.createElement('canvas');
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Base wood colors
    const lightWood = [174, 158, 108];
    const darkWood = [121, 87, 53];

    // Create wood grain pattern
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            // Generate Perlin-like noise using sine waves
            const n = (
                Math.sin(x * 0.02 + y * 0.03) * 0.5 +
                Math.sin(x * 0.05 + Math.cos(y * 0.07) * 2) * 0.25 +
                Math.sin(Math.sqrt(x * x + y * y) * 0.1) * 0.5);

            // Create growth rings
            const ring = Math.sin(Math.sqrt(x * x + y * y) * 0.2 + n * 0.3);

            // Combine patterns
            let noise = Math.abs(n + ring * 0.5);

            // Add color variation
            const r = lightWood[0] + (darkWood[0] - lightWood[0]) * noise;
            const g = lightWood[1] + (darkWood[1] - lightWood[1]) * noise;
            const b = lightWood[2] + (darkWood[2] - lightWood[2]) * noise;

            // Add random grain specks
            if (Math.random() < 0.02) {
                ctx.fillStyle = `rgba(${r * 0.8}, ${g * 0.8}, ${b * 0.8}, 1)`;
            } else {
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`;
            }

            ctx.fillRect(x, y, 1, 1);
        }
    }

    // Create texture and set parameters
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4); // Tileable pattern
    texture.anisotropy = 16;
    texture.needsUpdate = true;

    return texture;
}

const textureLoader = new THREE.TextureLoader();

export function createTextureFromJPG(url) {
    const texture = textureLoader.load(
        url,
        undefined, // onLoad callback (optional)
        undefined, // onProgress callback (optional)
        (err) => console.error('Error loading texture:', err)
    );

    // Set texture parameters
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2); // Optional: repeat pattern
    texture.anisotropy = 16; // Improves texture quality at oblique angles
    texture.colorSpace = THREE.SRGBColorSpace; // Proper color handling

    return texture;
}
