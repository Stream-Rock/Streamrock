let activeColor = 'green';
let deactiveColor = 'grey';

window.addEventListener('load', init);

function init(){
    $('#random')[0].addEventListener('click', () =>{activateAndDeactivateIcon($('#random')[0])});
    $('#loop')[0].addEventListener('click', () =>{activateAndDeactivateIcon($('#loop')[0])});
    $('#logo')[0].addEventListener('click', openHomePage);
    $('#pause')[0].addEventListener('click', () =>{changeIcon($('#pause')[0], 'far fa-play-circle', 'far fa-pause-circle')});
    $('#star')[0].addEventListener('click', () =>{changeIcon($('#star')[0], 'fas fa-star', 'far fa-star')})
    $('#search')[0].addEventListener('focus', () =>{changeDeleteCrossVisibility(true)});
    $('#search')[0].addEventListener('blur', () =>{changeDeleteCrossVisibility(false)})
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

function changeIcon(icon, newIconClassName, oldIconClassName){
    if(icon.className === newIconClassName){
        icon.className = oldIconClassName;
    }else{
        icon.className = newIconClassName;
    }
}

function changeDeleteCrossVisibility(shouldBeSeen){
    if(shouldBeSeen){
        $('#cancel')[0].style.display = 'block';
    }else{
        $('#cancel')[0].style.display = 'none';
    }
}