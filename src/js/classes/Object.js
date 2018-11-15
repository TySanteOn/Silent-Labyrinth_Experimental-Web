class Object {
  constructor() {
    this.mesh = new THREE.Object3D();

    const geom = new THREE.BoxGeometry(1, 1, 1);

    const mat = new THREE.MeshPhongMaterial({
      color: '#FFFFFF',
      // flatShading: true,
    });

      const m = new THREE.Mesh(geom, mat)

      m.position.x = 0;
      m.position.y = 0;
      m.position.z = 10;
      m.rotation.z = 2;
      m.rotation.y = 1;
      const s = 400;
      m.scale.set(s, s, s);

      // m.castShadow = true;
      // m.receiveShadow = true;

      this.mesh.add(m);

      // geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

      // geom.mergeVertices();
  }

};

export default Object;