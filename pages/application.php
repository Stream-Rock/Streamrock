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
<div class="currentSongCover">
    <img src="./../images/nostalgia_ultra.jpg" alt="Cover of the song that is played" class="songPlayedCover">
</div>
<div class="currentSongName">
    <p id="currentSong">Current song</p>
    <p id="currentArtist">Current Artist</p>
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
        <h1>Recently Played<i class="fas fa-chevron-left"></i><i class="fas fa-chevron-right"></i></h1>
        <div class="suggestion" id="recentlyPlayed">
        </div>
        <h1>Artists<i class="fas fa-chevron-left"></i><i class="fas fa-chevron-right"></i></h1>
        <div class="suggestion" id ="artists">
        </div>
    </div>
    <div class="tab" id="favorites" style="display: none;">
        <h1>Favorite songs<i class="fas fa-chevron-left"></i><i class="fas fa-chevron-right"></i></h1>
        <div class="suggestion" id="favoriteSongs">
        </div>
        <h1>Favorite albums<i class="fas fa-chevron-left"></i><i class="fas fa-chevron-right"></i></h1>
        <div class="suggestion" id="favoriteAlbums">
        </div>
    </div>
</div>
<div class="tab" id="profile" style="display: none;">
    <div id="profileBox">
        <img src="./../images/profile_picture.png" alt="Image" id="profilePicture">
        <p id="profileName"></p>
        <div>
            <form id="profilePictureForm" action="./../php/uploadProfilePicture.php" method="post" enctype="multipart/form-data">
                <input type="file" name="fileToUpload" id="profilePictureToUpload" class="file-input" accept="image/*">
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
    <div class="suggestion" id="searchResultsBox">
    </div>
</div>
<div id="playlistBox" style="display: block;">
    <div class="playlistDescription">
        <img src="http://cdn4.iconfinder.com/data/icons/socialmediaicons_v120/48/google.png"/ alt="" >
        <h3>Playlist Name</h3>
        <p>Some Description</p>
        <p>Made by testuser 0 Songs</p>
        <button>Play</button>
    </div>
    <div>
        <table class="playlistTable">
            <tr>
                <th></th>
                <th>Title</th>
                <th>Artist</th>
                <th>Date added</th>
            </tr>
            <tr>
                <td><span><i class="tableIcon far fa-play-circle"></i></span><i class="far fa-star"></i></td>
                <td>Peter</td>
                <td>Griffin</td>
                <td>$100</td>
            </tr>
            <tr>
                <td></td>
                <td>Lois</td>
                <td>Griffin</td>
                <td>$150</td>
            </tr>
            <tr>
                <td></td>
                <td>Joe</td>
                <td>Swanson</td>
                <td>$300</td>
            </tr>
            <tr>
                <td></td>
                <td>Cleveland</td>
                <td>Brown</td>
                <td>$250</td>
            </tr>
        </table>
    </div>
</div>
<div class="songOptions">
    <div class="volumeBar">
        <i class="fas fa-volume-down" id="volume_down"></i>
        <div id="volumeBar" class="slider"></div>
        <i class="fas fa-volume-up" id="volume_up"></i>
    </div>
    <div class="playOptions">
        <i class="fas fa-step-backward" id="last"></i>
        <i class="far fa-pause-circle" id="pause"></i>
        <i class="fas fa-step-forward" id="next"></i>
    </div>
    <div class="trackOptions">
        <i class="fas fa-random" id="random"></i>
        <i class="fas fa-undo-alt" id="loop"></i>
        <i class="fas fa-bars" id="queue"></i>
    </div>
    <div class="songBar">
        <div id="songBar" class="slider"></div>
    </div>
</div>
<div class="createNewPlaylist" style="display: none;">
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
<script src="./../js/application.js"></script>
</body>
</html>