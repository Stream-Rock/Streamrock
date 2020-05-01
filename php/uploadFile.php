<?php
function uploadFileLocal($target_file, $file) {
    $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
    $check = getimagesize($file["tmp_name"]);

    if ($check === false) {
        echo "The file you were trying to upload was not a file.";
        return false;
    }

    if (file_exists($target_file)) {
        echo "This image already exists.";
        return false;
    }

    if ($file["size"] > 500000) {
        echo "The file you were trying to upload was too large.";
        return false;
    }

    if ($imageFileType != "jpg" && $imageFileType != "JPG" && $imageFileType != "png" && $imageFileType != "PNG" && $imageFileType != "jpeg" && $imageFileType != "gif") {
        echo "Only jpg, jpeg, png and gif's are allowed";
        return false;
    }

    return true;
}
?>
