import Key from "./classes/Key.js";

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

  let keys = [];

  let score = 0;

  const start = Date.now();

  const $startscreen = document.querySelector(`.startscreen`);
  const $endscreen = document.querySelector(`.endscreen`);


  const keyPositions = [
    {
      x: 350,
      z: 130,
      direction: 11
    },
    {
      x: -80,
      z: 2050,
      direction: 22
    },
    {
      x: -680,
      z: 2340,
      direction: 22
    },
    {
      x: 1240,
      z: 350,
      direction: 11
    },
    {
      x: 1080,
      z: 2320,
      direction: 22
    },
    {
      x: 1450,
      z: 880,
      direction: 11
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

    camera.position.x = -900;
    camera.position.y = 150;
    camera.position.z = -800;
    //camera.rotation.x = 300;
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

  const addKeyToProgress = () => {
    if (score < 3) {
      score += 1;
      const collectedKeys = document.querySelector(`.collected-keys`);
      const img = document.createElement("img");
      img.classList.add(`image-progress`);
      img.src = `assets/img/key.png`;
      img.width = 430;
      img.height = 291;
      collectedKeys.appendChild(img);
    }
  };

  const removeKey = () => {
    const key1 = scene.getObjectByName(`${getal1}`);
    const key2 = scene.getObjectByName(`${getal2}`);
    const key3 = scene.getObjectByName(`${getal3}`);
    //console.log(key1, key2, key3);
    console.log(key1.position.z);
    console.log(key1.position.z + 10);
    console.log(camera.position.z);

    if (key1.position.z - 10 >= camera.position.z && key1.position.z + 10 <= camera.position.z) {
      scene.remove(key1);
    }
    if (key2.position.x === camera.position.x && key2.position.z === camera.position.z) {
      scene.remove(key2);
    }
    if (key3.position.x === camera.position.x && key3.position.z === camera.position.z) {
      scene.remove(key3);
    }
    //scene.remove(selectedKey);
    //console.log(keys);
  };

  const loadKey = (getal) => {
    loader = new THREE.ObjectLoader();
    loader.load('assets/data/key.dae.json', object => {
      key = object;
      key.name = `${getal}`;
      key.scale.set(.1, .1, .1);
      key.position.y = 180;
      key.receiveShadow = true;
      key.castShadow = true;

      //links/rechts
      key.position.x = keyPositions[getal].x;
      key.position.z = keyPositions[getal].z;
      key.rotation.y = keyPositions[getal].direction;

      const pointLightKey = new THREE.PointLight(0xffffff, 1, 200);
      pointLightKey.position.set(key.position.x, key.position.y, key.position.z);
      pointLightKey.castShadow = true;

      keys.push(key);
      keys.forEach(key => {
        scene.add(key, pointLightKey);
      });
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
    console.log(scene);
    console.log(keys);
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
      removeKey();
    }
    if (e.keyCode === 40) {
      camera.position.x -= Math.cos(angle) * 20;
      camera.position.z += Math.sin(angle) * 20;
      removeKey();
    }
    if (e.keyCode === 32) {
      $startscreen.classList.toggle(`hide`);
      $endscreen.classList.toggle(`hide`);
    }
    if (e.keyCode === 13) {
      //removeKey();
      addKeyToProgress();
    }

    pointLight.position.set(camera.position.x, camera.position.y, camera.position.z);

    renderer.render(scene, camera);
  };

  const editLightPower = () => {
    if (micIsOn) {
      pointLight.power = volume * 20;
    }
  };

  const showWinscreen = () => {
    if (camera.position.z < -950) {
      const title = document.getElementById(`endscreen-title`);
      title.textContent = `You got out!`;
      const text = document.getElementById(`endscreen-text`);
      text.textContent = `Thanks for playing! Want to play again? Press the SPACEBAR!`;
      $endscreen.classList.remove(`hide`);
    }
  };

  const loop = () => {
    requestAnimationFrame(loop);
    keys.forEach(key => {
      key.rotation.y += 0.02;
    });
    editLightPower();
    showWinscreen();
    renderer.render(scene, camera);
  };

  init();
}