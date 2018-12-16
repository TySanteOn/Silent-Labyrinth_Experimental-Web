
import Key from "./classes/Key.js";
import Player from "./classes/Player.js"
import Enemy from "./classes/Enemy.js";
import Door from "./classes/Door.js";
import Maze from "./classes/Maze.js";
import EntityLight from "./classes/EntityLight.js";

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
    playerLight,
    player1,
    playerX = 100,
    playerY = 200,
    playerZ = 20,
    overview = false,
    box;

  let hemiLight;

  let enemy, door, key, maze;

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
    getRandomNumbers();

    hemiLight = new THREE.HemisphereLight(0xffffff);
    scene.add(hemiLight);

    createEntities();

    getMicVolume();
    loop();

    document.getElementById(`cameraFullMaze`).addEventListener('click', handleButtonClick);
    document.addEventListener('keydown', handleKeyDown);
  };

  const handleButtonClick = () => {
    overview = !overview;
    if (overview) {
      camera.position.set(700, 3500, 700);
      camera.rotation.x = 300;
      camera.rotation.y = 0;
    }
    if (!overview) {
      camera.position.set(playerX, playerY, playerZ);
      camera.rotation.x = 0;
    }
  };

  const createEntities = () => {
    //Maze
    maze = new Maze(scene);

    //Door
    door = new Door(scene);

    // Player
    const playerStartX = 50;
    const playerStartY = 180;
    const playerStartZ = 20;

    player1 = new Player(playerStartX, playerStartY, playerStartZ);
    scene.add(player1.mesh);

    playerLight = new EntityLight(playerStartX, playerStartY, playerStartZ, 0xffffff)
    scene.add(playerLight.light);

    // Keys
    createKeys();

    //Enemy
    enemy = new Enemy(scene);

  };

  const createKeys = () => {
    if (getal1 != getal2 && getal1 != getal3 && getal2 != getal3) {
      const getallen = [getal1, getal2, getal3];
      getallen.forEach(getal => {
        new Key(getal, scene, keys, keyPositions);
      });
    } else {
      getRandomNumbers();
      createKeys();
    }
  }

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

  const getRandomNumbers = () => {
    getal1 = Math.floor(Math.random() * 5);
    getal2 = Math.floor(Math.random() * 5);
    getal3 = Math.floor(Math.random() * 5);

  };

  const handleKeyDown = e => {
    checkTestPathFinder();
    let vector = new THREE.Vector3();
    camera.getWorldDirection(vector);
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
      camera.position.set(700, 3500, 700);
      camera.rotation.x = 300;
    }
    if (!overview) {
      camera.position.set(playerX, playerY, playerZ);
      camera.rotation.x = 0;
    }

    playerLight.light.position.set(playerX, playerY, playerZ);
    player1.mesh.position.set(playerX - 50, playerY, playerZ);


    renderer.render(scene, camera);
  };

  const editLightPower = () => {
    if (micIsOn){
      playerLight.light.power = volume * 60;

      // 18 is al luid
    }
  }

  const checkTestPathFinder = () => {
    
      // console.log(maze.boxes);
      // if (player1.mesh.position.x == pathFindObject.children[200].position.x && player1.mesh.position.z == pathFindObject.children[200].position.z) {
      //   console.log(player1.mesh.position, pathFindObject.children[200].position);
      // }
      maze.boxes.forEach(box => {
        if (50 > box.distanceToPoint(player1.mesh.position) > 0) {
          console.log("box: ", box);
          const helper = new THREE.Box3Helper(box, 0xffffff);
          scene.remove(scene.children[14]);
          scene.add(helper);
          console.log("distance: ", box.distanceToPoint(player1.mesh.position));
        }
        // const greatWall = scene.getObjectByName('wall 0');
        // scene.remove(greatWall);
      });
    
    // scene.remove(selectedObject);
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