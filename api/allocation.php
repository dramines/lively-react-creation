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
if (!isset($data['user_id']) || !isset($data['seasons']) || !is_array($data['seasons'])) {
    echo json_encode(['success' => false, 'message' => 'Missing or invalid parameters']);
    exit();
}

$user_id = $conn->real_escape_string($data['user_id']);
$new_seasons = array_map('intval', $data['seasons']);

try {
    // Start transaction
    $conn->begin_transaction();

    // Insert new permissions if there are any
    if (!empty($new_seasons)) {
        $insert_sql = "INSERT INTO user_saison_permissions (id_client, id_saison) VALUES (?, ?)";
        $insert_stmt = $conn->prepare($insert_sql);
        
        foreach ($new_seasons as $season_id) {
            $insert_stmt->bind_param("ss", $user_id, $season_id);
            $insert_stmt->execute();
        }
        
        if (isset($insert_stmt)) $insert_stmt->close();
    }

    // Commit transaction
    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Seasons updated successfully']);
} catch (Exception $e) {
    // Rollback transaction on error
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Error updating seasons: ' . $e->getMessage()]);
}

// Close connection
$conn->close();
?>
