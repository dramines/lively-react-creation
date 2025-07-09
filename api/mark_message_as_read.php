<?php
// Enable CORS for all origins (adjust as needed for production)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
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
        throw new Exception("Message ID is required");
    }
    
    $id_message = (int)$data['id'];
    
    // Check if message exists
    $check_sql = "SELECT id_message, vue_par_admin FROM messages WHERE id_message = :id_message";
    $check_stmt = $db->prepare($check_sql);
    $check_stmt->bindParam(':id_message', $id_message, PDO::PARAM_INT);
    $check_stmt->execute();
    
    $message = $check_stmt->fetch();
    if (!$message) {
        throw new Exception("Message not found");
    }
    
    // Update message as viewed
    $sql = "UPDATE messages 
            SET vue_par_admin = 1, 
                date_vue_admin = CURRENT_TIMESTAMP 
            WHERE id_message = :id_message";
    
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':id_message', $id_message, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Message marked as read successfully'
        ]);
    } else {
        throw new Exception("Failed to update message status");
    }
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>