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
  let rellax = new Rellax('#shamrock', {
    speed: -5,
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