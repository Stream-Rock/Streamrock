<?php
session_start();
require("database-config.php");
$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);

if($conn -> connect_error){
    die("Connection failed: " . $conn -> connect_error);
}

$playlist_name = $_POST["playlistName"];
$song_id = $_POST["song"];
$username = $_POST["username"];

if (isset($playlist_name) && !empty($playlist_name) && $playlist_name !== '' && isset($song_id) && !empty($song_id) && $song_id !== '' && isset($username) && $username !== '' && $username === $_SESSION["username"]) {
    $stmt = $conn -> prepare("INSERT INTO playlists_songs (username, playlist_name, song_id, date_added) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("sss", $username, $playlist_name, $song_id);


    $stmt -> execute();
    if ($stmt->affected_rows > 0) {
        echo "Song was added to playlist";
    } else {
        echo "No rows were affected";
    }
} else {
    echo "ID and/or username and/or playlist name were not set";
}
?>