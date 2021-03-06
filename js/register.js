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
        if (!userExists(username)) {
            if (passwordsAreTheSame(password, password2) && passwordCorrect(password)) {
                let xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState === 4 && this.status === 200) {
                        let response = this.responseText;
                        if (allFieldsClear(document.getElementById('faultusername').textContent, document.getElementById('faultpassword').textContent, document.getElementById('faultpassword2').textContent)) {
                            openSite('./../pages/application.php');
                        }
                    }
                };
                xhttp.open("POST", "./../php/saveAccountToDB.php", true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send("username=" + username + "&password=" + password);
            }
        }
    }else{
        document.getElementById("faultpassword2").textContent = 'Please make sure every field is set';
    }
}

function userExists(username) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            let response = JSON.parse(this.responseText);
            if (response.length !== 0) {
                document.getElementById('faultusername').textContent = 'This user already exists';
                return true;
            }else{
                document.getElementById('faultusername').textContent = '';
                return false;

            }
        }
    };
    xhttp.open("POST", "./../php/checkIfUserExists.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username=" + username);
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
    if (password.length >= 8) {
        document.getElementById('faultpassword').textContent = '';
        return true;
    }else{
        document.getElementById('faultpassword').textContent = 'Please make sure the password is at least 8 characters long';
    }
    return false;
}

function allFieldsClear(field1, field2, field3) {
    return field1 === '' && field2 === '' && field3 === '';
}