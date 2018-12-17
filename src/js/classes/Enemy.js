import EntityLight from "./EntityLight.js";

class Enemy {
  constructor(scene, position) {
    const loader = new THREE.ObjectLoader();
    loader.load('assets/data/enemy.dae.json', object => {
      this.enemy = object;

      this.enemy.scale.set(1.6, 1.6, 1.6);
      this.enemy.position.set(position.x, position.y, position.z);
      this.enemy.name = "enemy";

      this.enemy.children.forEach(child => {
        child.receiveShadow = true;
      });

      const enemyLight = new EntityLight(this.position.x + 35, this.position.y + 160, this.position.z, 0xff5e54, 1000);
      enemyLight.light.castShadow = true;
      enemyLight.name = "enemyLight";

      scene.add(this.enemy, this.enemyLight.light);
    });
  }
};

export default Enemy;