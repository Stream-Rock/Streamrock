window.addEventListener('load', init);

function init() {
    if (!window.location.hash) {
        window.location = window.location + '#loaded';
        window.location.reload();
    }
    createRellax();
    for (let i = 0; i < document.getElementsByClassName('linkApplication').length; i++) {
        document.getElementsByClassName('linkApplication')[i].addEventListener('click', () => {
            openLink('./pages/application.html');
        });
    }
    document.getElementById('linkRegister').addEventListener('click', () => {
        openLink('./pages/register.html');
    });
    seeIfUserIsLoggedIn();
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

function seeIfUserIsLoggedIn() {
    if (localStorage.getItem("username") !== null && localStorage.getItem("username") !== '') {
        let listElement1 = document.createElement("li");
        let listLink1 = document.createElement("a");
        listLink1.textContent = "Application";
        listLink1.href = "./pages/application.html";
        listElement1.appendChild(listLink1);
        document.getElementById("navigationList").appendChild(listElement1);
        let listElement2 = document.createElement("li");
        let listLink2 = document.createElement("a");
        listLink2.textContent = localStorage.getItem("username");
        listLink2.href = "./pages/application.html";
        listElement2.appendChild(listLink2);
        document.getElementById("navigationList").appendChild(listElement2);
    } else {
        let listElement1 = document.createElement("li");
        let listLink1 = document.createElement("a");
        listLink1.textContent = "Register";
        listLink1.href = "./pages/register.html";
        listElement1.appendChild(listLink1);
        document.getElementById("navigationList").appendChild(listElement1);
        let listElement2 = document.createElement("li");
        let listLink2 = document.createElement("a");
        listLink2.textContent = "Login";
        listLink2.href = "./pages/login.html";
        listElement2.appendChild(listLink2);
        document.getElementById("navigationList").appendChild(listElement2);
    }
}
