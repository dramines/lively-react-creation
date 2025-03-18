<?php
// Temporarily set PHP script settings for larger uploads
ini_set('upload_max_filesize', '10G');
ini_set('post_max_size', '10G');
ini_set('memory_limit', '12G');
ini_set('max_execution_time', '300');
ini_set('max_input_time', '300');

// Define the new values for DirectAdmin configuration
$directadminConfig = "/usr/local/directadmin/conf/directadmin.conf";
$nginxConfig = "/etc/nginx/nginx.conf";
$apacheConfig = "/etc/apache2/apache2.conf";  // Adjust path if needed

function updateConfigFile($filePath, $searchKey, $newValue) {
    if (!file_exists($filePath)) {
        echo "Configuration file not found: $filePath\n";
        return;
    }

    $configContent = file_get_contents($filePath);
    if (strpos($configContent, $searchKey) !== false) {
        $configContent = preg_replace("/^$searchKey\s*=.*$/m", "$searchKey=$newValue", $configContent);
    } else {
        $configContent .= "\n$searchKey=$newValue";
    }

    file_put_contents($filePath, $configContent);
    echo "Updated $searchKey to $newValue in $filePath\n";
}

// Update DirectAdmin's configuration
updateConfigFile($directadminConfig, "max_request_size", "10737418240"); // 10GB in bytes

// Optional: Update NGINX and Apache configs if they're being used
updateConfigFile($nginxConfig, "client_max_body_size", "10G");
updateConfigFile($apacheConfig, "LimitRequestBody", "10737418240"); // 10GB in bytes

// Restart services if you have permission and if it's safe to do so
exec("service directadmin restart", $output, $return_var);
exec("service nginx restart", $output, $return_var);
exec("service apache2 restart", $output, $return_var);

// Display current PHP configuration settings
echo "Current PHP Settings:\n";
echo "upload_max_filesize: " . ini_get('upload_max_filesize') . "\n";
echo "post_max_size: " . ini_get('post_max_size') . "\n";
echo "memory_limit: " . ini_get('memory_limit') . "\n";
echo "max_execution_time: " . ini_get('max_execution_time') . "\n";
echo "max_input_time: " . ini_get('max_input_time') . "\n";

echo "\nServer configurations updated and services restarted (if allowed).\n";
?>
