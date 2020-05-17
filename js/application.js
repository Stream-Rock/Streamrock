let activeColor = 'rgb(46, 204, 113)';
let deactiveColor = 'gray';
let amountSongs = 0;
let defaultPicture = './../images/profile_picture.png';
let defaultPlaylistPicture = './../images/playlist_picture.png';
let musicPrefix = './../music/';
let defaultSong = 'Rick Astley - Never Gonna Give You Up.mp3';
const volumeSlider = interact('#volumeBar');
let songSlider = interact('#songBar');
let loop = false;
let songVolume = 0.1;
let activeSong;

window.addEventListener('load', init);

function init(username, profile_picture) {
    if (typeof username == "string") {
        document.getElementById("profileName").textContent = username;
        document.getElementById('profilePicture').src = profile_picture;

        document.getElementById('loop').addEventListener('click', () => {
            switchLoop(document.getElementById('loop'));
        });
        document.getElementById('logo').addEventListener('click', openHomePage);
        document.getElementById('pause').addEventListener('click', () => {
            switchPausePlay(document.getElementById('pause'), 'far fa-play-circle', 'far fa-pause-circle')
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

        document.getElementById('playlistAdd').addEventListener('click', () => {
            addPlaylistOn(document.getElementById('createNewPlaylistBox'));
        });
        document.getElementById('createButton').addEventListener('click', () =>{
            addPlaylist(document.getElementById('nameOfPlaylist').value, document.getElementById('descriptionOfPlaylist').value);
        });
        writePlaylistsFromUser(username);

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
        document.getElementById('cancelCreateNewPlaylist').addEventListener('click', () => {
            disableAddPlaylistBox(document.getElementById('createNewPlaylistBox'))
        });
        document.getElementById('cancelSelectAddToPlaylist').addEventListener('click', () => {
            disableAddPlaylistBox(document.getElementById('playlistChooseBox'));
        });
        document.getElementById('showAllFavorites').addEventListener('click', printFavorites);
        document.getElementById('showAllSpan').addEventListener('click', printFavorites);

        printFirstFavorites();
        printFirstFavoriteArtists();

        printRandomSongs(document.getElementById('artists'));

        document.getElementById('deletePlaylist').addEventListener('click', () => {
            deletePlaylist(document.getElementById('playlistName').textContent, username);
        });

        document.getElementById('addFavoriteArtist').addEventListener('click', () => {
            addFavoriteArtist(username, document.getElementById('artistName').textContent, document.getElementById('addFavoriteArtist'));
        });

        printRecentlyPlayedElements(document.getElementById('recentlyPlayed'));

        document.getElementById('showAllArtists').addEventListener('click', () => {
            getAllFavoriteArtists();
        });
    }
}

function switchLoop(icon) {
    if (icon.style.color === activeColor) {
        loop = false;
        icon.style.color = deactiveColor;
    } else {
        loop = true;
        icon.style.color = activeColor;
    }

    loopSong(loop);
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

function switchPausePlay(icon, newIconClassName, oldIconClassName) {
    if (icon.className === newIconClassName) {
        icon.className = oldIconClassName;
        icon.title = 'Resume track';
        resumeSong();
    } else {
        icon.className = newIconClassName;
        icon.title = 'Pause track';
        pauseSong();
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

function addPlaylistOn(element) {
    element.style.display = 'flex';
    document.getElementById('startSuggestions').style.filter = 'blur(5px)';
    document.getElementById('favorites').style.filter = 'blur(5px)';
    document.getElementById('profile').style.filter = 'blur(5px)';
    document.getElementById('playlistBox').style.filter = 'blur(5px)';
    document.getElementById('searchResults').style.filter = 'blur(5px)';
    document.getElementById('artistBox').style.filter = 'blur(5px)';
    document.getElementById('favoriteSongsBox').style.filter = 'blur(5px)';


}

function addPlaylist(name, description) {
    if (name === '') {
        disableAddPlaylistBox(document.getElementById('createNewPlaylistBox'));
    }else{
        savePlaylistToDB(name, description, document.getElementById('profileName').textContent);
        disableAddPlaylistBox(document.getElementById('createNewPlaylistBox'));
        writePlaylistsFromUser(document.getElementById('profileName').textContent);
    }
}

function disableAddPlaylistBox(element) {
    element.style.display = 'none';
    document.getElementById('startSuggestions').style.filter = 'blur(0px)';
    document.getElementById('favorites').style.filter = 'blur(0px)';
    document.getElementById('profile').style.filter = 'blur(0px)';
    document.getElementById('playlistBox').style.filter = 'blur(0px)';
    document.getElementById('searchResults').style.filter = 'blur(0px)';
    document.getElementById('artistBox').style.filter = 'blur(0px)';
    document.getElementById('favoriteSongsBox').style.filter = 'blur(0px)';


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
            writePlaylistsFromUser(username)
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
                    if (response[i]["song_id"] !== null && response[i]["song_id"] !== undefined && response[i]["song_id"] !== '') {
                        if (i === 0) {
                            table.appendChild(insertFirstRow('Release year'));
                        }

                        table.appendChild(createTableRow(response[i]["song_src"], response[i]["song_id"], response[i]["song_name"], response[i]["artist"], response[i]["release_year"], response[i]["star"], false));
                    } else {
                        printNoAvailable(document.getElementById('songResults'), 'There were no songs found.');
                    }
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

function insertFirstRow(text) {
    let tableRow1 = document.createElement('tr');
    let placeholder = document.createElement('th');
    placeholder.setAttribute('class', 'firstTableRow');
    let songName = document.createElement('th');
    songName.textContent = 'Title';
    let songArtist = document.createElement('th');
    songArtist.textContent = 'Artist';
    let releaseYear = document.createElement('th');
    releaseYear.textContent = text;
    let placeholder2 = document.createElement('th');
    placeholder2.setAttribute('class', 'lastTableRow');
    tableRow1.appendChild(placeholder);
    tableRow1.appendChild(songName);
    tableRow1.appendChild(songArtist);
    tableRow1.appendChild(releaseYear);
    tableRow1.appendChild(placeholder2);

    return tableRow1;
}

function getArtists(value) {
    if (value.length > 3) {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.responseText);
                let divBoxForArtistResults = document.createElement('div');
                divBoxForArtistResults.setAttribute('id', 'artistResults');
                divBoxForArtistResults.setAttribute('class', 'suggestion');
                console.log(response);
                for (let i = 0; i < response.length; i++) {
                    divBoxForArtistResults.appendChild(addArtistRow(response[i]["artist"], ''));
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
    amountSongs = 0;
    hideTabs();
    getPlaylistSongs(playlistName, playlistDescription, playlistUsername);

    if (playlistPicture === '' || playlistPicture === null || playlistPicture === 'NULL' || playlistPicture === 'null') {
        document.getElementById('playlistPicture').src = defaultPlaylistPicture;
    } else {
        document.getElementById('playlistPicture').src = playlistPicture;
    }

    document.getElementById('playlistBox').style.display = 'block';
}

function getPlaylistSongs(playlistName, playlistDescription, playlistUsername) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            deleteAllPreviousChilds(document.getElementById('playlistData'));
            let response = JSON.parse(this.responseText);
            let divBoxForSongResults = document.createElement('div');
            divBoxForSongResults.setAttribute('id', 'playlistSongResults');
            let table = document.createElement('table');
            table.setAttribute('class', 'songResultsTable');
            amountSongs = response.length;
            for (let i = 0; i < response.length; i++) {
                if (response[i]["song_id"] !== null && response[i]["song_id"] !== undefined && response[i]["song_id"] !== '') {
                    if (i === 0) {
                        table.appendChild(insertFirstRow('Date added'));
                    }
                    table.appendChild(createTableRow(response[i]["song_src"], response[i]["song_id"], response[i]["song_name"], response[i]["artist"], response[i]["date_added"], response[i]["star"], true));
                } else {
                    printNoAvailable(document.getElementById('artistResults'), 'There are no songs in this playlist so far');
                }
            }
            divBoxForSongResults.appendChild(table);
            document.getElementById('playlistData').appendChild(divBoxForSongResults);

            document.getElementById('playlistName').textContent = playlistName;
            document.getElementById('playlistDescription').textContent = playlistDescription;
            amountSongs = amountSongs !== undefined ? amountSongs : '0';
            document.getElementById('playlistUsername').textContent = `Made by ${playlistUsername} ${amountSongs} Songs`;
        }
    };
    xhttp.open("POST", "./../php/getSongsFromPlaylist.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("playlistName=" + playlistName);
}

function hideTabs() {
    for (let i = 0; i < document.getElementsByClassName('tab').length; i++) {
        document.getElementsByClassName('tab')[i].style.display = 'none';
        document.getElementsByClassName('navigationP')[i].setAttribute('id', '');
    }
    document.getElementById('searchResults').style.display = 'none';
    document.getElementById('playlistBox').style.display = 'none';
    document.getElementById('artistBox').style.display = 'none';
    document.getElementById('favoriteSongsBox').style.display = 'none';
    document.getElementById('favoriteArtistsBox').style.display = 'none';
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
                if (response[i]["song_id"] !== null && response[i]["song_id"] !== undefined && response[i]["song_id"] !== '') {
                    if (i === 0) {
                        table.appendChild(insertFirstRow('Release year'));
                    }
                    table.appendChild(createTableRow(response[i]["song_src"], response[i]["song_id"], response[i]["song_name"], response[i]["artist"], response[i]["release_year"], response[i]["star"], false));
                } else {
                    printNoAvailable(document.getElementById('artistResults'), 'This artist has no songs so far.');
                }
            }
            divBoxForSongResults.appendChild(table);
            document.getElementById('addFavoriteArtist').textContent = response[0]["artistIsLiked"] ? 'person_add_disabled' : 'person_add';
            document.getElementById('addFavoriteArtist').setAttribute('title', response[0]["artistIsLiked"] ? 'Remove from your favorite artists' : 'Add to your favorite artists');
            document.getElementById('artistResults').appendChild(divBoxForSongResults);
        }
        document.getElementById('artistBox').style.display = 'block';
    };
    xhttp.open("POST", "./../php/getSongsFromArtist.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("artist=" + artist);
}

function createTableRow(songSrc, songID, songName, artist, releaseYear, isLiked, playlistDelete) {
    let tableRow = document.createElement('tr');

    let iconRow = document.createElement('td');
    let span = document.createElement('span');
    let icon = document.createElement('i');
    icon.setAttribute('class', 'tableIcon far fa-play-circle');
    icon.setAttribute('title', 'Play');
    let icon2 = document.createElement('i');

    if (isLiked) {
        icon2.setAttribute('class', 'fas fa-star');
        icon2.setAttribute('title', 'Remove from favorites');
        icon2.addEventListener('click', () => {
            removeFavoriteSong(icon2, tableRow.getAttribute('data-songID'));
        });
    } else {
        icon2.setAttribute('class', 'far fa-star');
        icon2.setAttribute('title', 'Add to favorites');
        icon2.addEventListener('click', () => {
            addFavoriteSong(icon2, tableRow.getAttribute('data-songID'));
        });
    }

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

    let lastRow = document.createElement('td');
    let queueIcon = document.createElement('span');
    queueIcon.setAttribute('class', 'tableIcon material-icons');
    queueIcon.textContent = 'queue';
    queueIcon.setAttribute('title', 'Add to queue');

    let addIcon = document.createElement('span');
    if (playlistDelete) {
        addIcon.setAttribute('class', 'tableIcon material-icons');
        addIcon.textContent = 'playlist_add_check';
        addIcon.setAttribute('title', 'Remove from playlist');
        addIcon.addEventListener('click', () => {
            removeSongFromPlaylist(songID, document.getElementById('playlistName').textContent);
        });
    } else {
        addIcon.setAttribute('class', 'tableIcon material-icons');
        addIcon.textContent = 'playlist_add';
        addIcon.setAttribute('title', 'Add to playlist');
        addIcon.addEventListener('click', () => {
            showPlaylistOptions(songID, document.getElementById('playlistChooseBox'), document.getElementById('playlistsToChoseFrom'));
        });
    }
    lastRow.appendChild(queueIcon);
    lastRow.appendChild(addIcon);

    tableRow.setAttribute('data-songID', songID);
    tableRow.setAttribute('data-songName', songName);
    tableRow.setAttribute('data-artist', artist);
    tableRow.setAttribute('data-releaseYear', releaseYear);
    tableRow.setAttribute('data-songSrc', songSrc !== '' ? songSrc : defaultSong);

    tableRow.appendChild(iconRow);
    tableRow.appendChild(songRow);
    tableRow.appendChild(artistRow);
    tableRow.appendChild(releaseRow);
    tableRow.appendChild(lastRow);

    artistRow.addEventListener('click', () => {
        openArtistPage(tableRow.getAttribute('data-artist'));
    });

    return tableRow;
}


function addFavoriteSong(icon, songID) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText === 'Song was added to favorites') {
                icon.setAttribute('class', 'fas fa-star');
                icon.addEventListener('click', () => {
                    removeFavoriteSong(icon, songID);
                });
                icon.setAttribute('title', 'Remove from favorites');
            }
            printFirstFavorites();
        }
    };
    xhttp.open("POST", "./../php/saveSongToFavorites.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("song=" + songID);
}

