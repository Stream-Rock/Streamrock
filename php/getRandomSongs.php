<?php
require("database-config.php");
$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

session_start();

$username = $_SESSION["username"];

if ($username !== '' && isset($username)) {
    $stmt = "SELECT COUNT(*) FROM song_list";

    $result = $conn->query($stmt);
    if ($result->num_rows > 0) {

        $amount = $result->fetch_assoc();
        $amountSongs = (int) $amount["COUNT(*)"];
        $amountRows = $amountSongs >= 5 ? 5 : $amountSongs;

        for ($i = 0; $i < $amountRows; $i++) {
            $randomNumber = rand(1, $amountSongs);
            $selectStmt = "SELECT song_id, song_name, artist, release_year, song_src FROM song_list where song_id = " . $randomNumber;
            $song = $conn->query($selectStmt)->fetch_assoc();

            $response[$i] = $song;

            $favoriteStmt = "SELECT * FROM accounts_likes WHERE username = '$username' AND song_id = " . (int) $song["song_id"];
            if ($conn->query($favoriteStmt)->fetch_assoc()) {
                $response[$i]["star"] = true;
            } else {
                $response[$i]["star"] = false;
            }
        }

        echo json_encode($response);
    } else {
        $response["message"] = "No rows were affected";
        echo json_encode($response);
    }
} else {
    $response["message"] = "Username was not set";
    echo json_encode($response);
}

