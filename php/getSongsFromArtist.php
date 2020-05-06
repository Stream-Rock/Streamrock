<?php
require("database-config.php");

session_start();
$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);
$artist = $_POST["artist"];
$response = [];
$count = 0;
$username = $_SESSION["username"];

if($conn -> connect_error){
    die("Connection failed: " . $conn -> connect_error);
}

if (isset($artist) && !empty($artist) && isset($username) && $username !== "") {
    $stmt = "SELECT song_id, song_name, artist, release_year FROM song_list where artist = '$artist' ORDER BY release_year DESC;";

    $result = $conn->query($stmt);
    while($row = $result->fetch_assoc()) {
        $response[$count] = $row;
        $song_id = $row["song_id"];
        $favoriteStmt = "SELECT * FROM accounts_likes WHERE username = '$username' AND song_id = '$song_id'";
        if ($conn->query($favoriteStmt)->fetch_assoc()) {
            $response[$count]["star"] = true;
        } else {
            $response[$count]["star"] = false;
        }
        $count++;
    }
    echo json_encode($response);
}

$conn->close();
?>