function removeFavoriteSong(icon, songID) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText === 'Song was removed from favorites') {
                icon.setAttribute('class', 'far fa-star');
                icon.addEventListener('click', () => {
                    addFavoriteSong(icon, songID);
                });
                icon.setAttribute('title', 'Add to favorites');
            }
        }
    };
    xhttp.open("POST", "./../php/removeSongFromFavorites.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("song=" + songID);
}

function printFavorites() {
    hideTabs();
    getFavorites(false, document.getElementById('favoritesResult'));
    document.getElementById('favoriteSongsBox').style.display = 'block';
}

function printFirstFavorites() {
    getFavorites(true, document.getElementById('favoriteSongs'));
}

function printFirstFavoriteArtists() {
    getFavoriteArtists(true, document.getElementById('favoriteArtists'))
}

function getFavorites(isLimited, elementToAppendTo) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            deleteAllPreviousChilds(elementToAppendTo);
            let response = JSON.parse(this.responseText);
            let divBoxForSongResults = document.createElement('div');
            divBoxForSongResults.setAttribute('class', 'favoriteSongResults');

            let max = response.length >= 5 ? isLimited ? 5 : response.length : response.length;

            if (response[0]["song_id"] !== null && response[0]["song_id"] !== undefined && response[0]["song_id"] !== '') {
                let table = document.createElement('table');
                table.setAttribute('class', 'songResultsTable');

                for (let i = 0; i < max; i++) {
                        if (i === 0) {
                            table.appendChild(insertFirstRow('Release year'));
                        }
                        table.appendChild(createTableRow(response[i]["song_src"], response[i]["song_id"], response[i]["song_name"], response[i]["artist"], response[i]["release_year"], response[i]["star"], false));
                }

                divBoxForSongResults.appendChild(table);
            } else {
                printNoAvailable(elementToAppendTo, "You have no favorite songs so far.");
            }
            elementToAppendTo.appendChild(divBoxForSongResults);
        }
    };
    xhttp.open("POST", "./../php/getFavoriteSongs.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}

function getFavoriteArtists(isLimited, element) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            deleteAllPreviousChilds(element);
            let response = JSON.parse(this.responseText);
            let max = response.length > 5 ? isLimited ? 5 : response.length : response.length;

            if (response[0]["artist"] !== '' && response[0]["artist"] !== undefined) {
                for (let i = 0; i < max; i++) {
                    element.appendChild(addArtistRow(response[i]["artist"], response[i]["artist_src"]));
                }
            } else {
                printNoAvailable(element, 'You have no favorite artists so far.');
            }

        }

    };
    xhttp.open("POST", "./../php/getFavoriteArtists.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}

function addArtistRow(artist, artistSrc) {
    let src;

    if (artistSrc !== '' && artistSrc !== null && artistSrc !== undefined) {
        src = artistSrc;
    } else {
        src = defaultPicture;
    }

    let divBox = document.createElement('div');
    divBox.setAttribute('class', 'favoriteElement');

    let container = document.createElement('div');
    container.setAttribute('class', 'container');

    let image = document.createElement('img');
    image.setAttribute('src', src);
    image.setAttribute('alt', 'Artist image');

    let overlay = document.createElement('div');
    overlay.setAttribute('class', 'overlay');

    container.appendChild(image);
    container.appendChild(overlay);

    let artistP = document.createElement('p');
    artistP.textContent = artist;

    container.addEventListener('click', () => {
        openArtistPage(artist)
    });

    artistP.addEventListener('click', () => {
        openArtistPage(artist);
    });

    divBox.appendChild(container);
    divBox.appendChild(artistP);

    return divBox;
}

function printNoAvailable(field, text) {
    let element = document.createElement('h3');
    element.textContent = text;
    field.appendChild(element);
}

function showPlaylistOptions(song_id, element, listForPlaylists) {
    deleteAllPreviousChilds(listForPlaylists);

    addPlaylistNames(listForPlaylists, song_id, element);
    addPlaylistOn(element);
}

function addPlaylistNames(listForPlaylists, song_id, element) {
    let playlists = document.getElementsByClassName('navigationLink');

    for (let i = 0; i < playlists.length; i++) {
        let li = document.createElement('li');
        let a = document.createElement('a');
        let name = playlists[i].getAttribute('data-name');
        a.textContent = name;
        a.setAttribute('data-name', name);
        a.addEventListener('click', () => {
            addSongToPlaylist(name, song_id, playlists[i].getAttribute('data-username'), element);
        });
        li.appendChild(a);
        listForPlaylists.appendChild(li);
    }
}

function addSongToPlaylist(playlistName, songID, username, element) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText === 'Song was added to playlist') {
                disableAddPlaylistBox(element);
            } else {
                document.getElementById('addToPlaylistHeading').textContent = 'Something went wrong!';
            }
        }
    };
    xhttp.open("POST", "./../php/insertIntoPlaylist.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("playlistName=" + playlistName + "&song=" + songID + "&username=" + username);
}

