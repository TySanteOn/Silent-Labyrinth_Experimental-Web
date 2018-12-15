class Key {
    constructor() {
        const loader = new THREE.ObjectLoader();
        loader.load('./assets/data/key.dae.json', object => {

            object.scale.set(.1, .1, .1);
            object.position.y = 180;
            object.receiveShadow = true;
            object.castShadow = true;
            object.position.x = 350;
            object.position.z = 130;
        });
    }
};

export default Key;