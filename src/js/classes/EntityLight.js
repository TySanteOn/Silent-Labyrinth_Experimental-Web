class EntityLight {
  constructor(x, y, z, color) {
    this.light = new THREE.PointLight(color, 1, 1000, 2);
    this.light.position.set(x, y, z);
    this.light.castShadow = true;
  }

}

export default EntityLight;