<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get POST data
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['id'])) {
        throw new Exception("Email ID is required");
    }
    
    $id_email = (int)$data['id'];
    
    // Check if email exists
    $check_sql = "SELECT id_email, vue_par_admin FROM emails WHERE id_email = :id_email";
    $check_stmt = $db->prepare($check_sql);
    $check_stmt->bindParam(':id_email', $id_email, PDO::PARAM_INT);
    $check_stmt->execute();
    
    $email = $check_stmt->fetch();
    if (!$email) {
        throw new Exception("Email not found");
    }
    
    // Update email as viewed
    $sql = "UPDATE emails 
            SET vue_par_admin = 1, 
                date_vue_admin = CURRENT_TIMESTAMP 
            WHERE id_email = :id_email";
    
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':id_email', $id_email, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Email marked as read successfully'
        ]);
    } else {
        throw new Exception("Failed to update email status");
    }
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>