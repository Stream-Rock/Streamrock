window.addEventListener('load', init);

function init(){
    document.getElementById('cancel').addEventListener('click', () =>{
        openSite('./../index.php');
    });
    document.getElementById('buttonRegister').addEventListener('click', () =>{
        checkRegister(document.getElementById('username').value, document.getElementById('password').value, document.getElementById('password2').value);
    })
}

function openSite(site){
    window.open(site, '_self');
}

function checkRegister(username, password, password2) {
    if (username !== '' && password !== '' && password2 !== '') {
        if (!userExists(username) && passwordsAreTheSame(password, password2) && passwordCorrect(password)) {
            let result = doAjax(username, password, "./../php/saveAccountToDB.php");
        }
    }else{
        document.getElementById("faultpassword2").textContent = 'Please make sure every field is set';
    }
}

function userExists(username) {
    return false;
}

function passwordsAreTheSame(password1, password2) {
    if (password1 !== password2) {
        document.getElementById('faultpassword2').textContent = 'Please make sure your Passwords match';
        return false;
    }else{
        document.getElementById('faultpassword2').textContent = '';
    }
    return true;
}

function passwordCorrect(password) {
    console.log(password.length);
    if (password.length >= 8) {
        document.getElementById('faultpassword').textContent = '';
        return true;
    }else{
        document.getElementById('faultpassword').textContent = 'Please make sure the password is at least 8 characters long';
    }
    return false;
}

function doAjax(username, password, url) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            return JSON.parse(this.responseText);
        }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username=" + username + "&password=" + password);
}