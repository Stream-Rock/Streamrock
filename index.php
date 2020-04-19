<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Streamrock</title>
    <link rel="stylesheet" href="./css/index.css">
    <link href="https://fonts.googleapis.com/css?family=Rubik&display=swap" rel="stylesheet">
    <link rel="shortcut icon" type="image/x-icon" href="./images/shamrock_black.png">
</head>
</head>
<body onload="init('<?php
session_start();
if (isset($_SESSION['username'])) {
    echo $_SESSION['username'];
}
?>')">
<section id="start">
    <nav id="navigation">
        <ul id="navigationList">
            <li><a href="#">Home</a></li>
            <li id="separator"></li>
        </ul>
        <h1>Streamrock</h1>
        <h2>Stream your favorite music</h2>
    </nav>
    <img src="./images/shamrock.png" id="shamrock" alt="Shamrock">
</section>
<section>
    <h1 class="heading">About</h1>
    <div class="divLeft">
        <h2><strong>Streamrock </strong> is a free online audio streaming platform, that allows users to listen to their
            favorite songs.</h2>
    </div>
    <div class="imageRight" id="about">
        <img src="./images/aboutIcon.png" alt="Shamrock" class="linkApplication">
    </div>
    <h1 class="heading">Features</h1>
    <div class="divRight">
        <h2>With Streamrock you can create your own unique playlists and add music from your favorite artists to your
            library. Streamrock also saves detailed statistics about the songs and genres you are listening to.</h2>
    </div>
    <div class="imageLeft" id="features">
        <img src="./images/featuresIcon.png" alt="Shamrock" class="linkApplication">
    </div>
    <h1 class="heading">Stream</h1>
    <div class="divLeft">
        <h2>Streamrock provides a huge spectrum of different songs, artist and playlists you can choose from.</h2>
    </div>
    <div class="imageRight" id="stream">
        <img src="./images/streamIcon.png" alt="Shamrock" class="linkApplication">
    </div>
    <h1 class="heading">Register now</h1>
    <div class="divRight">
        <h2>In order to get the full experience out of Streamrock you need to quickly create an account or log in with
            your credentials.</h2>
    </div>
    <div class="imageLeft" id="register">
        <img src="./images/registerIcon.png" alt="Shamrock" id="linkRegister">
    </div>
    <div id="contactForm">
        <p>Your name</p>
        <input type="text" id="name" name="name" placeholder="Jane Doe">
        <p id="faultName" class="faults"></p>

        <p>Your email address</p>
        <input type="text" id="email" name="email" placeholder="jane.doe@yourmail.com">
        <p id="faultEmail" class="faults"></p>

        <p>Subject</p>
        <input type="text" id="subject" name="subject" placeholder="suggestions  for improvement">
        <p id="faultSubject" class="faults"></p>

        <p>Message</p>
        <input type="text" id="message" name="message" placeholder="Describe your request">
        <p id="faultMessage" class="faults"></p>

        <input type="submit" id="submit" value="Send">
        <p id="sentText"></p>
    </div>
</section>
<script src="./js/rellax.min.js"></script>
<script src="./js/index.js"></script>
</body>
</html>