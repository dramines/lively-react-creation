
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database connection
$conn = new mysqli('localhost', 'dramines_wp764', '123123123', 'dramines_drapp');

// Check connection
if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

// Set charset for proper handling of Arabic characters
$conn->set_charset('utf8mb4');

// GET all comments (for admin)
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // This is a simplified version without admin authentication
    // In a production environment, you would implement proper admin checks
    
    // Modified query to join with saisons table properly, using name_saison
    $sql = "SELECT c.*, s.name_saison, s.photo_saison 
            FROM comments c
            LEFT JOIN saisons s ON c.id_saison = s.id_saison
            ORDER BY c.created_at DESC";
    
    $result = $conn->query($sql);
    
    $comments = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            // If name_saison is NULL, set it to "Unknown"
            if ($row['name_saison'] === null) {
                $row['name_saison'] = "غير معروف";
            }
            // If photo_saison is NULL, set it to empty string
            if ($row['photo_saison'] === null) {
                $row['photo_saison'] = "";
            }
            // Add title_saison field for backward compatibility with the frontend
            $row['title_saison'] = $row['name_saison'];
            $comments[] = $row;
        }
        echo json_encode([
            "success" => true, 
            "comments" => $comments
        ]);
    } else {
        echo json_encode([
            "success" => true, 
            "comments" => []
        ]);
    }
}

// POST to delete a comment (for admin) - Changed from DELETE to POST method
else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get JSON data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id_comment'])) {
        echo json_encode(["success" => false, "message" => "Missing required fields."]);
        exit;
    }
    
    $id_comment = intval($data['id_comment']);
    
    // Delete the comment - simplified for this implementation
    $deleteSql = "DELETE FROM comments WHERE id_comment = ?";
    $deleteStmt = $conn->prepare($deleteSql);
    $deleteStmt->bind_param("i", $id_comment);
    
    if ($deleteStmt->execute()) {
        echo json_encode(["success" => true, "message" => "Comment deleted successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error deleting comment: " . $deleteStmt->error]);
    }
}

$conn->close();
?>
