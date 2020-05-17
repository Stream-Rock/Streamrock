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
    $stmt = "SELECT artist FROM accounts_artists WHERE username = '$username' ORDER BY date_added DESC";

    $result = $conn->query($stmt);
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $srcStmt = "SELECT artist_src FROM artist WHERE artist = '" . $row["artist"] . "'";
            $artist = $conn->query($srcStmt);

            if ($artist->num_rows > 0) {
                $artist_src = $artist->fetch_assoc();

                $response[$count] = $row;
                $response[$count]["artist_src"] = $artist_src["artist_src"];
                $count++;
            }

        }

        echo json_encode($response);
    } else {
        echo json_encode(["No rows were returned"]);
    }
} else {
    echo json_encode(["ID and/or Username were not set"]);
}

