
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Prevent any PHP notices or warnings from breaking JSON output
error_reporting(E_ERROR);
ini_set('display_errors', 0);

try {
    // Database connection
    $conn = new mysqli('localhost', 'dramines_wp764', '123123123', 'dramines_drapp');

    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Set charset for proper handling of Arabic characters
    $conn->set_charset('utf8mb4');

    // Handle POST request for deleting a comment
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // Get JSON data
        $json_data = file_get_contents('php://input');
        
        if (empty($json_data)) {
            echo json_encode(["success" => false, "message" => "No data received."]);
            exit;
        }
        
        $data = json_decode($json_data, true);
        
        if (!$data) {
            echo json_encode(["success" => false, "message" => "Invalid JSON data."]);
            exit;
        }
        
        if (!isset($data['id_comment'])) {
            echo json_encode(["success" => false, "message" => "Missing required comment ID."]);
            exit;
        }
        
        $id_comment = intval($data['id_comment']);
        
        // Log the received data
        error_log('Delete request data from backoffice: ' . json_encode($data));
        
        // In the backoffice version, we don't need to check user permissions
        // Admin can delete any comment directly
        $deleteSql = "DELETE FROM comments WHERE id_comment = ?";
        $deleteStmt = $conn->prepare($deleteSql);
        $deleteStmt->bind_param("i", $id_comment);
        
        if ($deleteStmt->execute()) {
            echo json_encode(["success" => true, "message" => "Comment deleted successfully."]);
        } else {
            throw new Exception("Error deleting comment: " . $deleteStmt->error);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Invalid request method."]);
    }
} catch (Exception $e) {
    // Log the error to a file for debugging
    error_log('Error in delete_comments_backoffice.php: ' . $e->getMessage());
    // Return error JSON
    echo json_encode(["success" => false, "message" => "Server error occurred: " . $e->getMessage()]);
} finally {
    // Close connection if it was opened
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}
?>
