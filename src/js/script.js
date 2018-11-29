{
  let loader,
    scene,
    startX,
    startY,
    WIDTH,
    HEIGHT,
    camera,
    fieldOfView,
    aspectRatio,
    renderer,
    container;

  const init = () => {
    createScene();
    createLight();
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
    camera.position.x = -900;
    camera.position.y = 200;
    camera.position.z = -1500;


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

    renderer.domElement.addEventListener('mousedown', (e, renderer, camera) => downClbk(e, renderer, camera));
    renderer.domElement.addEventListener('mouseup', (e, renderer, camera) => upClbk(e, renderer, camera));
  };

  const downClbk = e => {
    renderer.domElement.addEventListener('mousemove', moveClbk);
    startX = e.clientX;
    startY = e.clientY;
  }

  const upClbk = () => {
    renderer.domElement.removeEventListener('mousemove', moveClbk);
  }

  const moveClbk = e => {
    const delX = e.clientX - startX;
    const delY = e.clientY - startY;
    const width = window.innerWidth,
      height = window.innerHeight,
      min = Math.min(width, height);
    camera.rotation.x += delY / min;
    camera.rotation.y += delX / min;
    startX = e.clientX;
    startY = e.clientY;
    renderer.render(scene, camera);
  }

  const createLight = () => {
    const pointLight = new THREE.PointLight(0xffffff, 1, 0, 2);
    pointLight.position.set(0, 0, 0);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 1);
    scene.add(hemisphereLight);
  }

  const loop = () => {
    requestAnimationFrame(loop);

    renderer.render(scene, camera);
  };

  const loadMaze = () => {
    loader = new THREE.ObjectLoader();
    loader.load('data/maze-floor.dae.json', object => {
      scene.add(object);
    });
  };

  init();
}