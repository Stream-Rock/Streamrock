<?php
require("database-config.php");

$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);
$username = $_POST["username"];

if($conn -> connect_error){
    die("Connection failed: " . $conn -> connect_error);
}

if (isset($username) && !empty($username)) {
    $stmt = $conn->prepare("SELECT username FROM accounts WHERE username = ? AND user_deleted = 0");
    $stmt->bind_param("s", $username);

    $stmt->execute();
    echo json_encode($stmt->get_result()->fetch_all());
}else{
    die("Username must be set");
}
?>