<?php
require("database-config.php");

session_start();
$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);
$response = array();

if($conn->connect_error){
    die("Connection failed: " . $conn->connect_error);
}

if ($_SESSION["username"] == $_POST["username"] && $_SESSION["loggedin"] == true) {
    $_sql = "UPDATE accounts SET user_deleted = 1 WHERE username='" . $_SESSION["username"] . "'";
    $conn->query($_sql);
    $_SESSION["username"] = '';
    $_SESSION["loggedin"] = false;
}

$conn->close();
echo "User has been deleted";
?>