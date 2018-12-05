class Player {
    constructor() {
        this.mesh = new THREE.Object3D();

        //blokje
        const geom = new THREE.BoxGeometry(100, 100, 100, 1, 1, 1);
        const mat = new THREE.MeshPhongMaterial({
            color: 0xf25346,
        });
        const player = new THREE.Mesh(geom, mat);
        player.castShadow = true;
        player.receiveShadow = true;
        this.mesh.add(player);
    }
};

export default Player;