function removeSongFromPlaylist(songID, playlistName) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText === 'Song was removed from playlist') {
                getPlaylistSongs(playlistName);
            }
        }
    };
    xhttp.open("POST", "./../php/removeSongFromPlaylist.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("playlistName=" + playlistName + "&song=" + songID);
}

function printRandomSongs(elementToAppendTo) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            deleteAllPreviousChilds(elementToAppendTo);
            let response = JSON.parse(this.responseText);
            let divBoxForSongResults = document.createElement('div');
            divBoxForSongResults.setAttribute('class', 'favoriteSongResults');
            let table = document.createElement('table');
            table.setAttribute('class', 'songResultsTable');
            for (let i = 0; i < response.length; i++) {
                if (response[i]["song_id"] !== null && response[i]["song_id"] !== undefined && response[i]["song_id"] !== '') {
                    if (i === 0) {
                        table.appendChild(insertFirstRow('Release year'));
                    }
                    table.appendChild(createTableRow(response[i]["song_src"], response[i]["song_id"], response[i]["song_name"], response[i]["artist"], response[i]["release_year"], response[i]["star"], false));
                } else {
                    printNoAvailable(elementToAppendTo, 'There are no songs to discover');
                }
            }
            divBoxForSongResults.appendChild(table);
            elementToAppendTo.appendChild(divBoxForSongResults);
        }
    };
    xhttp.open("POST", "./../php/getRandomSongs.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
}

