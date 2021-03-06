<?php
require("database-config.php");

session_start();
$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);
$search = $_POST["search"];
$response = [];
$count = 0;

if($conn -> connect_error){
    die("Connection failed: " . $conn -> connect_error);
}

if (isset($search) && !empty($search)) {
    $stmt = "SELECT artist FROM song_list WHERE artist LIKE '%$search%' GROUP BY artist";

    $result = $conn->query($stmt);
    while($row = $result->fetch_assoc()) {
        $response[$count] = $row;
        $count++;
    }
    echo json_encode($response);
}

$conn->close();
?>
