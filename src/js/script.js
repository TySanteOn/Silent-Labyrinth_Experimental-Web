
//import Key from "./classes/Key.js";

import Player from "./classes/Player.js"

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
    player1,
    playerX = 100,
    playerY = 200,
    playerZ = 20,
    overview = false;

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
    createPlayer();

    getMicVolume();
    loop();

    document.getElementById(`cameraFullMaze`).addEventListener('click', handleButtonClick);
    document.addEventListener('keypress', handleKeyDown);
  };

  const handleButtonClick = () => {
    overview = !overview;
    if (overview) {
      camera.position.set(500, 2500, 500);
      camera.rotation.x = 300;
      camera.rotation.y = 0;
    }
    if (!overview) {
      camera.position.set(playerX, playerY, playerZ);
      camera.rotation.x = 0;
    }
  };

  const createPlayer = () => {
    const x = 50;
    const y = 200;
    const z = 20;

    player1 = new Player(x, y, z);
    scene.add(player1.mesh);
  };

  const createPulseLight = () => {
    const xPos = 100;
    const yPos = 200;
    const zPos = 20;

    pointLight = new THREE.PointLight(0xffffff, 1, 1000, 2);
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
    camera.position.y = 200;
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

  const loadMaze = () => {
    loader = new THREE.ObjectLoader();
    loader.load('assets/data/maze02.dae.json', object => {
      object.children.forEach(child => {
        child.castShadow = true;
        child.receiveShadow = true;
      });
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

    switch (e.code) {
      case 'ArrowLeft':
        camera.rotation.y += (10 * Math.PI) / 180;
        break;
      case 'ArrowRight':
        camera.rotation.y -= (10 * Math.PI) / 180;
        break;
      case 'ArrowUp':
        playerX += Math.cos(angle) * 20;
        playerZ -= Math.sin(angle) * 20;
        break;
      case 'ArrowDown':
        playerX -= Math.cos(angle) * 20;
        playerZ += Math.sin(angle) * 20;
        break;
      case 'Enter':
        addKeyToProgress();
        break;
      case 'Space':
        $startscreen.classList.toggle(`hide`);
        $endscreen.classList.toggle(`hide`);
        break;
    }

    if (overview) {
      camera.position.set(500, 2500, 500);
      camera.rotation.x = 300;
    }
    if (!overview) {
      camera.position.set(playerX, playerY, playerZ);
      camera.rotation.x = 0;
    }


    pointLight.position.set(playerX, playerY, playerZ);
    player1.mesh.position.set(playerX - 50, playerY, playerZ);


    renderer.render(scene, camera);
  };

  const editLightPower = () => {
    if (micIsOn) {
      pointLight.power = volume * 40;
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