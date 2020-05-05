let activeColor = 'rgb(46, 204, 113)';
let deactiveColor = 'gray';
let amountSongs = 0;
let defaultPicture = './../images/profile_picture.png';
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
                switchTab($('.link')[i].dataset.tab, $('.navigationP')[i]);
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
            //getArtists(document.getElementById('search').value);
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
    hideTabs();
    document.getElementById(tab).style.display = 'block';
    pElement.setAttribute('id', 'active');
}

function addPlaylistOn() {
    $('.createNewPlaylist')[0].style.display = 'flex';
    document.getElementById('startSuggestions').style.filter = 'blur(5px)';
    document.getElementById('favorites').style.filter = 'blur(5px)';
    document.getElementById('profile').style.filter = 'blur(5px)';
    document.getElementById('playlistBox').style.filter = 'blur(5px)';
    document.getElementById('searchResults').style.filter = 'blur(5px)';
    document.getElementById('artistBox').style.filter = 'blur(5px)';


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
    document.getElementById('playlistBox').style.filter = 'blur(0px)';
    document.getElementById('searchResults').style.filter = 'blur(0px)';
    document.getElementById('artistBox').style.filter = 'blur(0px)';

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
                playlistp.setAttribute('data-name', playlists[i][0]);
                playlistp.setAttribute('data-username', playlists[i][1]);
                playlistp.setAttribute('data-description', playlists[i][2]);
                playlistp.setAttribute('data-playlist_picture', playlists[i][3]);
                playlistLi.appendChild(playlistp);
                document.getElementById("playlistListing").appendChild(playlistLi);
            }

            for (let i = 0; i < document.getElementsByClassName('navigationLink').length; i++) {
                document.getElementsByClassName('navigationLink')[i].addEventListener('click', () => {
                    showPlaylist(
                        document.getElementsByClassName('navigationLink')[i].getAttribute('data-name'),
                        document.getElementsByClassName('navigationLink')[i].getAttribute('data-username'),
                        document.getElementsByClassName('navigationLink')[i].getAttribute('data-description'),
                        document.getElementsByClassName('navigationLink')[i].getAttribute('data-playlist_picture'));
                });
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
    hideTabs();

    if (argument === 'block') {
        document.getElementById('searchResults').style.display = 'none';
    } else {
        document.getElementById('searchResults').style.display = 'block';
    }
}

function getResults(value) {
    if (value.length > 3) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                deleteAllPreviousChilds(document.getElementById('searchResultsBox'));
                let response = JSON.parse(this.responseText);

                let divBoxForSongResults = document.createElement('div');
                divBoxForSongResults.setAttribute('id', 'songResults');
                let table = document.createElement('table');
                table.setAttribute('class', 'songResultsTable');
                for (let i = 0; i < response.length; i++) {
                    if (i === 0) {
                        let tableRow1 = document.createElement('tr');
                        let placeholder = document.createElement('th');
                        let songName = document.createElement('th');
                        songName.textContent = 'Title';
                        let songArtist = document.createElement('th');
                        songArtist.textContent = 'Artist';
                        let releaseYear = document.createElement('th');
                        releaseYear.textContent = 'Release year';
                        tableRow1.appendChild(placeholder);
                        tableRow1.appendChild(songName);
                        tableRow1.appendChild(songArtist);
                        tableRow1.appendChild(releaseYear);
                        table.appendChild(tableRow1);
                    }

                    table.appendChild(createTableRow(response[i]["song_name"], response[i]["artist"], response[i]["release_year"]));
                }
                divBoxForSongResults.appendChild(table);
                document.getElementById('searchResultsBox').appendChild(divBoxForSongResults);
            }
        };
        xhttp.open("POST", "./../php/getSongsFromDB.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("search=" + value);
    }
}

function getArtists(value) {
    if (value.length > 3) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.responseText);
                let divBoxForArtistResults = document.createElement('div');
                divBoxForArtistResults.setAttribute('id', 'artistResults');
                for (let i = 0; i < response.length; i++) {

                    let element = document.createElement('div');
                    element.setAttribute('class', 'recentlyPlayedElement');

                    let image = document.createElement('img');
                    image.setAttribute('src', './../images/profile_picture.png');
                    image.setAttribute('alt', 'Image');

                    let artist = document.createElement('p');
                    artist.textContent = response[i]['artist'];

                    element.appendChild(image);
                    element.appendChild(artist);
                    divBoxForArtistResults.appendChild(element);
                }
                document.getElementById('searchResultsBox').appendChild(divBoxForArtistResults);
            }
        };
        xhttp.open("POST", "./../php/getArtistsFromDB.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("search=" + value);
    }
}

