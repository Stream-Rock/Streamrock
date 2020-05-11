<?php
require("database-config.php");
$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

session_start();
$username = $_SESSION["username"];
$count = 0;

if (isset($username) && $username !== '') {
    $stmt = "SELECT song_id FROM accounts_likes WHERE username = '$username' ORDER BY date_added DESC";

    $result = $conn->query($stmt);
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $stmt = "SELECT song_id, song_name, artist, release_year FROM song_list WHERE song_id = " . $row["song_id"];
            $song = $conn->query($stmt)->fetch_assoc();

            $response[$count] = $song;
            $response[$count]["star"] = true;

            $count++;
        }

        echo json_encode($response);
    } else {
        echo json_encode(["No rows were returned"]);
    }
} else {
    echo json_encode(["ID and/or Username were not set"]);
}

