
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

    // Handle POST request for adding a comment
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
        
        if (!isset($data['id_saison']) || !isset($data['id_user']) || 
            !isset($data['nom']) || !isset($data['prenom']) || 
            !isset($data['comment_text']) || !isset($data['rating'])) {
            echo json_encode(["success" => false, "message" => "Missing required fields."]);
            exit;
        }
        
        $id_saison = intval($data['id_saison']);
        $id_client = intval($data['id_user']); // Changed from id_user to id_client
        $nom = $data['nom'];
        $prenom = $data['prenom'];
        $user_name = $prenom . ' ' . $nom; // Combine to full name
        $comment_text = $data['comment_text'];
        $rating = intval($data['rating']);
        
        // Validate rating (1-5 stars)
        if ($rating < 1 || $rating > 5) {
            $rating = 5;  // Default to 5 stars if invalid
        }
        
        // Insert comment - Changed id_user to id_client
        $sql = "INSERT INTO comments (id_saison, id_client, user_name, comment_text, rating) 
                VALUES (?, ?, ?, ?, ?)";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iissi", $id_saison, $id_client, $user_name, $comment_text, $rating);
        
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true, 
                "message" => "Comment added successfully.",
                "comment_id" => $conn->insert_id
            ]);
        } else {
            throw new Exception("Error adding comment: " . $stmt->error);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Invalid request method."]);
    }
} catch (Exception $e) {
    // Log the error to a file for debugging
    error_log('Error in add_comment.php: ' . $e->getMessage());
    // Return error JSON
    echo json_encode(["success" => false, "message" => "Server error occurred: " . $e->getMessage()]);
} finally {
    // Close connection if it was opened
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}
?>