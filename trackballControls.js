import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';


export class TrackballControls {
    constructor(camera, domElement) {
        this.camera = camera;
        this.domElement = domElement;

        this.rotateSpeed = 0.005;
        this.minPolarAngle = 0.1;
        this.maxPolarAngle = Math.PI - 0.1;
        this.target = new THREE.Vector3(0, 0, 0);

        this.isRotating = false;
        this.lastMouse = new THREE.Vector2();
        this.spherical = new THREE.Spherical();
    }

    startRotation(x, y) {
        this.isRotating = true;
        this.lastMouse.set(x, y);
        this.updateSpherical();
    }

    endRotation() {
        this.isRotating = false;
    }

    updateSpherical() {
        this.spherical.setFromVector3(
            this.camera.position.clone().sub(this.target)
        );
    }

    handleRotation(x, y) {
        if (!this.isRotating) return;

        const deltaX = x - this.lastMouse.x;
        const deltaY = y - this.lastMouse.y;

        this.spherical.theta -= deltaX * this.rotateSpeed;
        this.spherical.phi -= deltaY * this.rotateSpeed;

        this.spherical.phi = Math.max(
            this.minPolarAngle,
            Math.min(this.maxPolarAngle, this.spherical.phi)
        );

        const newPosition = new THREE.Vector3()
            .setFromSpherical(this.spherical)
            .add(this.target);

        this.camera.position.copy(newPosition);
        this.camera.lookAt(this.target);

        this.lastMouse.set(x, y);
    }

    setTarget(target) {
        this.target.copy(target);
        this.updateSpherical();
    }
}