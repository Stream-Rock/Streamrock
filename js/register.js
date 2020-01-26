window.addEventListener('load', init);

function init(){
    // $("#button")[0].addEventListener('click', ()=>{
    //     openSite('./../pages/application.pages');
    // });
    $('#cancel')[0].addEventListener('click', () =>{
        openSite('./../index.php');
    });
}

function openSite(site){
    window.open(site, '_self');
}