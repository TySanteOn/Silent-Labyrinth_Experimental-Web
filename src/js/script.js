
//import Key from "./classes/Key.js";

import Player from "./classes/Player.js"
import Enemy from "./classes/Enemy.js";

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
    hemisphereLight,
    player1,
    playerX = 100,
    playerY = 200,
    playerZ = 20,
    overview = false;

  let enemy, door, key;

  let getal1, getal2, getal3;

  let keys = [];

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

    hemisphereLight = new THREE.HemisphereLight(0xffffff, 1);
    scene.add(hemisphereLight);

    document.getElementById(`cameraFullMaze`).addEventListener('click', handleButtonClick);
    document.addEventListener('keypress', handleKeyDown);
  };

  const handleButtonClick = () => {
    overview = !overview;
    if (overview) {
      camera.position.set(700, 3000, 700);
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
    const y = 180;
    const z = 20;

    player1 = new Player(x, y, z);
    scene.add(player1.mesh);
  };

  const createPulseLight = () => {
    const xPos = 100;
    const yPos = 180;
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

//     camera.position.x = 230;
//     camera.position.y = 3000;
//     camera.position.z = 180;
//     camera.rotation.x = 300;
    camera.position.x = 100;
    camera.position.y = 180;
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
      key.rotation.y = keyPositions[getal].direction;

      keys.push(key);
      console.log(keys);
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
    enemy = new Enemy();
    scene.add(enemy.enemy);
  };

  const handleKeyDown = e => {
    let vector;
    vector = camera.getWorldDirection(vector);
    const angle = Math.atan2(vector.z, vector.x) * -1;

    checkForHitCollision();
    
    switch (e.keyCode) {
      case 37:
        camera.rotation.y += (10 * Math.PI) / 180;
        break;
      case 39:
        camera.rotation.y -= (10 * Math.PI) / 180;
        break;
      case 38:
        playerX += Math.cos(angle) * 20;
        playerZ -= Math.sin(angle) * 20;
        break;
      case 40:
        playerX -= Math.cos(angle) * 20;
        playerZ += Math.sin(angle) * 20;
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
    if (e.keyCode === 32) {
      key.rotation.y += 10;
    }

    pointLight.position.set(playerX, playerY, playerZ);
    player1.mesh.position.set(playerX - 50, playerY, playerZ);
    

    renderer.render(scene, camera);
  }

  const editLightPower = () => {
    if (micIsOn){
      pointLight.power = volume * 40;
    }
  }


  const loop = () => {
    requestAnimationFrame(loop);
    keys.forEach(key => {
      key.rotation.y += 0.02;
    });
    editLightPower();
    //key.rotation.y += 0.05;
    renderer.render(scene, camera);
  };

  const checkForHitCollision = () => {
    //console.log(scene);
    // for (let i = 0; i < player1.mesh.children[0].geometry.vertices.length; i++) {
    //   const raycaster = new THREE.Raycaster();
    //   raycaster.set(player1.mesh.position, player1.mesh.children[0].geometry.vertices[i]);
    //   // console.log(raycaster);
      
    //   let intersects = raycaster.intersectObjects(scene.children[2].children);
    //   if (intersects.length !== 0) {
    //     console.log(intersects);

    //   }
    // }
    
  }


  init();
}