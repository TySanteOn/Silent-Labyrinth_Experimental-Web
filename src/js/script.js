import Object from './classes/Object.js';

{

  let scene,
    WIDTH, HEIGHT,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane, renderer, container;

  let hemisphereLight, ambientLight;

  const init = () => {
    createScene();
    createLight();
    createObject();
    
    loop(); //start render loop
  };

  const createObject = () => {
    const object = new Object
    object.mesh.position.y = 0;
    object.mesh.position.x = 0;
    scene.add(object.mesh);

  }

  const createScene = () => {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    scene = new THREE.Scene();

    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 10000;

    camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    camera.position.x = 0;
    camera.position.z = 1000;
    camera.position.y = 100;

    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });

    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    container = document.getElementById(`world`);
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', handleWindowResize, false);
  }

  const createLight = () => {

    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

    ambientLight = new THREE.AmbientLight(0xdc8874, .4);

    scene.add(hemisphereLight);
    scene.add(ambientLight);
  };

  const handleWindowResize = () => {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
  }

  const loop = () => {
    requestAnimationFrame(loop);

    renderer.render(scene, camera);
  };

  init();
}