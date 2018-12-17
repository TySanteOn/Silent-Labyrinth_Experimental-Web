class Maze {
    constructor(scene) {
        this.boxes = [];

        const loader = new THREE.ObjectLoader();
        loader.load('assets/data/maze.dae.json', object => {
            object.children.forEach((child, index) => {
                child.castShadow = true;
                child.receiveShadow = true;

                // const box = new THREE.Box3().setFromObject(child);
                // box.name = `wall ${index}`;
                // this.boxes.push(box);
            });
            object.name = "maze";
            
            scene.add(object);
        });
    }

}

export default Maze;