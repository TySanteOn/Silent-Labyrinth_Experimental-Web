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

      this.enemyLight = new EntityLight(position.x + 35, position.y + 160, position.z, 0xff5e54, 1000);
      this.enemyLight.light.castShadow = true;

      scene.add(this.enemy, this.enemyLight.light);
    });
  }
};

export default Enemy;