<?php
if (!empty($_POST["username"]) && !empty($_POST["password"])) {
    $username = $_POST["username"];
    $password = $_POST["password"];
}else{
    echo "Not used correctly";
    exit();
}

$accounts = readAccounts("../csv/accounts.csv");
checkCorrectAccount($username, $password, $accounts);

function readAccounts($fileName){
    $accounts = array();
    $file = fopen($fileName, "r") or die("Unable to open file!");

    $firstLine = fgets($file);
    $partsFirstLine = explode(";", $firstLine);

    for ($i = 0; $i < count($partsFirstLine); $i++) {
        $partsFirstLine[$i] = rtrim($partsFirstLine[$i]);
    }

    while (!feof($file)) {
        $line = fgets($file);
        $parts = explode(";", $line);
        for ($i = 0; $i < count($parts); $i++) {
            $parts[$i] = rtrim($parts[$i]);
        }
        $accounts[] = array(
            $partsFirstLine[0] => $parts[0],
            $partsFirstLine[1] => $parts[1]
        );
    }

    return $accounts;
}

function checkCorrectAccount($username, $password, $accounts){
    $userFound = false;

    for ($i = 0; $i < count($accounts); $i++) {
        if ($accounts[$i]["username"] === $username && $accounts[$i]["password"] === $password) {
            echo json_encode("Correct");
            exit();
        }else if ($accounts[$i]["username"] === $username) {
            $userFound = true;
        }
    }

    echo $userFound ? json_encode("Please enter the correct password!") : json_encode("This user does not exist!");
}
?>