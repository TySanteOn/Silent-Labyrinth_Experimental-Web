
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
    score = 0,
    keys = [],
    getal1,
    getal2,
    getal3,
    randomX,
    randomZ,
    box;

  let hemiLight;

  let enemy, door, key, maze;

  const enemies = [];

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

    getMicVolume();

    document.getElementById(`cameraFullMaze`).addEventListener('click', handleButtonClick);
    document.getElementById(`start-button`).addEventListener('click', handleStartClick);
    document.getElementById(`restart-button`).addEventListener('click', handleRestartClick);
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

  const handleStartClick = () => {
    createEntities();
    loop();
    $startscreen.classList.add(`hide`);
  };

  const handleRestartClick = () => {
    location.reload();
  };

  const createEntities = () => {
    //Maze
    maze = new Maze(scene);

    //Door
    door = new Door(scene);

    // Player
    player1 = new Player(playerX, playerY, playerZ);
    scene.add(player1.mesh);

    playerLight = new EntityLight(playerX, playerY, playerZ, 0xffffff, 1000)
    scene.add(playerLight.light);

    // Keys
    createKeys();

    //Enemy
    for (let i = 0; i < 4; i++) {
      enemy = new Enemy(scene, getRandomPlaceInMaze());
      enemies.push(enemy);
    }

    window.setTimeout(timeEnemyMove, 1000);
  };

  const moveEnemies = () => {
    enemies.forEach(enemy => {
      const pos = getRandomPlaceInMaze();
      enemy.enemy.position.set(pos.x, 20, pos.z);
      enemy.enemyLight.light.position.set(pos.x + 35, 180, pos.z);
    });
  };

  const deleteEnities = () => {
    const length = scene.children.length;
    for (let i = 0; i < length; i++) {
      scene.children.pop();
    }
  };

  const createKeys = () => {
    if (getal1 != getal2 && getal1 != getal3 && getal2 != getal3) {
      const getallen = [getal1, getal2, getal3];
      const keyColors = [0xb7a448, 0xececec, 0xf39111];
      getallen.forEach((getal, index) => {
        new Key(getal, scene, keys, keyPositions, keyColors[index]);
      });
    } else {
      getRandomNumbers();
      createKeys();
    }
  }

  const timeEnemyMove = () => {
    moveEnemies();
    window.setTimeout(timeEnemyMove, 15000);
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

  const removeKey = (key) => {
    const takenKey = scene.getObjectByName(key.name);
    
    scene.remove(takenKey);
    addKeyToProgress();
  };

  const getRandomNumbers = () => {
    getal1 = Math.floor(Math.random() * 5);
    getal2 = Math.floor(Math.random() * 5);
    getal3 = Math.floor(Math.random() * 5);

  };

  const getRandomPlaceInMaze = () => {
    randomX = Math.floor(Math.random() * 3000 - 800);
    randomZ = Math.floor(Math.random() * 3000 - 800);
    return new THREE.Vector3(randomX, 20, randomZ);
  };

  const handleKeyDown = e => {
    // checkTestWallCollider();
    keyCollider();
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
    if (micIsOn) {
      playerLight.light.power = volume * 50;
    }
  }

  const keyCollider = () => {
    keys.forEach((key, index) => {
      const box = new THREE.Box3().setFromObject(key);
      box.name = `keyBox ${index}`;
      if (80 > box.distanceToPoint(player1.mesh.position) > 0) {
        removeKey(keys[index]);
        keys = keys.filter(key => {
          if(key != keys[index]){
            return true;
          }; 
        });
      }
    });
    renderer.render(scene, camera);
  }

  const showWinscreen = () => {
    if (camera.position.z < -950) {
      const title = document.getElementById(`endscreen-title`);
      title.textContent = `You got out!`;
      const text = document.getElementById(`endscreen-text`);
      text.textContent = `Thanks for playing!`;
      $endscreen.classList.remove(`hide`);
    }
  };

  const showDeathscreen = () => {
    const title = document.getElementById(`endscreen-title`);
    title.textContent = `They got you...`;
    const text = document.getElementById(`endscreen-text`);
    text.textContent = `Thanks for playing!`;
    $endscreen.classList.add(`deathscreen-image`);
    $endscreen.classList.remove(`hide`);
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