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
if (!isset($data['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Missing user_id parameter']);
    exit();
}
$user_id = $conn->real_escape_string($data['user_id']);
try {
    // Get all seasons allocated to this user
    $sql = "SELECT usp.*, s.name_saison 
            FROM user_saison_permissions usp 
            LEFT JOIN saisons s ON usp.id_saison = s.id_saison 
            WHERE usp.id_client = ?";
            
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $seasons = [];
    while ($row = $result->fetch_assoc()) {
        $seasons[] = $row;
    }
    
    echo json_encode(['success' => true, 'seasons' => $seasons]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error fetching seasons: ' . $e->getMessage()]);
}
// Close statement and connection
if (isset($stmt)) $stmt->close();
$conn->close();
?>