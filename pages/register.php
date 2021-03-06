<?php
session_start();

include './../php/checkLoggedIn.php';
if (isset($loggedIn)) {
    if ($loggedIn === true) {
        echo "<script>window.open('application.php', '_self')</script>";
    }
}else{
    die('File import does not work correctly');
}
?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Register</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css">
    <link rel="stylesheet" type="text/css" media="screen" href="../css/account.css" />
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <link href="https://fonts.googleapis.com/css?family=Rubik&display=swap" rel="stylesheet"> </head>
    <link rel="shortcut icon" type="image/x-icon" href="../images/shamrock_black.png">
</head>

<body>
    <div id="form">
        <div id="imageBox" style="width: 25vw"></div>
        <div id="registerForm" style="width: 25vw">
            <i class="far fa-times-circle" id="cancel"></i>
            <span id="registerHeading">Register now</span>
            <div class="input">
                <input type="text" name="username" class="inputField" id="username" placeholder="Username">
                <span class="icon"><i class="fas fa-user"></i></span>
            </div>
            <p class="faults" id="faultusername"></p>
            <div class="input">
                <input type="password" name="password" class="inputField" id="password" placeholder="Password">
                <span class="icon"><i class="fas fa-lock"></i></span>
            </div>
            <p class="faults" id="faultpassword"></p>
            <div class="input">
                <input type="password" name="password2" class="inputField" id="password2"
                    placeholder="Confirm Password">
                <span class="icon"><i class="fas fa-lock"></i></span>
            </div>
            <p class="faults" id="faultpassword2"></p>
            <div class="commitButton">
                <button id="buttonRegister">Register</button>
            </div>
            <div class="alternateText">
                <p class="login">Already have an account?<a class="login" href="login.php" style="color: black;"> Log in here</a></p>
            </div>
        </div>
        <p class="faults" id="faultRegister" style="text-align: center"></p>

    </div>
    <script src="./../js/register.js"></script>
</body>
</html>