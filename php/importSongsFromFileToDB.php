<!--By running this script every song from the csv file 'classic-rock.csv' will be saved to the database-->
<?php
require("database-config.php");

$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);

if($conn -> connect_error){
    die("Connection failed: " . $conn -> connect_error);
}

$file_array = file("./../csv/classic-rock.csv") or die("Unable to open file!");

$stmt = $conn -> prepare("INSERT INTO song_list (song_name, artist, release_year, song_genre) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $song_name, $artist, $release_year, $song_genre);
$song_genre = "Rock";

foreach ($file_array AS $currentLine) {
    set_time_limit(10);
    $line_array = explode(",", $currentLine);
    if ($line_array[0] != "Song Clean") {
        $song_name = $line_array[0];
        $artist = $line_array[1];
        $release_year = $line_array[2];

        $stmt -> execute();
        echo("$song_name was added to database\n");
    }
}

$artistStmt = $conn -> prepare("INSERT INTO artist (artist) VALUES (?)");
$artistStmt->bind_param("s", $artist);

foreach ($file_array AS $currentLine) {
    set_time_limit(10);
    $line_array = explode(",", $currentLine);
    if ($line_array[0] != "Song Clean") {
        $artist = $line_array[1];

        $artistStmt -> execute();
        echo("$artist was added to database\n");
    }
}

$stmt -> close();
$conn -> close();
?>