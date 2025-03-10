
<?php
require_once '../config/database.php';

// This script creates a test user with proper password hashing
// Run this script directly to create the test user

// Test user information
$email = 'test@example.com';
$full_name = 'Test User';
$password = 'Password123'; // Plain password will be hashed
$role = 'admin';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Check if email already exists
    $check_query = "SELECT id FROM users WHERE email = :email";
    $check_stmt = $db->prepare($check_query);
    $check_stmt->bindParam(":email", $email);
    $check_stmt->execute();
    
    if ($check_stmt->rowCount() > 0) {
        echo "User with email {$email} already exists.";
    } else {
        // Hash the password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        $query = "INSERT INTO users (email, full_name, password, role) 
                VALUES (:email, :full_name, :password, :role)";
        
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":full_name", $full_name);
        $stmt->bindParam(":password", $hashed_password);
        $stmt->bindParam(":role", $role);
        
        if ($stmt->execute()) {
            echo "Test user created successfully with email: {$email} and password: {$password}";
        } else {
            echo "Unable to create test user.";
        }
    }
} catch(PDOException $e) {
    echo "Database error: " . $e->getMessage();
}
?>
