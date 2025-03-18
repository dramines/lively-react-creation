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

try {
    // Get all records from user_saison_permissions
    $sql = "SELECT usp.*, s.name_saison 
            FROM user_saison_permissions usp 
            LEFT JOIN saisons s ON usp.id_saison = s.id_saison";
            
    $result = $conn->query($sql);

    if (!$result) {
        throw new Exception("Query error: " . $conn->error);
    }

    $seasons = [];
    while ($row = $result->fetch_assoc()) {
        $seasons[] = $row;
    }

    echo json_encode(['success' => true, 'seasons' => $seasons]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error fetching seasons: ' . $e->getMessage()]);
}

// Close connection
$conn->close();
?>