function uploadPicture(form) {
    form.submit();
}

function showPlaylist(playlistName, playlistUsername, playlistDescription, playlistPicture) {
    hideTabs();

    document.getElementById('playlistName').textContent = playlistName;
    document.getElementById('playlistDescription').textContent = playlistDescription;
    document.getElementById('playlistUsername').textContent = `Made by ${playlistUsername} ${amountSongs} Songs`;

    document.getElementById('playlistBox').style.display = 'block';

    if (playlistPicture === '' || playlistPicture === null || playlistPicture === 'NULL') {
        document.getElementById('playlistPicture').src = defaultPicture;
    } else {
        document.getElementById('playlistPicture').src = playlistPicture;
    }
}

function hideTabs() {
    for (let i = 0; i < document.getElementsByClassName('tab').length; i++) {
        document.getElementsByClassName('tab')[i].style.display = 'none';
        document.getElementsByClassName('navigationP')[i].setAttribute('id', '');
    }
    document.getElementById('searchResults').style.display = 'none';
    document.getElementById('playlistBox').style.display = 'none';
    document.getElementById('artistBox').style.display = 'none';
}

function openArtistPage(artist) {
    hideTabs();
    document.getElementById('artistName').textContent = artist;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            deleteAllPreviousChilds(document.getElementById('artistResults'));
            let response = JSON.parse(this.responseText);
            let divBoxForSongResults = document.createElement('div');
            divBoxForSongResults.setAttribute('id', 'artistsSongResults');
            let table = document.createElement('table');
            table.setAttribute('class', 'songResultsTable');
            for (let i = 0; i < response.length; i++) {
                if (i === 0) {
                    let tableRow1 = document.createElement('tr');
                    let placeholder = document.createElement('th');
                    let songName = document.createElement('th');
                    songName.textContent = 'Title';
                    let songArtist = document.createElement('th');
                    songArtist.textContent = 'Artist';
                    let releaseYear = document.createElement('th');
                    releaseYear.textContent = 'Release year';
                    tableRow1.appendChild(placeholder);
                    tableRow1.appendChild(songName);
                    tableRow1.appendChild(songArtist);
                    tableRow1.appendChild(releaseYear);
                    table.appendChild(tableRow1);
                }

                table.appendChild(createTableRow(response[i]["song_name"], response[i]["artist"], response[i]["release_year"]));
            }
            divBoxForSongResults.appendChild(table);
            document.getElementById('artistResults').appendChild(divBoxForSongResults);
        }
        document.getElementById('artistBox').style.display = 'block';
    };
    xhttp.open("POST", "./../php/getSongsFromArtist.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("artist=" + artist);
}

function createTableRow(songName, artist, releaseYear) {
    let tableRow = document.createElement('tr');

    let iconRow = document.createElement('td');
    let span = document.createElement('span');
    let icon = document.createElement('i');
    icon.setAttribute('class', 'tableIcon far fa-play-circle');
    let icon2 = document.createElement('i');
    icon2.setAttribute('class', 'far fa-star');

    span.appendChild(icon);
    iconRow.appendChild(span);
    iconRow.appendChild(icon2);

    let songRow = document.createElement('td');
    songRow.textContent = songName;

    let artistRow = document.createElement('td');
    artistRow.textContent = artist;
    artistRow.setAttribute('class', 'artistRow');

    let releaseRow = document.createElement('td');
    releaseRow.textContent = releaseYear !== '0' ? releaseYear : '-';

    tableRow.setAttribute('data-songName', songName);
    tableRow.setAttribute('data-artist', artist);
    tableRow.setAttribute('data-releaseYear', releaseYear);
    tableRow.appendChild(iconRow);
    tableRow.appendChild(songRow);
    tableRow.appendChild(artistRow);
    tableRow.appendChild(releaseRow);

    artistRow.addEventListener('click', () => {
        openArtistPage(tableRow.getAttribute('data-artist'));
    });

    return tableRow;
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
    });
