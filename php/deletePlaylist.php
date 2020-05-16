<?php
session_start();
require("database-config.php");
$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);

if($conn -> connect_error){
    die("Connection failed: " . $conn -> connect_error);
}

$playlistName = $_POST["playlistName"];
$username = $_POST["username"];

if (isset($playlistName) && !empty($playlistName) && $playlistName !== '' && isset($username) && $username !== '') {
    $stmt = $conn -> prepare("UPDATE playlists set playlist_deleted = 1 where username = ? AND playlist_name = ?");
    $stmt->bind_param("ss", $username, $playlistName);


    $stmt -> execute();
    if ($conn->affected_rows > 0) {
        echo("Playlist was deleted");
    } else {
        echo("No rows were affected");
    }
} else {
    echo ("Playlist name and/or Username were not set");
}
?>