{

  const init = () => {
    
    loop(); //start render loop
  };


  const loop = () => {
    requestAnimationFrame(loop);

    // renderer.render(scene, camera);
  };

  init();
}