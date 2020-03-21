<?php
require("database-config.php");

session_start();
$conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);

if($conn->connect_error){
    die("Connection failed: " . $conn->connect_error);
}

if((isset($_POST["username"])) && !empty($_POST["username"]) && isset($_POST["password"]) && !empty($_POST["password"])){
    $_username = $conn->real_escape_string($_POST["username"]);
    $_password = $conn->real_escape_string($_POST["password"]);
    $_password = "saver" . $_password . "now";

    $_sql = "SELECT * FROM login_username WHERE username='$_username' AND password=md5('$_password') AND user_deleted=0 LIMIT 1";

    if($_res = $conn->query($_sql)){
        if($_res->num_rows > 0){
            echo "Success<br>";
            $_SESSION["login"] = 1;
            $_SESSION["user"] = $_res->fetch_assoc();

            $_sql = "UPDATE login_username SET last_login=NOW() WHERE id=" . $_SESSION["user"]["id"];
            $conn->query($_sql);
        }
    }else{
        echo "Could not be logged in<br>";
    }
} else{
    echo "Something went wrong";
}

$conn->close();
?>