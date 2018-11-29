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
    document.body.appendChild(WEBVR.createButton(renderer));

    createScene();
    createCamera();
    createLight();
    loadMaze();
    loop(); //start render loop
    renderVr();
  };

  const createScene = () => {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    //scene aanmaken
    scene = new THREE.Scene();

    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;


    //renderer instellen
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    renderer.vr.enabled = true;

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

  const createCamera = () => {
    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio);
    camera.position.x = 0;
    camera.position.y = 500;
    camera.position.z = 200;
  };

  const createLight = () => {
    const pointLight = new THREE.PointLight(0xffffff, 1, 0, 2);
    pointLight.position.set(0, 0, 0);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 1);
    scene.add(hemisphereLight);
  }

  const loop = () => {
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
    // requestAnimationFrame(loop);

    // renderer.render(scene, camera);
  };

  const loadMaze = () => {
    loader = new THREE.ObjectLoader();
    loader.load('data/maze-floor.dae.json', object => {
      scene.add(object);
    });
  };

  const renderVr = () => {
    
  };

  init();
}