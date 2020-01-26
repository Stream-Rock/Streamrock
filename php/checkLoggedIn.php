<?php
if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    $loggedIn = true;
}else{
    $loggedIn = false;
}