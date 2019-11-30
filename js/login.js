window.addEventListener('load', init);

function init(){
    $("#button")[0].addEventListener('click', ()=>{
        login($("#email")[0].value, $("#password")[0].value);
    });
    $('#cancel')[0].addEventListener('click', () =>{
        openSite('./../index.html');
    });
}

function openSite(site){
    window.open(site, '_self');
}

function login(username, password) {
    if (!isInvalid(username) && !isInvalid(password)) {

    }
}

function isInvalid(valueToProof) {
    if (isEmpty(valueToProof) || containsSpace(valueToProof)) {
        return true;
    }

    return false;
}

function isEmpty(valueToProof) {
    return valueToProof === '';
}

function containsSpace(valueToProof) {
    return (countSpaces(valueToProof) !== 0);
}

function countSpaces(valueToProof) {
    let count = 0;

    for (let i = 0; i < valueToProof.length; i++) {
        if (valueToProof.charAt(i) === ' ') {
            count++;
        }
    }

    return count;
}