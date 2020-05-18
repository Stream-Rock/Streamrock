<?php
session_start();

 include './../php/checkLoggedIn.php';
if (isset($loggedIn)) {
    if ($loggedIn === false) {
        header("HTTP/1.1 403 Forbidden");
        exit();
    }
}else{
    die('File import does not work correctly');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Home</title>
    <link rel="stylesheet" href="./../css/application.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css">
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <link href="https://fonts.googleapis.com/css?family=Rubik&display=swap" rel="stylesheet">
    <link href='https://fonts.googleapis.com/icon?family=Material+Icons' rel='stylesheet'>
</head>
<script src="https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js"></script>
<link rel="shortcut icon" type="image/x-icon" href="../images/shamrock_black.png">

<body onload="init('<?php
if (isset($_SESSION['username'])) {
    echo $_SESSION['username'];
}else{
    die("An error occurred");
}
?>', '<?php
if (isset($_SESSION['profile_picture']) && $_SESSION['profile_picture'] !== '') {
    echo $_SESSION['profile_picture'];
}else {
    echo './../images/profile_picture.png';
}
?>')">
<div class="leftBar">
    <nav>
        <div class="verticalNavigation">
            <ul class="navigationUL" id="logo">
                <img src="./../images/shamrock_black.png" alt="Shamrock">
                <h1 id="heading">Streamrock</h1>
            </ul>
        </div>
        <div class="verticalNavigation">
            <ul class="navigationUL" id="playlists">
                <h1 id="playlistsHeading">Playlists<i class="fas fa-plus" id="playlistAdd"></i></h1>
                <div id="playlistListing">
                </div>
            </ul>
        </div>
    </nav>
</div>
<div class="currentSongName">
    <p id="currentSong">No song is playing</p>
    <p id="currentArtist"></p>
    <i class="far fa-star" id="star"></i>
</div>
<div class="searchBar">
    <input type="text" id="search" placeholder="Search">
    <i class="far fa-times-circle" id="cancel" style="display: none;"></i>
</div>
<div id="content">
    <div class="navigationHorizontal">
        <div class="link" data-tab="startSuggestions">
            <p id="active" class="navigationP">Start</p>
        </div>
        <div class="link" data-tab="favorites">
            <p class="navigationP">Favorites</p>
        </div>
        <div class="link" data-tab="profile">
            <p class="navigationP">Profile</p>
        </div>
    </div>
    <div class="tab" id="startSuggestions">
        <h1 id="recentlyPlayedHeading">Recently played</h1>
        <div class="suggestion" id="recentlyPlayed">
        </div>
        <h1 id="favoritePlaylistsHeading">Discover songs</h1>
        <div class="suggestion" id ="artists">
        </div>
    </div>
    <div class="tab" id="favorites" style="display: none;">
        <h1 id="favoriteSongsHeading">Favorite songs <div class="showAllDiv"><span title="Show all favorite songs" id="showAllSpan">Show all</span><i id="showAllFavorites" title="Show all favorite songs" class="fas fa-chevron-right"></i></div></h1>
        <div class="suggestion" id="favoriteSongs">
        </div>
        <h1 id="favoriteArtistsHeading">Favorite artists<div class="showAllDiv"><span title="Show all favorite artists" id="showAllArtists">Show all</span><i title="Show all favorite artists" class="fas fa-chevron-right"></i></div></h1>
        <div class="suggestion" id="favoriteArtists">
        </div>
    </div>
</div>
<div class="tab" id="profile" style="display: none;">
    <div id="profileBox">
        <img src="./../images/profile_picture.png" alt="Image" id="profilePicture">
        <p id="profileName"></p>
        <div id="changeProfileBox">
            <p>Change profile picture</p>
            <form id="profilePictureForm" action="./../php/uploadProfilePicture.php" method="post" enctype="multipart/form-data">
                <input type="file" name="fileToUpload" id="profilePictureToUpload" class="file-input" accept="image/*">
                <label for="profilePictureToUpload" class="btn-1">Upload file</label>
            </form>
        </div>
        <button id="logoutButton">Log out</button>
        <button class="deleteAccountButton" id="deleteAccountButton">Delete Account</button>
        <p style="font-size: 20px; display: none" id="sureText">Are you sure you want to delete your account?</p>
        <button style="display: none" class="deleteAccountButton" id="sureButton">Yes, I am sure</button>
        <button style="display: none" class="deleteAccountButton" id="cancelButton">Cancel</button>

    </div>
</div>
<div id="searchResults" style="display: none">
    <h1>Results</h1>
    <div id="searchResultsBox">
    </div>
</div>
<div id="playlistBox" style="display: none;">
    <div class="playlistDescription">
        <img id="playlistPicture" src="./../images/profile_picture.png"/ alt="Playlist picture" >
        <h3 id="playlistName"></h3>
        <p id="playlistDescription"></p>
        <p id="playlistUsername"></p>
        <button id="playPlaylist">Play</button>
        <span class="material-icons" id="deletePlaylist" title="Delete playlist">
            delete_sweep
        </span>
    </div>
    <div id="playlistData">

    </div>
</div>
<div id="artistBox" style="display: none">
    <div class="artistDescription">
        <img class="artistPicture" src="./../images/profile_picture.png"/ alt="Artist picture">
        <h3 id="artistName">Artist name</h3>
        <button>Play</button>
        <span class="material-icons" id="addFavoriteArtist" title="Add to your favorite artists">
            person_add
        </span>
    </div>
    <div id="artistResults">

    </div>
</div>
<div id="favoriteSongsBox" style="display: none">
    <div class="artistDescription">
        <h3>Favorite songs</h3>
    </div>
    <div id="favoritesResult">

    </div>
</div>

<div id="queueSongs" style="display: none">
    <div class="artistDescription">
        <h3>Songs in queue
            <span class="material-icons" id="deleteQueue" title="Delete queue">
            delete_sweep
            </span>
        </h3>
    </div>
    <div id="songsInQueue">

    </div>
</div>

<div id="favoriteArtistsBox" style="display: none">
    <div class="artistDescription">
        <h3>Favorite artists</h3>
    </div>
    <div class="suggestion" id="favoriteArtistsFull">

    </div>
</div>


<div class="createNewPlaylist" id="playlistChooseBox" style="display: none;">
    <div class="playlistTitle">
        <h6>
            <strong id="addToPlaylistHeading">Choose playlist to add song to</strong>
        </h6>
    </div>
    <div class="playlistOptions" id="playlistList">
        <ul id="playlistsToChoseFrom">
        </ul>
    </div>
    <i class="far fa-times-circle" id="cancelSelectAddToPlaylist"></i>
</div>

<div class="songOptions">
    <div class="volumeBar">
        <i class="fas fa-volume-down" id="volume_down"></i>
        <div id="volumeBar" class="slider"></div>
        <i class="fas fa-volume-up" id="volume_up"></i>
    </div>
    <div class="playOptions">
        <i class="fas fa-step-backward" id="last" title="Play previous track"></i>
        <i class="far fa-pause-circle" id="pause" title="Pause track"></i>
        <i class="fas fa-step-forward" id="next" title="Play next track"></i>
    </div>
    <div class="trackOptions">
        <span class="material-icons" id="loop" title="Enable loop">repeat</span>
        <span class="material-icons" id="queue" title="Show queue">queue_music</span>
    </div>
    <div class="songBar">
        <p id="currentTime">-:-</p>
        <div id="songBar" class="slider" style="width: 26%"></div>
        <p id="totalTime">-:-</p>
    </div>
</div>
<div class="createNewPlaylist" id="createNewPlaylistBox" style="display: none;">
    <div class="playlistTitle">
        <h6>
            <strong id="winningText">Create new Playlist</strong>
        </h6>
    </div>
    <div class="playlistOptions">
        <img src="./../images/playlist_picture.png" alt="Playlist Picture">
        <div id="playListOptionsInputs">
            <p>Name</p>
            <input type="text" name="" id="nameOfPlaylist">
            <p>Description</p>
            <input type="text" name="" id="descriptionOfPlaylist">
        </div>
    </div>
    <div id="playlistButton">
        <div id="createButton">
            <p>Create</p>
        </div>
    </div>
    <i class="far fa-times-circle" id="cancelCreateNewPlaylist"></i>
</div>
<script src="./../js/howler.min.js"></script>
<script src="./../js/application.js"></script>
</body>
</html>