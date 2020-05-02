<?php
require("database-config.php");

session_start();
$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);
$response = array();

if($conn->connect_error){
    die("Connection failed: " . $conn->connect_error);
}

if((isset($_POST["username"])) && !empty($_POST["username"]) && isset($_POST["password"]) && !empty($_POST["password"])){
    $_username = $conn->real_escape_string($_POST["username"]);
    $_password = $conn->real_escape_string($_POST["password"]);
    $_password = "saver" . $_password . "now";

    $_sql = "SELECT profile_picture FROM accounts WHERE username='$_username' AND password=md5('$_password') AND user_deleted=0 LIMIT 1";

    if($_res = $conn->query($_sql)){
        if($_res->num_rows > 0){
            $_SESSION["loggedin"] = true;
            $_SESSION["username"] = $_username;

            if ($row = $_res->fetch_assoc()) {
                $_SESSION["profile_picture"] = $row["profile_picture"];
            }

            $_sql = "UPDATE accounts SET last_login=NOW() WHERE username='$_username'";
            $conn->query($_sql);
            $response["message"] = "$_username is now logged in";
        } else{
            $response["message"] = "Please make sure the credentials are correct";
        }
    } else{
        $response["message"] = "Please make sure the credentials are correct";
    }
} else{
    $response["message"] = "Username and password must be set";
}


echo json_encode($response["message"]);
$conn->close();
?>;