<?php
if (!empty($_POST["username"])) {
    $username = $_POST["username"];
}else{
    echo "Not used correctly!";
    exit();
}

echo json_encode(getAllPlaylistsFromUser($username, readAllPlaylists()));

function readAllPlaylists(){
    $playlists = array();
    $file = fopen("./../csv/playlists.csv", "r") or die("Unable to open file!");

    $firstLine = fgets($file);
    $partsOfFirstLine = explode(";", $firstLine);

    for ($i = 0; $i < count($partsOfFirstLine); $i++) {
        $partsOfFirstLine[$i] = rtrim($partsOfFirstLine[$i]);
    }

    while (!feof($file)) {
        $line = fgets($file);
        $partsOfLine = explode(";", $line);

        for ($i = 0; $i < count($partsOfLine); $i++) {
            $partsOfLine[$i] = rtrim($partsOfLine[$i]);
        }

        $playlists[] = array(
            $partsOfFirstLine[0] => $partsOfLine[0],
            $partsOfFirstLine[1] => $partsOfLine[1]
        );
    }

    return $playlists;
}

function getAllPlaylistsFromUser($username, $playlists){
    $playlistsFromUser = array();

    for ($i = 0; $i < count($playlists); $i++) {
        if ($playlists[$i]["username"] === $username) {
            $playlistsFromUser[] = $playlists[$i]["playlist_title"];
        }
    }

    return $playlistsFromUser;
}
?>