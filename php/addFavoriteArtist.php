<?php
session_start();
require("database-config.php");
$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);

if($conn -> connect_error){
    die("Connection failed: " . $conn -> connect_error);
}

$username = $_POST["username"];
$artist = $_POST["artist"];

if (isset($username) && !empty($username) && $username !== '' && isset($artist) && !empty($artist) && $artist !== '') {
    $stmt = $conn -> prepare("INSERT INTO accounts_artists (username, artist, date_added) VALUES (?, ?, NOW())");
    $stmt->bind_param("ss", $username, $artist);

    $stmt -> execute();
    if ($stmt->affected_rows > 0) {
        echo "Artist was liked";
    } else {
        echo "No rows were affected";
    }
} else {
    echo "Artist and/or username and/or playlist name were not set";
}
?>