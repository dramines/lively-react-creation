
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $database = new Database();
    $db = $database->getConnection();
    
    if (isset($_GET['id'])) {
        try {
            // Get artist details
            $query = "SELECT * FROM artists WHERE id = :id";
            if (isset($_GET['user_id'])) {
                $query .= " AND user_id = :user_id";
            }
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":id", $_GET['id']);
            if (isset($_GET['user_id'])) {
                $stmt->bindParam(":user_id", $_GET['user_id']);
            }
            
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $artist = $stmt->fetch(PDO::FETCH_ASSOC);
                
                // Get social media links if they exist
                $social = [];
                if (!empty($artist['instagram'])) {
                    $social['instagram'] = $artist['instagram'];
                }
                if (!empty($artist['facebook'])) {
                    $social['facebook'] = $artist['facebook'];
                }
                if (!empty($artist['youtube'])) {
                    $social['youtube'] = $artist['youtube'];
                }
                
                // Get count of past events - use try/catch to prevent this query from stopping the whole response
                $eventsCount = 0;
                try {
                    $eventsQuery = "SELECT COUNT(*) as count FROM events WHERE 
                                    JSON_CONTAINS(artists, '\"" . $artist['name'] . "\"', '$')";
                    $eventsStmt = $db->prepare($eventsQuery);
                    $eventsStmt->execute();
                    $eventsCount = $eventsStmt->fetch(PDO::FETCH_ASSOC)['count'] ?? 0;
                } catch(PDOException $e) {
                    // Log error but continue
                    error_log("Error counting events: " . $e->getMessage());
                }
                
                // Format response
                $response = [
                    'id' => $artist['id'],
                    'nom' => $artist['name'],
                    'genre' => $artist['genre'] ?? '',
                    'photo' => $artist['photo'] ?? 'https://via.placeholder.com/150',
                    'bio' => $artist['bio'] ?? '',
                    'email' => $artist['email'] ?? '',
                    'telephone' => $artist['phone'] ?? '',
                    'adresse' => $artist['address'] ?? '',
                    'social' => $social,
                    'evenementsPassés' => (int)$eventsCount,
                    'user_id' => $artist['user_id']
                ];
                
                http_response_code(200);
                echo json_encode($response);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Artist not found."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array(
                "message" => "Database error: " . $e->getMessage(),
                "error_details" => $e->getMessage(),
                "trace" => $e->getTraceAsString()
            ));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Missing ID parameter."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
