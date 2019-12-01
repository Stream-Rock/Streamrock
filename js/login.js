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
    fieldFaultPassword.textContent = "";
    fieldFaultUsername.textContent = "";
    let invalidUsername = isInvalid(fieldUserName.value, fieldUserName.dataset.name, fieldFaultUsername);
    let invalidPassword = isInvalid(fieldPassword.value, fieldPassword.dataset.name, fieldFaultPassword);


    if (!invalidUsername && !invalidPassword) {
        sendData(fieldUserName.value, fieldUserName.dataset.name, fieldFaultUsername, fieldPassword.value, fieldPassword.dataset.name, fieldFaultPassword);
    }
}

function isInvalid(valueToProof, nameOfField, faultField) {
    return isEmpty(valueToProof, nameOfField, faultField) || containsSpace(valueToProof, nameOfField, faultField);
}

function isEmpty(valueToProof, nameOfField, faultField) {
    if (valueToProof === '') {
        faultField.textContent = `${nameOfField} mustn't be blank!`;
        return true;
    }

    return false;
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

function sendData(username, usernameText, faultUserName, password, passwordText, faultPassword) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // parse response into JSON object
            let answer = JSON.parse(this.responseText);
            console.log(answer);
            if (answer === "Correct") {
                localStorage.setItem("username", username);
                window.open("./../html/application.html", "_self");
            }else if (answer === "This user does not exist!") {
                faultUserName.textContent = answer;
            }else if (answer === "Please enter the correct password!") {
                faultPassword.textContent = answer;
            }
        }
    };
    xhttp.open("POST", "./../php/login.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username=" + username + "&password=" + password);
}