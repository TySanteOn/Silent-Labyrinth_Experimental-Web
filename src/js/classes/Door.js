class Door {
  constructor(scene) {
    const loader = new THREE.ObjectLoader();
    loader.load('assets/data/door.dae.json', object => {
          this.door = object;

          this.door.position.z = -998.3;
          this.door.position.x = -800;
          this.door.name = "door";

          scene.add(this.door);
    });
  }
};

export default Door;