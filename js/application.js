let activeColor = 'green';
let deactiveColor = 'grey';
const slider = interact('.slider');

window.addEventListener('load', init);

function init(){
    $('#random')[0].addEventListener('click', () =>{activateAndDeactivateIcon($('#random')[0])});
    $('#loop')[0].addEventListener('click', () =>{activateAndDeactivateIcon($('#loop')[0])});
    $('#logo')[0].addEventListener('click', openHomePage);
    $('#pause')[0].addEventListener('click', () =>{changeIcon($('#pause')[0], 'far fa-play-circle', 'far fa-pause-circle')});
    $('#star')[0].addEventListener('click', () =>{changeIcon($('#star')[0], 'fas fa-star', 'far fa-star')})
    $('#search')[0].addEventListener('focus', () =>{changeDeleteCrossVisibility(true)});
    $('#search')[0].addEventListener('blur', () =>{changeDeleteCrossVisibility(false)})
    $('#cancel')[0].addEventListener('mouseover', deleteText);
    
    for (let i = 0; i < $('.link').length; i++) {
        $('.link')[i].addEventListener('click', ()=>{switchTab($('.link')[i].dataset.tab)});
    }
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

function deleteText(){
    $('#search')[0].value = ''; 
}

function switchTab(tab){
    for (let i = 0; i < $('.tab').length; i++) {
        $('.tab')[i].style.display = 'none';
    }
    document.getElementById(tab).style.display = 'block';
}

slider
  .draggable({                        
    origin: 'self',                   
    inertia: true,                    
    modifiers: [
      interact.modifiers.restrict({
        restriction: 'self'            
      })
    ]
  })
  .on('dragmove', function (event) {  
    const sliderWidth = interact.getElementRect(event.target.parentNode).width
    const value = event.pageX / sliderWidth
    event.target.style.paddingLeft = (value * 100) + '%'
    event.target.setAttribute('data-value', value.toFixed(2))
  })