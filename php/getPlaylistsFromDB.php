<?php
require("database-config.php");

session_start();
$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);
$username = $_POST["username"];

if($conn -> connect_error){
    die("Connection failed: " . $conn -> connect_error);
}

if (isset($username) && !empty($username)) {
    if ($_SESSION["username"] == $username && $_SESSION["loggedin"] == true) {
        $stmt = $conn->prepare("SELECT playlist_name, username, playlist_description FROM playlists WHERE username = ?");
        $stmt->bind_param("s", $username);

        $stmt->execute();
        echo json_encode($stmt->get_result()->fetch_all());
    }else{
        die("User is not correct");
    }
}

$stmt->close();
$conn->close();
?>