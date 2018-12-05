{
  let loader,
    scene,
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

    document.addEventListener('keydown', handleKeyDown);
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

    camera.position.x = 100;
    camera.position.y = 160;
    camera.position.z = 20;
  }
    
  const createScene = () => {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    scene = new THREE.Scene();

    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    container = document.getElementById('world');
    container.appendChild(renderer.domElement);
  };

  const loop = () => {
    requestAnimationFrame(loop);
    // editLightPower();
    renderer.render(scene, camera);
  };

  const loadMaze = () => {
    loader = new THREE.ObjectLoader();
    loader.load('data/maze-floor.dae.json', object => {
      scene.add(object);
    });
  };

  const handleKeyDown = e => {
    let vector;
    vector = camera.getWorldDirection(vector);
    const angle = Math.atan2(vector.z, vector.x) * -1;
    console.log(angle);

    if (e.keyCode === 37) {
      camera.rotation.y += 10 * Math.PI / 180;
    }
    if (e.keyCode === 39) {
      camera.rotation.y -= 10 * Math.PI / 180;
    }
    if (e.keyCode === 38) {
      camera.position.x += Math.cos(angle) * 20;
      camera.position.z -= Math.sin(angle) * 20;
    }
    if (e.keyCode === 40) {
      camera.position.x -= Math.cos(angle) * 20;
      camera.position.z += Math.sin(angle) * 20;
    }

    pointLight.position.set(camera.position.x, camera.position.y, camera.position.z);

    renderer.render(scene, camera);
  }

  const editLightPower = () => {
    if (micIsOn){
      pointLight.power = volume * 20;
    }
  }

  init();
}