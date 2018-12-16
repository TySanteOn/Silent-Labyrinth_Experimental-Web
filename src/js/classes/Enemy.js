import EntityLight from "./EntityLight.js";

class Enemy {
  constructor(scene) {
    const loader = new THREE.ObjectLoader();
    loader.load('assets/data/enemy.dae.json', object => {
      this.enemy = object;

      this.enemy.scale.set(1.6, 1.6, 1.6);
      this.enemy.position.y = 20;
      this.enemy.name = "enemy";

      this.enemy.children.forEach(child => {
        child.receiveShadow = true;
      });

      const enemyLight = new EntityLight(this.enemy.position.x + 35, this.enemy.position.y + 160, this.enemy.position.z, 0xff5e54);
      enemyLight.light.castShadow = true;

      scene.add(this.enemy, enemyLight.light);
    });
  }
};

export default Enemy;