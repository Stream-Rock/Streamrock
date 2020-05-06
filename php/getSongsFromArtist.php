<?php
require("database-config.php");

session_start();
$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);
$artist = $_POST["artist"];
$response = [];
$count = 0;

if($conn -> connect_error){
    die("Connection failed: " . $conn -> connect_error);
}

if (isset($artist) && !empty($artist)) {
    $stmt = "SELECT song_id, song_name, artist, release_year FROM song_list where artist = '$artist' ORDER BY release_year DESC;";

    $result = $conn->query($stmt);
    while($row = $result->fetch_assoc()) {
        $response[$count] = $row;
        $count++;
    }
    echo json_encode($response);
}

$conn->close();
?>
