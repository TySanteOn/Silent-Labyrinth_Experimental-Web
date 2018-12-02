class Maze {
    constructor() {
        const loader = new THREE.ObjectLoader();
        loader.load('data/maze-floor.dae.json', object => {
            loader.add(object);
        });
    }

}

export default Maze;