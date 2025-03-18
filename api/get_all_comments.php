
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
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

    if ($_SERVER['REQUEST_METHOD'] == 'GET') {
        // Changed query to join with saisons table to get saison info
        $sql = "SELECT c.*, s.name_saison, s.photo_saison 
                FROM comments c
                LEFT JOIN saisons s ON c.id_saison = s.id_saison
                ORDER BY c.created_at DESC";
        
        $result = $conn->query($sql);
        
        if ($result) {
            $comments = [];
            
            while ($row = $result->fetch_assoc()) {
                // Add the title_saison field for backward compatibility with the frontend
                if ($row['name_saison'] === null) {
                    $row['name_saison'] = "غير معروف";
                    $row['title_saison'] = "غير معروف"; 
                } else {
                    $row['title_saison'] = $row['name_saison'];
                }
                
                // Set default value for photo_saison if null
                if ($row['photo_saison'] === null) {
                    $row['photo_saison'] = "";
                }
                
                $comments[] = $row;
            }
            
            echo json_encode([
                "success" => true,
                "comments" => $comments
            ]);
        } else {
            throw new Exception("Error executing query: " . $conn->error);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Invalid request method."]);
    }
} catch (Exception $e) {
    // Log the error for debugging
    error_log('Error in get_all_comments.php: ' . $e->getMessage());
    // Return error JSON
    echo json_encode(["success" => false, "message" => "Server error occurred: " . $e->getMessage()]);
} finally {
    // Close connection if it was opened
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}
?>
