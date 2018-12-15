class Cube {
  constructor(size) {
    this.mesh = new THREE.Object3D();

    const geom = new THREE.BoxGeometry(100, 100, 100, 5, 5, 5);

    const mat = new THREE.MeshPhongMaterial({
      // color: 0xffffff,
      // wireframe: true,
      // flatShading: true,
    });

      const m = new THREE.Mesh(geom, mat)

      m.position.x = 0;
      m.position.y = 0;
      // m.position.z = 10;
      // m.rotation.z = 2;
      // m.rotation.y = 1;
      const s = size;
      m.scale.set(s, s, s);

      // m.castShadow = true;
      // m.receiveShadow = true;

      this.mesh.add(m);

      // geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

      // geom.mergeVertices();
  }

};

export default Cube;