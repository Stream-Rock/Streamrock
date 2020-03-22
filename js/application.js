let activeColor = 'rgb(46, 204, 113)';
let deactiveColor = 'gray';
const slider = interact('.slider');

window.addEventListener('load', init);

function init(username) {
    if (typeof username == "string") {
        document.getElementById("profileName").textContent = username;

        document.getElementById('random').addEventListener('click', () => {
            activateAndDeactivateIcon(document.getElementById('random'))
        });
        document.getElementById('loop').addEventListener('click', () => {
            activateAndDeactivateIcon(document.getElementById('loop'))
        });
        document.getElementById('logo').addEventListener('click', openHomePage);
        document.getElementById('pause').addEventListener('click', () => {
            changeIcon(document.getElementById('pause'), 'far fa-play-circle', 'far fa-pause-circle')
        });
        document.getElementById('star').addEventListener('click', () => {
            changeIcon(document.getElementById('star'), 'fas fa-star', 'far fa-star')
        });
        document.getElementById('search').addEventListener('focus', () => {
            changeDeleteCrossVisibility(true)
        });
        document.getElementById('search').addEventListener('blur', () => {
            changeDeleteCrossVisibility(false)
        });
        document.getElementById('cancel').addEventListener('mouseover', deleteText);

        for (let i = 0; i < $('.link').length; i++) {
            $('.link')[i].addEventListener('click', () => {
                switchTab($('.link')[i].dataset.tab, $('.navigationP')[i])
            });
        }

        $('#playlistAdd')[0].addEventListener('click', addPlaylistOn);
        $('#createButton')[0].addEventListener('click', addPlaylist);
        writePlaylistsFromUser(username);
        writeData("./../csv/recentlyPlayed.csv", "recentlyPlayedElement", "recentlyPlayed", username);
        writeData("./../csv/artists.csv", "recentlyPlayedElement", "artists", username);
        writeData("./../csv/favoritesongs.csv", "favoriteElement", "favoriteSongs", username);
        writeData("./../csv/favoritealbums.csv", "favoriteElement", "favoriteAlbums", username);

        document.getElementById('logoutButton').addEventListener('click', logout);
        document.getElementById('deleteAccountButton').addEventListener('click', () =>{
            showWarning('block');
        });
        document.getElementById('cancelButton').addEventListener('click', () => {
            showWarning('none');
        });
        document.getElementById('sureButton').addEventListener('click', () =>{
            deleteAccount(document.getElementById('profileName').textContent);
        });
    }
}

function activateAndDeactivateIcon(icon) {
    if (icon.style.color === activeColor) {
        icon.style.color = deactiveColor;
    } else {
        icon.style.color = activeColor;
    }
}

function openHomePage() {
    window.open('./../index.php', '_self');
}

function changeIcon(icon, newIconClassName, oldIconClassName) {
    if (icon.className === newIconClassName) {
        icon.className = oldIconClassName;
    } else {
        icon.className = newIconClassName;
    }
}

function changeDeleteCrossVisibility(shouldBeSeen) {
    if (shouldBeSeen) {
        $('#cancel')[0].style.display = 'block';
    } else {
        $('#cancel')[0].style.display = 'none';
    }
}

function deleteText() {
    $('#search')[0].value = '';
}

function switchTab(tab, pElement) {
    for (let i = 0; i < $('.tab').length; i++) {
        $('.tab')[i].style.display = 'none';
        $('.navigationP')[i].setAttribute('id', '');
    }
    document.getElementById(tab).style.display = 'block';
    pElement.setAttribute('id', 'active');
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
        const sliderWidth = interact.getElementRect(event.target.parentNode).width;
        const value = event.pageX / sliderWidth;
        event.target.style.paddingLeft = (value * 100) + '%';
        event.target.setAttribute('data-value', value.toFixed(2));
    });

function addPlaylistOn() {
    $('.createNewPlaylist')[0].style.display = 'flex';
    $('#startSuggestions')[0].style.filter = 'blur(5px)';
}

function addPlaylist() {
    $('.createNewPlaylist')[0].style.display = 'none';
    $('#startSuggestions')[0].style.filter = 'blur(0px)';
    document.getElementById('favorites').style.filter = 'blur(0px)';
    document.getElementById('profile').style.filter = 'blur(0px)';
}

function writePlaylistsFromUser(username) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let playlists = JSON.parse(this.responseText);
            for (let i = 0; i < playlists.length; i++) {
                let playlistLi = document.createElement("li");
                let playlistp = document.createElement("p");
                playlistp.textContent = playlists[i];
                playlistp.setAttribute("class", "navigationLink");
                playlistLi.appendChild(playlistp);
                document.getElementById("playlistListing").appendChild(playlistLi);
            }
        }
    };
    xhttp.open("POST", "./../php/getPlaylists.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username=" + username);
}

function writeData(filename, className, idToPutTo, username) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            for (let i = 0; i < data.length; i++) {
                let element = document.createElement('div');
                element.setAttribute('class', className);
                let image = document.createElement('img');
                image.setAttribute('src', './../images/' + data[i]['picture']);
                image.setAttribute('alt', 'Image');
                let name = document.createElement('p');
                name.textContent = data[i]['title'];
                let artist = document.createElement('p');
                artist.textContent = data[i]['artist'];
                element.appendChild(image);
                element.appendChild(name);
                element.appendChild(artist);
                document.getElementById(idToPutTo).appendChild(element);
            }
        }
    };
    xhttp.open("POST", "./../php/getData.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username=" + username + "&filename=" + filename);
}

function logout() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "./../php/logOut.php", false);
    xhttp.send();
    location.replace("../index.php");
}

function showWarning(argument) {
    document.getElementById('sureText').style.display = argument;
    document.getElementById('sureButton').style.display = argument;
    document.getElementById('cancelButton').style.display = argument;
}

function deleteAccount(username) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = this.responseText;
            if (response === 'User has been deleted') {
                window.open('./../index.php');
            }
        }
    };
    xhttp.open("POST", "./../php/deleteCurrentUser.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username=" + username);
}