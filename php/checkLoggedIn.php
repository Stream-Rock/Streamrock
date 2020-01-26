<?php
if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin'] === true) {
    header("HTTP/1.1 403 Forbidden");
    exit();
}