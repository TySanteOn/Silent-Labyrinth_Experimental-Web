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


  const init = () => {
    
    createScene();
    createCamera();
    loadMaze();

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

  const loop = () => {
    requestAnimationFrame(loop);
    editLightPower();
    renderer.render(scene, camera);
  };

  const loadMaze = () => {
    loader = new THREE.ObjectLoader();
    loader.load('data/maze-floor.dae.json', object => {
      object.children.forEach(child => {
        child.castShadow = true;
        child.receiveShadow = true;
      });
      scene.add(object);
    });
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

    pointLight.position.set(playerX, playerY, playerZ);
    player1.mesh.position.set(playerX - 50, playerY, playerZ);
    

    renderer.render(scene, camera);
  }

  const editLightPower = () => {
    if (micIsOn){
      pointLight.power = volume * 40;
    }
  }

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