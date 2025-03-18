<?php
// Function to convert PHP size string to bytes
function convertToBytes($size) {
    $unit = preg_replace('/[^bkmgtpezy]/i', '', $size);
    $size = (int)preg_replace('/[^0-9]/', '', $size);
    switch (strtolower($unit)) {
        case 'b':
            return $size;
        case 'kb':
            return $size * 1024;
        case 'mb':
            return $size * 1024 ** 2;
        case 'gb':
            return $size * 1024 ** 3;
        case 'tb':
            return $size * 1024 ** 4;
    }
    return $size; // Return in bytes
}

// Get current values
$current_upload_max_filesize = ini_get('upload_max_filesize');
$current_post_max_size = ini_get('post_max_size');

// Convert current values to bytes for comparison
$current_upload_max_filesize_bytes = convertToBytes($current_upload_max_filesize);
$current_post_max_size_bytes = convertToBytes($current_post_max_size);

// Desired new values
$new_upload_max_filesize = '2048M'; // 2GB
$new_post_max_size = '2048M'; // 2GB

// Attempt to update the settings
ini_set('upload_max_filesize', $new_upload_max_filesize);
ini_set('post_max_size', $new_post_max_size);

// Get updated values
$updated_upload_max_filesize = ini_get('upload_max_filesize');
$updated_post_max_size = ini_get('post_max_size');

// Feedback
echo "Current upload_max_filesize: {$current_upload_max_filesize}\n";
echo "Current post_max_size: {$current_post_max_size}\n";
echo "Updated upload_max_filesize: {$updated_upload_max_filesize}\n";
echo "Updated post_max_size: {$updated_post_max_size}\n";

// Check if the updates were successful
if ($updated_upload_max_filesize === $new_upload_max_filesize && $updated_post_max_size === $new_post_max_size) {
    echo "Successfully updated settings.";
} else {
    echo "Failed to update settings. Please try modifying your php.ini or .htaccess file.";
    echo "\nYou can add the following lines to your .htaccess file:\n";
    echo "php_value upload_max_filesize 2048M\n";
    echo "php_value post_max_size 2048M\n";
}
?>
