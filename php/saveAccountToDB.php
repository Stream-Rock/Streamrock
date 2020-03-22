<?php
require("database-config.php");

session_start();

$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);
$response = array();

if($conn->connect_error){
    die("Connection failed: " . $conn->connect_error);
}

if((isset($_POST["password"])) && !empty($_POST["password"]) && isset($_POST["username"]) && !empty($_POST["username"])){
    $_username = $conn->real_escape_string($_POST["username"]);
    $_password = $conn->real_escape_string($_POST["password"]);
    $_password = "saver" . $_password . "now";

    $stmt = $conn->prepare("INSERT INTO accounts (username, password, user_deleted, last_login) VALUES (?, ?, 0, NOW())");
    $stmt->bind_param("ss", $_username, md5($_password));

    $stmt->execute();
    $response["message"] = "$_username has been created";
} else{
    $response["message"] = "Username and Password must be set";
}

echo json_encode($response);

$stmt->close();
$conn->close();
?>