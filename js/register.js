window.addEventListener('load', init);

function init(){
    // $("#button")[0].addEventListener('click', ()=>{
    //     openSite('./../html/application.html');
    // });
    $('#cancel')[0].addEventListener('click', () =>{
        openSite('./../index.html');
    });
}

function openSite(site){
    window.open(site, '_self');
}