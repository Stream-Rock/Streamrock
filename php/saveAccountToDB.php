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

    $stmt = "INSERT INTO accounts (username, password, user_deleted, last_login) VALUES ('$_username', md5('$_password'), 0, NOW())";


    if($_res = $conn->query($stmt)) {
        $response["message"] = "$_username has been created";
        $_SESSION["loggedin"] = true;
        $_SESSION["username"] = $_username;
        echo json_encode($_res->fetch_all());
    }else{
        $response["message"] = "Something went wrong";
        echo json_encode($_res->fetch_all());
    }
} else{
    $response["message"] = "Username and password must be set";
    die("Username and password must be set");
}
$stmt->close();
$conn->close();

echo json_encode($response);
?>