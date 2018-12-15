class Player {
    constructor(xPos, yPos, zPos) {
        this.mesh = new THREE.Object3D();

        //blokje
        const geom = new THREE.BoxGeometry(0, 0, 0, 3, 3, 3);
        const mat = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            // wireframe: true,
            // flatShading: true,
        });

        const m = new THREE.Mesh(geom, mat);

        m.position.x = xPos;
        m.position.y = yPos;
        m.position.y = zPos;

        m.scale.set(50, 50, 50);

        // m.castShadow = true;
        // m.receiveShadow = true;
        this.mesh.add(m);
    }
};

export default Player;