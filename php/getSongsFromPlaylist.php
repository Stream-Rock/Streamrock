<?php
require("database-config.php");
$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

session_start();
$username = $_POST["playlistUsername"];
$playlist_name = $_POST["playlistName"];
$count = 0;

if (isset($username) && $username !== '' && $username === $_SESSION["username"] && isset($playlist_name) && $playlist_name !== '') {
    $stmt = "SELECT song_id, date_added FROM playlists_songs WHERE username = '$username'  AND playlist_name = '$playlist_name' ORDER BY date_added ASC";

    $result = $conn->query($stmt);
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $stmt = "SELECT song_id, song_name, artist FROM song_list WHERE song_id = " . $row["song_id"];
            $song = $conn->query($stmt)->fetch_assoc();

            $response[$count] = $song;

            $favoriteStmt = "SELECT * FROM accounts_likes WHERE username = '$username' AND song_id = " . $row["song_id"];
            if ($conn->query($favoriteStmt)->fetch_assoc()) {
                $response[$count]["star"] = true;
            } else {
                $response[$count]["star"] = false;
            }

            $response[$count]["date_added"] = $row["date_added"];

            $count++;
        }

        echo json_encode($response);
    } else {
        $response["message"] = "No rows were affected";
        echo json_encode($response);
    }
} else {
    $response["message"] = "Username and/or playlist name were not set.";
    echo json_encode($response);
}

