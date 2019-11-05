window.addEventListener('load', init);

function init(){
    createRellax();
}

function createRellax(){
  let rellax = new Rellax('#shamrock', {
    speed: -5,
    center: false,
    wrapper: null,
    round: true,
    vertical: true,
    horizontal: false
  });
  
}