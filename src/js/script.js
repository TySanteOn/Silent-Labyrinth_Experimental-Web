{
  let loader,
    scene,
    startX,
    startY,
    WIDTH,
    HEIGHT,
    camera,
    nearPlane,
    farPlane,
    fieldOfView,
    aspectRatio,
    renderer,
    container,
    pointLight;

  const init = () => {
    createScene();
    createCamera();
    loadMaze();

    createPulseLight();

    getMicVolume();

    loop();
  };

  const createPulseLight = () => {
    const xPos = 0;
    const yPos = 200;
    const zPos = 0;

    pointLight = new THREE.PointLight(0xffffff, 1, 0, 2);
    pointLight.position.set(xPos, yPos, zPos);
    pointLight.castShadow = true;
    scene.add(pointLight);
  };

  const createCamera = () => {

    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = .1;
    farPlane = 10000;

    camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    camera.position.x = 0;
    camera.position.y = 500;
    camera.position.z = 200;


    camera.lookAt(new THREE.Vector3(0, 1, 0));

    
    renderer.domElement.addEventListener('mousedown', (e, renderer, camera) => downClbk(e, renderer, camera));
    renderer.domElement.addEventListener('mouseup', (e, renderer, camera) => upClbk(e, renderer, camera));
  }

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

  const loop = () => {
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
      editLightPower();
    });
  };

  const loadMaze = () => {
    loader = new THREE.ObjectLoader();
    loader.load('data/maze-floor.dae.json', maze => {
      scene.add(maze);
    });
  };

  const editLightPower = () => {
    if (micIsOn){
      pointLight.power = volume * 100;
    }
  }

  init();
}