<?php
session_start();
require("database-config.php");
$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);

if($conn -> connect_error){
    die("Connection failed: " . $conn -> connect_error);
}

$song_id = $_POST["song"];
$username = $_SESSION["username"];

if (isset($song_id) && !empty($song_id) && $song_id !== '' && isset($username) && $username !== '') {
    $stmt = $conn -> prepare("INSERT INTO accounts_likes (username, song_id) VALUES (?, ?)");
    $stmt->bind_param("ss", $username, $song_id);


    $stmt -> execute();
    echo("Song was added to favorites");
} else {
    echo "ID and/or Username were not set";
}
?>