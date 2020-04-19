function init(username) {
    createRellax();
    for (let i = 0; i < document.getElementsByClassName('linkApplication').length; i++) {
        document.getElementsByClassName('linkApplication')[i].addEventListener('click', () => {
            openLink('./pages/application.php');
        });
    }
    document.getElementById('linkRegister').addEventListener('click', () => {
        openLink('./pages/register.php');
    });

    if (typeof username === "string") {
        seeIfUserIsLoggedIn(username);
    }
    document.getElementById('submit').addEventListener('click', () => {
        sendMail(
            document.getElementById('name').value,
            document.getElementById('faultName'),
            document.getElementById('email').value,
            document.getElementById('faultEmail'),
            document.getElementById('subject').value,
            document.getElementById('faultSubject'),
            document.getElementById('message').value,
            document.getElementById('faultMessage')
        );
    });
}

function createRellax() {
    let rellax1 = new Rellax('#shamrock', {
        speed: -5,
        center: false,
        wrapper: null,
        round: true,
        vertical: true,
        horizontal: false
    });

    let rellax2 = new Rellax('#about', {
        speed: 3,
        center: false,
        wrapper: null,
        round: true,
        vertical: true,
        horizontal: false
    });

    let rellax3 = new Rellax('#features', {
        speed: 2,
        center: false,
        wrapper: null,
        round: true,
        vertical: true,
        horizontal: false
    });

    let rellax4 = new Rellax('#stream', {
        speed: 1,
        center: false,
        wrapper: null,
        round: true,
        vertical: true,
        horizontal: false
    });

    let rellax5 = new Rellax('#register', {
        speed: 0.5,
        center: false,
        wrapper: null,
        round: true,
        vertical: true,
        horizontal: false
    });
}

function openLink(link) {
    window.open(link, '_self');
}

function seeIfUserIsLoggedIn(username) {
    if (username !== '') {
        let listElement1 = document.createElement("li");
        let listLink1 = document.createElement("a");
        listLink1.textContent = "Application";
        listLink1.href = "./pages/application.php";
        listElement1.appendChild(listLink1);
        document.getElementById("navigationList").appendChild(listElement1);
        let listElement2 = document.createElement("li");
        let listLink2 = document.createElement("a");
        listLink2.textContent = username;
        listLink2.href = "./pages/application.php";
        listElement2.appendChild(listLink2);
        document.getElementById("navigationList").appendChild(listElement2);
    } else {
        let listElement1 = document.createElement("li");
        let listLink1 = document.createElement("a");
        listLink1.textContent = "Register";
        listLink1.href = "./pages/register.php";
        listElement1.appendChild(listLink1);
        document.getElementById("navigationList").appendChild(listElement1);
        let listElement2 = document.createElement("li");
        let listLink2 = document.createElement("a");
        listLink2.textContent = "Login";
        listLink2.href = "./pages/login.php";
        listElement2.appendChild(listLink2);
        document.getElementById("navigationList").appendChild(listElement2);
    }
    //TODO: Make a function to prevent code duplication
}

function sendMail(name, faultName, mail, faultMail, subject, faultSubject, message, faultMessage) {
    let nameIsCorrect = notBlank(name, faultName, "Name") && correctName(name, faultName);
    let mailIsCorrect = notBlank(mail, faultMail, "Email") && correctMail(mail, faultMail);
    let subjectIsCorrect = notBlank(subject, faultSubject, "Subject") && notTooLong(subject, faultSubject, 78, "Subject");
    let messageIsCorrect = notBlank(message, faultMessage, "Message") && notTooLong(message, faultMessage, 998, "Message");
}

function notBlank(value, faultField, fieldName) {
    let patt = /./gm;
    let result = patt.test(value);
    if (!result) {
        faultField.textContent = `${fieldName} must not be blank!`;
    } else{
        faultField.textContent = '';
    }

    return result;
}

function correctName(name, faultField) {
    let patt = /^[A-Za-z]+ +[A-Za-z]/gm;
    let result = patt.test(name);
    if (!result) {
        faultField.textContent = 'Please enter a correct first and last name!';
    } else{
        faultField.textContent = '';
    }

    return result;
}

function correctMail(mail, faultField) {
    let patt = /\S+@\S+\.\S+/gm;
    let result = patt.test(mail);

    if (!result) {
        faultField.textContent = 'Please enter a correct email e.g. yourname@mail.com!';
    } else{
        faultField.textContent = '';
    }

    return result;
}

function notTooLong(value, faultField, limit, fieldName) {
    let result = value.length < limit;

    if (!result) {
        faultField.textContent = `${fieldName} must not be longer than ${limit} characters!`
    } else{
        faultField.textContent = '';
    }

    return result;
}