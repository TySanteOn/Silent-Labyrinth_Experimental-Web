class Enemy {
  constructor() {
    this.mesh = new THREE.Object3D();

    //blokje
    const geom = new THREE.BoxGeometry(0, 0, 0, 3, 3, 3);
    const mat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      // wireframe: true,
      // flatShading: true,
    });
    
    loader = new THREE.ObjectLoader();
    loader.load('assets/data/enemy.dae.json', object => {
      enemy = object;

      enemy.scale.set(1.6, 1.6, 1.6);
      enemy.position.y = 20;

      scene.add(enemy);
    });

    const m = new THREE.Mesh(geom, mat);

    m.position.x = 700;
    m.position.y = 20;
    m.position.z = 700;

    m.scale.set(50, 50, 50);

    // m.castShadow = true;
    // m.receiveShadow = true;
    this.mesh.add(m);
  }
};

export default Enemy;