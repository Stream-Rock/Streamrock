<?php
session_start();

require("database-config.php");
require("uploadFile.php");

if (!isset($_FILES["fileToUpload"])) {
    exit();
}


$target_dir = "./../images/";
$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadSuccessful = uploadFileLocal($target_file, $_FILES["fileToUpload"]);
$username = $_SESSION["username"];

if ($uploadSuccessful) {
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
        $conn = new mysqli($_db_host, $_db_username, $_db_password, $_db_database);

        if ($conn->connect_error) {
            exit();
        }

        $insertStatement = $conn->prepare("UPDATE accounts SET profile_picture = '$target_file' WHERE username = ?;");
        $insertStatement->bind_param("s", $username);

        $insertStatement->execute();

        $conn->close();
        $_SESSION["profile_picture"] = $target_file;
        echo '<script type="text/javascript">
            window.open("./../pages/application.php", "_self");
        </script>';
    }
}else{
    exit();
}
