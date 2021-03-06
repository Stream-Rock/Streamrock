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
    <title>Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css">
    <link rel="stylesheet" type="text/css" media="screen" href="../css/account.css" />
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <link href="https://fonts.googleapis.com/css?family=Rubik&display=swap" rel="stylesheet"> </head>
    <link rel="shortcut icon" type="image/x-icon" href="../images/shamrock_black.png">
</head>
<body>
    <div id="form">
        <div id="registerForm" style="width: 25vw">
            <i class="far fa-times-circle" id="cancel"></i>
            <span id="loginHeading">Log in</span>
            <div class="input">
                    <input type="text" name="username" class="inputField" id="username" data-name="Username" placeholder="Username">
                    <span class="icon"><i class="fas fa-user"></i></span>
            </div>
            <p id="faultusername" class="faults"></p>
            <div class="input">
                <input type="password" name="password" class="inputField" id="password" data-name="Password" placeholder="Password">
                <span class="icon"><i class="fas fa-unlock"></i></span>
            </div>
            <p>Sample Account: testuser - testpassword</p>
            <p id="faultpassword" class="faults"></p>
            <div class="commitButton">
                    <button id="button">Login</button>
            </div>
            <div class="alternateText">
                    <p class="register">Don't have an account?<a href="register.php" class="register" style="color: black">
                        Create one here</a></p>
            </div>
        </div>
    </div>
    <script src="./../js/login.js"></script>
</body>
</html>