function deletePlaylist(playlistName, username) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = this.responseText;
            if (response === 'Playlist was deleted') {
                writePlaylistsFromUser(username);
                switchTab(document.getElementsByClassName('link')[0].dataset.tab, document.getElementsByClassName('navigationP')[0]);
            }
        }
    };
    xhttp.open("POST", "./../php/deletePlaylist.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("playlistName=" + playlistName + "&username=" + username);
}

function addFavoriteArtist(username, artist, element) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = this.responseText;
            if (response === 'Artist was liked') {
                element.textContent = 'person_add_disabled';
                element.addEventListener('click', () => {
                    removeFavoriteArtist(username, artist, element);
                });
                element.setAttribute('title', 'Remove from your favorite artists');
            }
        }
    };
    xhttp.open("POST", "./../php/addFavoriteArtist.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username=" + username + "&artist=" + artist);
}

function removeFavoriteArtist(username, artist, element) {
    console.log('Remove ' + username + " " + artist + " " + element);
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let response = this.responseText;
            if (response === 'Artist was removed from favorites') {
                element.textContent = 'person_add';
                element.addEventListener('click', () => {
                    addFavoriteArtist(username, artist, element);
                });
                element.setAttribute('title', 'Add to your favorite artists');
            }
        }
    };
    xhttp.open("POST", "./../php/removeFavoriteArtist.php", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("username=" + username + "&artist=" + artist);
}

