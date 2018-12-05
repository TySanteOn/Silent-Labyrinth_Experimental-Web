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
    camera.position.x = 100;
    camera.position.y = 160;
    camera.position.z = 20;
    // camera.rotation.x = 300;


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
    // pointLight = new THREE.PointLight(0xffffff, 1, 0, 2);
    // pointLight.position.set(playerX, 0, playerZ);
    // pointLight.castShadow = true;
    // scene.add(pointLight);

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
  }

  const loop = () => {
    requestAnimationFrame(loop);
    renderer.render(scene, camera);
  };

  init();
}