window.addEventListener('load', init);

function init(){
    createRellax();
    for (let i = 0; i < document.getElementsByClassName('linkApplication').length; i++) {
      document.getElementsByClassName('linkApplication')[i].addEventListener('click', ()=>{
        openLink('./html/application.html');
      });
    }
    document.getElementById('linkRegister').addEventListener('click', ()=>{
      openLink('./html/register.html');
    });
}

function createRellax(){
  let rellax1 = new Rellax('#shamrock', {
    speed: -5,
    center: false,
    wrapper: null,
    round: true,
    vertical: true,
    horizontal: false
  });

  let rellax2 = new Rellax('#about', {
    speed: 3,
    center: false,
    wrapper: null,
    round: true,
    vertical: true,
    horizontal: false
  });

  let rellax3 = new Rellax('#features', {
    speed: 2,
    center: false,
    wrapper: null,
    round: true,
    vertical: true,
    horizontal: false
  });

  let rellax4 = new Rellax('#stream', {
    speed: 1,
    center: false,
    wrapper: null,
    round: true,
    vertical: true,
    horizontal: false
  });

  let rellax5 = new Rellax('#register', {
    speed: 0.5,
    center: false,
    wrapper: null,
    round: true,
    vertical: true,
    horizontal: false
  });
}

function openLink(link){
  window.open(link, '_self');
}