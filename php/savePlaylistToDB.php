<?php
require("database-config.php");

session_start();

$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);

if($conn->connect_error){
    die("Connection failed: " . $conn->connect_error);
}

if((isset($_POST["name"])) && !empty($_POST["name"]) && isset($_POST["description"]) && !empty($_POST["description"]) && isset($_POST["username"]) && !empty($_POST["username"])){
    $nameOfPlaylist = $conn->real_escape_string($_POST["name"]);
    $descriptionOfPlaylist = $conn->real_escape_string($_POST["description"]);
    $_username = $conn->real_escape_string($_POST["username"]);

    if ($_username == $_SESSION["username"] && $_SESSION["loggedin"] == true) {
        $stmt = "INSERT INTO playlists (playlist_name, username, playlist_description) VALUES ('$nameOfPlaylist', '$_username', '$descriptionOfPlaylist')";
        if($_res = $conn->query($stmt)) {
            echo "Playlist has been added";
        }else{
            echo "Something went wrong";
        }
    }


} else{
    die("Username and password must be set");
}
$stmt->close();
$conn->close();
?>