function playSong(songSrc, songID, songName, artist, releaseYear, isLiked) {
    activeSong = new Howl({
        src: [musicPrefix + defaultSong],
        autoplay: true,
        loop: loop,
        volume: songVolume,
        onplay: function () {
            let time = utils.formatTime(Math.round(this.duration()));
            document.getElementById('totalTime').textContent = time;
            requestAnimationFrame(utils.updateTimeTracker.bind(this));
        },
        onend: function() {
            console.log('Finished!');
            if (!loop) {
                addSongToPreviousSongs(songSrc, songID, songName, artist, releaseYear, isLiked);
                playNextSong();
            }
        }
    });
}

function addSongToPreviousSongs(songSrc, songID, songName, artist, releaseYear, isLiked) {
    let previousSongs = JSON.parse(localStorage.getItem('previousSongs'));
    let index;

    if (previousSongs !== undefined && previousSongs !== null) {
        index = previousSongs.length;
    } else {
        index = 0;
        previousSongs = [];
    }

    previousSongs[index]["songSrc"] = songSrc;
    previousSongs[index]["songID"] = songID;
    previousSongs[index]["songName"] = songName;
    previousSongs[index]["artist"] = artist;
    previousSongs[index]["releaseYear"] = releaseYear;
    previousSongs[index]["isLiked"] = isLiked;
}

