let activeColor = 'green';
let deactiveColor = 'grey';

window.addEventListener('load', init);

function init(){
    $('#random')[0].addEventListener('click', () =>{activateAndDeactivateIcon($('#random')[0])});
    $('#loop')[0].addEventListener('click', () =>{activateAndDeactivateIcon($('#loop')[0])});
}

function activateAndDeactivateIcon(icon){
    if(icon.style.color === activeColor){
        icon.style.color = deactiveColor;
    }else{
        icon.style.color = activeColor;
    }
}