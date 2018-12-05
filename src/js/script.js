import Player from './classes/Player.js';
//import Maze from './classes/Maze.js';

{
  let loader,
    scene,
    startX,
    startY,
    player,
    maze,
    WIDTH,
    HEIGHT,
    camera,
    fieldOfView,
    aspectRatio,
    renderer,
    container;

  let hemisphereLight,
    shadowLight,
    pointLight;

  let playerX,
    playerY,
    playerZ;

  const init = () => {
    createScene();
    createLight();
    loadMaze();
    createPlayer();
    loop(); //start render loop

    document.addEventListener('keydown', handleKeyDown);
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
    camera.position.x = 200;
    camera.position.y = 1000;
    camera.position.z = 200;
    camera.rotation.x = 300;


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
    pointLight = new THREE.PointLight(0xffffff, 1, 0, 2);
    pointLight.position.set(playerX, 0, playerZ);
    pointLight.castShadow = true;
    scene.add(pointLight);

    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 1);
    scene.add(hemisphereLight);

    // shadowLight = new THREE.DirectionalLight(0xffffff, .9);
    // scene.add(shadowLight);
  }

  const loadMaze = () => {
    const loader = new THREE.ObjectLoader();
    loader.load('data/maze-floor.dae.json', object => {
      scene.add(object);
    });
  };

  const createPlayer = () => {
    player = new Player();
    //l&r
    player.mesh.position.x = 80;
    //voor&achter
    player.mesh.position.z = 10;
    //hoogte
    player.mesh.position.y = 160;
    scene.add(player.mesh);

  }

  const handleKeyDown = e => {
    let vector = camera.getWorldDirection();
    const angle = THREE.Math.radToDeg(Math.atan2(vector.x, vector.z));
    console.log(angle);

    if (e.keyCode === 37) {
      player.mesh.position.x -= 10;
      console.log(player.mesh.position.x);
      playerX = player.mesh.position.x;
    }
    if (e.keyCode === 39) {
      player.mesh.position.x += 10;
      playerX = player.mesh.position.x;
    }
    if (e.keyCode === 38) {
      player.mesh.position.z -= 10;
      playerY = player.mesh.position.y;
    }
    if (e.keyCode === 40) {
      player.mesh.position.z += 10;
      playerY = player.mesh.position.y;
    }

    if (e.keyCode === 37) {
      camera.position.x -= 10;
    }
    if (e.keyCode === 39) {
      camera.position.x += 10;
    }
    if (e.keyCode === 38) {
      camera.position.z -= 10;
    }
    if (e.keyCode === 40) {
      camera.position.z += 10;
    }
  }

  const loop = () => {
    requestAnimationFrame(loop);
    renderer.render(scene, camera);
  };

  init();
}