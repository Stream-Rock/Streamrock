<?php
require("database-config.php");

session_start();

$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);

if($conn->connect_error){
    die("Connection failed: " . $conn->connect_error);
}

if((isset($_POST["password"])) && !empty($_POST["password"]) && isset($_POST["username"]) && !empty($_POST["username"])){
    $_username = $conn->real_escape_string($_POST["username"]);
    $_password = $conn->real_escape_string($_POST["password1"]);
    $_password = "saver" . $_password . "now";

    $stmt = $conn->prepare("INSERT INTO accounts (username, password, user_deleted, last_login) VALUES (?, ?, 0, NOW())");
    $stmt->bind_param("ss", $_username, md5($_password));

    $stmt->execute();
} else{
    echo "Username and password must be set";
}

$stmt->close();
$conn->close();
?>