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
    $stmt = "SELECT song_id, song_name, artist, release_year, song_src FROM song_list where artist = '$artist' ORDER BY release_year DESC;";

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

    $favoriteArtistStmt = "SELECT * FROM accounts_artists WHERE username ='$username' AND artist = '$artist';";
    if ($conn->query($favoriteArtistStmt)->fetch_assoc()) {
        $response[0]["artistIsLiked"] = true;
    } else {
        $response[0]["artistIsLiked"] = false;
    }

    $srcStmt = "SELECT artist_src FROM artist WHERE artist = '" . $artist . "'";
    $artist = $conn->query($srcStmt);

    if ($artist->num_rows > 0) {
        $artist_src = $artist->fetch_assoc();
        $response[0]["artistSrc"] = $artist_src["artist_src"];
    }

    echo json_encode($response);
}

$conn->close();
?>
