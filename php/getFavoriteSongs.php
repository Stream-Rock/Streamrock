<?php

session_start();
require("database-config.php");
$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$username = $_SESSION["username"];

if (isset($song_id) && !empty($song_id) && $song_id !== '' && isset($username) && $username !== '') {
    $stmt = $conn->prepare("SELECT song_id, song_name, artist, release_year FROM song_list WHERE song_id IN (SELECT song_id FROM accounts_likes WHERE username = ? ORDER BY date_added DESC)");
    $stmt->bind_param("s", $username);

    $result = $conn->query($stmt);
    while($row = $result->fetch_assoc()) {
        $response[$count] = $row;
        $response[$count]["star"] = true;

        $count++;
    }

    echo json_encode($response);
} else {
    echo "ID and/or Username were not set";
}

