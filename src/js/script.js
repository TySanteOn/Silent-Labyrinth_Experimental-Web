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
    pointLight,
    hemisphereLight;

  let enemy, door, key;

  let getal1, getal2, getal3;

  const keyPositions = [
    {
      x: 170,
      z: 180
    },
    {
      x: -80,
      z: 2050
    },
    {
      x: -680,
      z: 2340
    },
    {
      x: 1240,
      z: 350
    },
    {
      x: 1080,
      z: 2320
    },
    {
      x: 2120,
      z: 880
    }
  ];


  const init = () => {
    createScene();
    createCamera();
    loadMaze();
    loadDoor();
    loadEnemy();
    getRandomNumbers();
    createKeys();

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

    camera.position.x = 1800;
    camera.position.y = 3000;
    camera.position.z = -700;
    camera.rotation.x = 300;
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

  const loadMaze = () => {
    loader = new THREE.ObjectLoader();
    loader.load('assets/data/maze02.dae.json', object => {
      scene.add(object);
    });
  };

  const loadKey = (getal) => {
    loader = new THREE.ObjectLoader();
    loader.load('assets/data/key.dae.json', object => {
      key = object;

      key.scale.set(.1, .1, .1);
      key.position.y = 180;
      key.receiveShadow = true;
      key.castShadow = true;

      //links/rechts
      key.position.x = keyPositions[getal].x;
      key.position.z = keyPositions[getal].z;
      scene.add(key);
    });
  };

  const createKeys = () => {
    if (getal1 != getal2 && getal1 != getal3 && getal2 != getal3) {
      const getallen = [getal1, getal2, getal3];
      getallen.forEach(getal => {
        loadKey(getal);
      });
    } else {
      getRandomNumbers();
      createKeys();
    }
  };

  const getRandomNumbers = () => {
    getal1 = Math.floor(Math.random() * 5);
    getal2 = Math.floor(Math.random() * 5);
    getal3 = Math.floor(Math.random() * 5);

    console.log(getal1, getal2, getal3);
  };

  const loadDoor = () => {
    loader = new THREE.ObjectLoader();
    loader.load('assets/data/door.dae.json', object => {
      door = object;

      door.position.z = -998.3;
      door.position.x = -800;

      scene.add(door);
    });
  };

  const loadEnemy = () => {
    loader = new THREE.ObjectLoader();
    loader.load('assets/data/enemy.dae.json', object => {
      enemy = object;

      enemy.scale.set(1.6, 1.6, 1.6);
      enemy.position.y = 20;

      scene.add(enemy);
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
    if (micIsOn) {
      pointLight.power = volume * 20;
    }
  }

  const loop = () => {
    requestAnimationFrame(loop);
    // editLightPower();
    renderer.render(scene, camera);
  };

  init();
}