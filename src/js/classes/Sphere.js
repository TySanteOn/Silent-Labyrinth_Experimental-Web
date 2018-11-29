class Sphere {
  constructor() {
    this.mesh = new THREE.Object3D();

    const geom = new THREE.SphereGeometry(10);

    const mat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      // wireframe: true,
      flatShading: true,
    });

      const m = new THREE.Mesh(geom, mat)

      m.position.x = 0;
      m.position.y = 0;
      m.position.z = 0;
      // m.rotation.z = ;
      // m.rotation.y = 1;
      // m.scale.set(s, s, s);

      m.castShadow = true;
      // m.receiveShadow = true;

      this.mesh.add(m);

      // geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

      // geom.mergeVertices();
  }

};

export default Sphere;