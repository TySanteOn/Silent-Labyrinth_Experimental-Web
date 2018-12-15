class Enemy {
  constructor() {
    const loader = new THREE.ObjectLoader();
    loader.load('assets/data/enemy.dae.json', object => {
      this.enemy = object;

      this.enemy.scale.set(1.6, 1.6, 1.6);
      this.enemy.position.y = 20;
    });
  }
};

export default Enemy;