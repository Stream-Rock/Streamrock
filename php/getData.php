<?php
if (!empty($_POST["username"]) && !empty($_POST["filename"])) {
    $username = $_POST["username"];
    $filename = $_POST["filename"];
} else {
    die("Username and file name must not be empty");
    exit();
}

echo json_encode(getAllPlaylistsFromUser($username, readAllPlaylists($filename)));

function readAllPlaylists($filename){
    $playlists = array();
    $file = fopen($filename, "r") or die("Unable to open file!");

    $firstLine = fgets($file);
    $partsOfFirstLine = explode(";", $firstLine);

    for ($i = 0; $i < count($partsOfFirstLine); $i++) {
        $partsOfFirstLine[$i] = rtrim($partsOfFirstLine[$i]);
    }

    if(count($partsOfFirstLine) != 4){
        trigger_error("Columns of file must be 4");
    }else{
        while (!feof($file)) {
            $line = fgets($file);
            $partsOfLine = explode(";", $line);
    
            for ($i = 0; $i < count($partsOfLine); $i++) {
                $partsOfLine[$i] = rtrim($partsOfLine[$i]);
            }
    
            $playlists[] = array(
                $partsOfFirstLine[0] => $partsOfLine[0],
                $partsOfFirstLine[1] => $partsOfLine[1],
                $partsOfFirstLine[2] => $partsOfLine[2],
                $partsOfFirstLine[3] => $partsOfLine[3]
            );
        }

        return $playlists;
    }
}

function getAllPlaylistsFromUser($username, $playlists){
    if($username === ""){
        die("Not logged in");
    }else{
        $playlistsFromUser = array();

        for ($i = 0; $i < count($playlists); $i++) {
            if ($playlists[$i]["username"] === $username) {
                $playlistsFromUser[] = $playlists[$i];
            }
        }
    
        return $playlistsFromUser;
    }
}
