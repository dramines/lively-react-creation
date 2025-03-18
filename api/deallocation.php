<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
$conn = new mysqli('localhost', 'dramines_wp764', '123123123', 'dramines_drapp');

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => "Connection failed: " . $conn->connect_error]));
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate incoming data
if (!isset($data['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Missing or invalid user_id']);
    exit();
}

$user_id = $conn->real_escape_string($data['user_id']);

try {
    // Start transaction
    $conn->begin_transaction();

    // Delete all existing permissions for this user
    $delete_sql = "DELETE FROM user_saison_permissions WHERE id_client = ?";
    $delete_stmt = $conn->prepare($delete_sql);
    $delete_stmt->bind_param("s", $user_id);
    $delete_stmt->execute();

    // Commit transaction
    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Seasons deleted successfully']);
} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Error deleting seasons: ' . $e->getMessage()]);
}

// Close statement and connection
if (isset($delete_stmt)) $delete_stmt->close();
$conn->close();
?>
