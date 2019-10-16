window.addEventListener('load', init);

function init(){
    $("#button")[0].addEventListener('click', openSite);
}

function openSite(){
    window.open('./../html/application.html', '_self');
}