function playNextSong() {

}

let utils = {
    formatTime: function (secs) {
        let minutes = Math.floor(secs / 60) || 0;
        let seconds = (secs - minutes * 60) || 0;
        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    },
    updateTimeTracker: function () {
        let self = this;
        let seek = activeSong.seek() || 0;
        let currentTime = utils.formatTime(Math.round(seek));

        document.getElementById('currentTime').textContent = currentTime;
        document.getElementById('songBar').style.paddingLeft = ((((seek / this.duration()) * 100 || 0) / 100) * document.getElementById('songBar').style.width.substring(0,2)) + '%';

        if (self.playing()) {
            requestAnimationFrame(utils.updateTimeTracker.bind(self));
        }
    }
};

function changeVolume(newVolume) {
    if (activeSong !== null && activeSong !== undefined) {
        Howler.volume(newVolume);
    }
}

function pauseSong() {
    if (activeSong !== null && activeSong !== undefined) {
        activeSong.pause();
    }
}

function resumeSong() {
    if (activeSong !== null && activeSong !== undefined) {
        activeSong.play();
    }
}

function seekSong(perCent) {
    if (activeSong !== null && activeSong !== undefined) {
        let seekPosition = activeSong.duration() * perCent;
        activeSong.seek(seekPosition);
        document.getElementById('currentTime').textContent = utils.formatTime(Math.round(seekPosition));
    }
}

function loopSong(loop) {
    activeSong.loop(loop);
}

function printRecentlyPlayedElements(element) {
    deleteAllPreviousChilds(element);

    let recentlyPlayed = JSON.parse(localStorage.getItem('previousSongs'));

    if (recentlyPlayed !== null && recentlyPlayed !== undefined && recentlyPlayed.length !== 0) {
        let divBoxForSongResults = document.createElement('div');
        divBoxForSongResults.setAttribute('class', 'favoriteSongResults');
        let table = document.createElement('table');
        table.setAttribute('class', 'songResultsTable');
        for (let i = 0; i < recentlyPlayed.length; i++) {
            if (recentlyPlayed[i]["songID"] !== null && recentlyPlayed[i]["songID"] !== undefined && recentlyPlayed[i]["songID"] !== '') {
                if (i === 0) {
                    table.appendChild(insertFirstRow('Release year'));
                }
                table.appendChild(createTableRow(recentlyPlayed[i]["songSrc"], recentlyPlayed[i]["songID"], recentlyPlayed[i]["songName"], recentlyPlayed[i]["artist"], recentlyPlayed[i]["releaseYear"], recentlyPlayed[i]["isLiked"], false));
            }
        }
        divBoxForSongResults.appendChild(table);
        element.appendChild(divBoxForSongResults);
    } else {
        printNoAvailable(element, 'No songs were played recently.');
    }
}

function getAllFavoriteArtists() {
    hideTabs();
    document.getElementById('favoriteArtistsBox').style.display = 'block';
    getFavoriteArtists(false, document.getElementById('favoriteArtistsFull'));
}

volumeSlider
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
        changeVolume(event.pageX / 100);
    });

songSlider
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
        seekSong(value * 100 / document.getElementById('songBar').style.width.substring(0, 2));
    });
