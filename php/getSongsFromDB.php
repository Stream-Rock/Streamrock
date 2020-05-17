<?php
require("database-config.php");

session_start();
$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);
$search = $_POST["search"];
$response = [];
$count = 0;
$username = $_SESSION["username"];

if($conn -> connect_error){
    die("Connection failed: " . $conn -> connect_error);
}

if (isset($search) && !empty($search) && isset($username) && $username !== "") {
    $stmt = "SELECT song_id, song_name, artist, release_year, song_src FROM song_list WHERE song_name LIKE '%" . $search . "%'";

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
