let startX, startY;

const downClbk = (e) => {
  renderer.domElement.addEventListener('mousemove', moveClbk);
  startX = e.clientX;
  startY = e.clientY;
}

const upClbk = (e) => {
  renderer.domElement.removeEventListener('mousemove', moveClbk);
}

const moveClbk = (e) => {
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