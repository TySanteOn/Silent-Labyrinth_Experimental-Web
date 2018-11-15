{
  let loader,
    scene,
    WIDTH,
    HEIGHT,
    camera,
    fieldOfView,
    aspectRatio,
    renderer,
    container;

  const init = () => {
    createScene();
    loadMaze();
    loop(); //start render loop
  };

  const createScene = () => {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    //scene aanmaken
    scene = new THREE.Scene();

    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;

    // //camera aanmaken
    camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio
    );
    camera.position.x = 800;
    camera.position.y = 200;
    camera.position.z = 1500;

    //renderer instellen
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    //renderer koppelen & canvas aanmaken
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    container = document.getElementById('world');
    container.appendChild(renderer.domElement);
  };

  const loop = () => {
    requestAnimationFrame(loop);

    renderer.render(scene, camera);
  };

  const loadMaze = () => {
    loader = new THREE.SVGLoader();
    loader.load('data/maze01.svg', paths);
  };

  const paths = (paths) => {
    console.log(paths);

    const group = new THREE.Group();

    for (let i = 0; i < paths.length; i++) {

      const path = paths[i];

      const material = new THREE.MeshBasicMaterial({
        color: path.color,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const shapes = path.toShapes(true);

      for (let j = 0; j < shapes.length; j++) {

        const shape = shapes[j];
        const geometry = new THREE.ShapeBufferGeometry(shape);
        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);

      };

    };

    scene.add(group);

  };

  init();
}