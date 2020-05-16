<?php
session_start();
require("database-config.php");
$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);

if($conn -> connect_error){
    die("Connection failed: " . $conn -> connect_error);
}

$artist = $_POST["artist"];
$username = $_POST["username"];

if (isset($artist) && !empty($artist) && $artist !== '' && isset($username) && !empty($username) && $username !== '') {
    $stmt = $conn -> prepare("DELETE FROM accounts_artists WHERE username = ? AND artist = ?");
    $stmt->bind_param("ss", $username, $artist);

    $stmt -> execute();
    if ($stmt->affected_rows > 0) {
        echo "Artist was removed from favorites";
    } else {
        echo "No rows were affected";
    }
} else {
    echo "Artist name and/or username and/or playlist name were not set";
}
?>