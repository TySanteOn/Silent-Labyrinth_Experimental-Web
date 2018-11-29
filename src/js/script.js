import Cube from './classes/Cube.js';
import Sphere from './classes/Sphere.js';

{

  let scene,
    WIDTH, HEIGHT,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane, renderer, container,
    startX, startY, pointLight;

  let hemisphereLight, ambientLight;

  const init = () => {
    createScene();
    createCamera();
    createLight();
    createPulseLight();
    createObject();

    getMicVolume();

    document.addEventListener('keydown', handleKeyPress);
    // editLightPower();
    loop();
  };

  const createObject = () => {
    const xDistance = 400;

    const object = new Cube(4);
    object.mesh.position.y = 0;
    object.mesh.position.x = -xDistance;
    object.mesh.position.z = 0;
    scene.add(object.mesh);

    const object2 = new Cube(4);
    object2.mesh.position.y = 0;
    object2.mesh.position.x = xDistance;
    object2.mesh.position.z = 0;
    scene.add(object2.mesh);

    const objectTest = new Cube(1);
    objectTest.mesh.position.y = 0;
    objectTest.mesh.position.x = 0;
    objectTest.mesh.position.z = 0;
    // scene.add(objectTest.mesh);
  };

  const createPulseLight = () => {
    const xPos = 0;
    const yPos = 200;
    const zPos = 0;

    const object = new Sphere();
    object.mesh.position.y = yPos;
    object.mesh.position.x = xPos - 50;
    object.mesh.position.z = zPos;
    // scene.add(object.mesh);

    pointLight = new THREE.PointLight(0xffffff, 1, 0, 2);
    pointLight.position.set(xPos, yPos, zPos);
    pointLight.castShadow = true;
    // pointLight.power = 10;
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

    camera.position.x = 0;
    camera.position.z = 1500;
    camera.position.y = 600;
    camera.rotation.x = -20 * Math.PI / 180;


    camera.lookAt(new THREE.Vector3(0, 1, 0));

    
    renderer.domElement.addEventListener('mousedown', (e, renderer, camera) => downClbk(e, renderer, camera));
    renderer.domElement.addEventListener('mouseup', (e, renderer, camera) => upClbk(e, renderer, camera));
  }

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

  const createScene = () => {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    container = document.getElementById(`world`);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', handleWindowResize, false);
  };

  const createLight = () => {

    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 1);

    ambientLight = new THREE.AmbientLight(0xdc8874, .4);

    scene.add(hemisphereLight);
    // scene.add(ambientLight);
  };

  const sendPulse = () => {
    // console.log("pulse");
    // console.log(scene.children[0].intensity);
    
    // scene.children[0].intensity = -scene.children[0].intensity;
  };

  const handleWindowResize = () => {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
  };

  const handleKeyPress = e => {
    switch (e.key) {
      case 'ArrowUp':
        camera.position.z -= 10;
        break;
    case 'ArrowDown':
      camera.position.z += 10;
      break;
    case 'ArrowLeft':
      camera.rotation.y += 5 * Math.PI / 180;
      break;
    case 'ArrowRight':
      camera.rotation.y -= 5 * Math.PI / 180;
      break;
    }
    
  };

  const editLightPower = () => {
    pointLight.power = volume * 100
  }

  const loop = () => {
    requestAnimationFrame(loop);
    editLightPower();

    renderer.render(scene, camera);
  };

  init();
}