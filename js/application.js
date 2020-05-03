let activeColor = 'rgb(46, 204, 113)';
let deactiveColor = 'gray';
const slider = interact('.slider');

window.addEventListener('load', init);

function init(username, profile_picture) {
    if (typeof username == "string") {
        document.getElementById("profileName").textContent = username;
        document.getElementById('profilePicture').src = profile_picture;

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

        document.getElementById('playlistAdd').addEventListener('click', addPlaylistOn);
        document.getElementById('createButton').addEventListener('click', () =>{
            addPlaylist(document.getElementById('nameOfPlaylist').value, document.getElementById('descriptionOfPlaylist').value);
        });
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
        document.getElementById('search').addEventListener('focus', () =>{
            switchResultTab('none');
        });
        document.getElementById('search').addEventListener('keyup', () => {
            getResults(document.getElementById('search').value);
        });
        document.getElementById('profilePictureToUpload').addEventListener('change', () => {
            uploadPicture(document.getElementById('profilePictureForm'));
        });
        document.getElementById('cancelCreateNewPlaylist').addEventListener('click', disableAddPlaylistBox);
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
    switchResultTab('block');
}

function switchTab(tab, pElement) {
    for (let i = 0; i < $('.tab').length; i++) {
        $('.tab')[i].style.display = 'none';
        $('.navigationP')[i].setAttribute('id', '');
    }
    document.getElementById(tab).style.display = 'block';
    pElement.setAttribute('id', 'active');
}

function addPlaylistOn() {
    $('.createNewPlaylist')[0].style.display = 'flex';
    document.getElementById('startSuggestions').style.filter = 'blur(5px)';
    document.getElementById('favorites').style.filter = 'blur(5px)';
    document.getElementById('profile').style.filter = 'blur(5px)';
}

function addPlaylist(name, description) {
    if (name === '') {
        disableAddPlaylistBox();
    }else{
        savePlaylistToDB(name, description, document.getElementById('profileName').textContent);
        disableAddPlaylistBox();
        writePlaylistsFromUser(document.getElementById('profileName').textContent);
    }
}

function disableAddPlaylistBox() {
    $('.createNewPlaylist')[0].style.display = 'none';
    document.getElementById('startSuggestions').style.filter = 'blur(0px)';
    document.getElementById('favorites').style.filter = 'blur(0px)';
    document.getElementById('profile').style.filter = 'blur(0px)';
}

function writePlaylistsFromUser(username) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let playlists = JSON.parse(this.responseText);
            deleteAllPreviousChilds(document.getElementById('playlistListing'));
            for (let i = 0; i < playlists.length; i++) {
                let playlistLi = document.createElement("li");
                let playlistp = document.createElement("p");
                playlistp.textContent = playlists[i][0];
                playlistp.setAttribute("class", "navigationLink");
                playlistLi.appendChild(playlistp);
                document.getElementById("playlistListing").appendChild(playlistLi);
            }
        }
    };
    xhttp.open("POST", "./../php/getPlaylistsFromDB.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username=" + username);
}

function deleteAllPreviousChilds(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
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

                let container = document.createElement('div');
                container.setAttribute('class', 'container');

                let overlay = document.createElement('div');
                overlay.setAttribute('class', 'overlay');

                let favorite = document.createElement('i');
                favorite.setAttribute('class', 'favorite far fa-star');

                let play = document.createElement('i');
                play.setAttribute('class', 'play far fa-play-circle');


                let more = document.createElement('i');
                more.setAttribute('class', 'moreOptions fas fa-ellipsis-h');

                overlay.appendChild(favorite);
                overlay.appendChild(play);
                overlay.appendChild(more);

                container.appendChild(image);
                container.appendChild(overlay);

                element.appendChild(container);
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

function savePlaylistToDB(name, description, username) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = this.responseText;
        }
    };
    xhttp.open("POST", "./../php/savePlaylistToDB.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("name=" + name + "&description=" + description + "&username=" + username);
}

function switchResultTab(argument) {
    if (argument === 'block') {
        document.getElementById('searchResults').style.display = 'none';
    }else{
        document.getElementById('searchResults').style.display = 'block';
    }
    document.getElementById('startSuggestions').style.display = argument;
}

function getResults(value) {
    if (value.length > 3) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                deleteAllPreviousChilds(document.getElementById('searchResultsBox'));
                let response = JSON.parse(this.responseText);
                for (let i = 0; i < response.length; i++) {
                    let divBox = document.createElement('div');
                    divBox.setAttribute('class', 'searchResult');
                    let image = document.createElement('img');
                    image.setAttribute('src', './../images/profile_picture.png');
                    image.setAttribute('alt', 'Picture');
                    let nameP = document.createElement('p');
                    nameP.textContent = response[i]["song_name"];
                    let artistP = document.createElement('p');
                    artistP.textContent = response[i]["artist"];
                    let yearP = document.createElement('p');
                    yearP.textContent = response[i]["release_year"] + "\n";

                    divBox.appendChild(image);
                    divBox.appendChild(nameP);
                    divBox.appendChild(artistP);
                    divBox.appendChild(yearP);
                    document.getElementById('searchResultsBox').appendChild(divBox);
                }
            }
        };
        xhttp.open("POST", "./../php/getSongsFromDB.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("search=" + value);
    }
}

function uploadPicture(form) {
    form.submit();
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
        const sliderWidth = interact.getElementRect(event.target.parentNode).width
        const value = event.pageX / sliderWidth
        event.target.style.paddingLeft = (value * 100) + '%'
        event.target.setAttribute('data-value', value.toFixed(2))
    })