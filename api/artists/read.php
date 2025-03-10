
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $database = new Database();
    $db = $database->getConnection();
    
    try {
        $query = "SELECT a.*, 
                 (SELECT COUNT(*) FROM artist_events WHERE artist_id = a.id) as events_count 
                 FROM artists a";
                 
        if (isset($_GET['user_id'])) {
            $query .= " WHERE a.user_id = :user_id";
        }
        $query .= " ORDER BY a.name ASC";
        
        $stmt = $db->prepare($query);
        
        if (isset($_GET['user_id'])) {
            $stmt->bindParam(":user_id", $_GET['user_id']);
        }
        
        $stmt->execute();
        
        $artists = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Format social media data
        foreach($artists as &$artist) {
            if(isset($artist['social']) && !empty($artist['social'])) {
                $artist['social'] = json_decode($artist['social']);
            } else {
                $artist['social'] = [
                    "instagram" => "",
                    "facebook" => "",
                    "twitter" => "",
                    "youtube" => ""
                ];
            }
        }
        
        http_response_code(200);
        echo json_encode($artists);
    } catch(PDOException $e) {
        http_response_code(503);
        echo json_encode(array("message" => "Database error: " . $e->getMessage()));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
