class EntityLight {
  constructor(x, y, z, color, intensity) {
    this.light = new THREE.PointLight(color, 1, intensity, 1);
    this.light.position.set(x, y, z);
    this.light.castShadow = true;
  }

}

export default EntityLight;