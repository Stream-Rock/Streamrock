window.addEventListener('load', init);

function init(){
    $("#button")[0].addEventListener('click', ()=>{
        login($("#username")[0], $("#faultusername")[0], $("#password")[0], $("#faultpassword")[0]);
    });
    $('#cancel')[0].addEventListener('click', () =>{
        openSite('./../index.html');
    });
}

function openSite(site){
    window.open(site, '_self');
}

function login(fieldUserName, fieldFaultUsername, fieldPassword, fieldFaultPassword) {
    let invalidUsername = isInvalid(fieldUserName.value, fieldUserName.dataset.name, fieldFaultUsername);
    let invalidPassword = isInvalid(fieldPassword.value, fieldPassword.dataset.name, fieldFaultPassword);

    if (!invalidUsername && !invalidPassword) {

    }
}

function isInvalid(valueToProof, nameOfField, faultField) {
    return isEmpty(valueToProof, nameOfField, faultField) || containsSpace(valueToProof, nameOfField, faultField);
}

function isEmpty(valueToProof, nameOfField, faultField) {
    faultField.textContent = `${nameOfField} mustn't be blank!`;
    return valueToProof === '';
}

function containsSpace(valueToProof, nameOfField, faultField) {
    if (countSpaces(valueToProof) !== 0) {
        faultField.textContent = `${nameOfField}  mustn't contain spaces!`;
        return true;
    }
    return false;
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