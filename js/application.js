let activeColor = 'green';
let deactiveColor = 'grey';

window.addEventListener('load', init);

function init(){
    $('#random')[0].addEventListener('click', () =>{activateAndDeactivateIcon($('#random')[0])});
    $('#loop')[0].addEventListener('click', () =>{activateAndDeactivateIcon($('#loop')[0])});
    $('#logo')[0].addEventListener('click', openHomePage);
}

function activateAndDeactivateIcon(icon){
    if(icon.style.color === activeColor){
        icon.style.color = deactiveColor;
    }else{
        icon.style.color = activeColor;
    }
}

function openHomePage(){
    window.open('./../index.html', '_self');
}