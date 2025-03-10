
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $database = new Database();
    $db = $database->getConnection();
    
    if (isset($_GET['id'])) {
        try {
            $query = "SELECT a.*, 
                    (SELECT COUNT(*) FROM artist_events WHERE artist_id = a.id) as events_count,
                    (SELECT SUM(amount) FROM transactions WHERE artist_supplier = a.name AND type = 'revenu') as total_revenue
                    FROM artists a 
                    WHERE a.id = :id";
                    
            if (isset($_GET['user_id'])) {
                $query .= " AND a.user_id = :user_id";
            }
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":id", $_GET['id']);
            if (isset($_GET['user_id'])) {
                $stmt->bindParam(":user_id", $_GET['user_id']);
            }
            
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                $artist = $stmt->fetch(PDO::FETCH_ASSOC);
                
                // Format social media data
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
                
                // Get artist's projects
                $projectsQuery = "SELECT * FROM projects WHERE artist_id = :artist_id";
                $projectsStmt = $db->prepare($projectsQuery);
                $projectsStmt->bindParam(":artist_id", $_GET['id']);
                $projectsStmt->execute();
                $projects = $projectsStmt->fetchAll(PDO::FETCH_ASSOC);
                $artist['projects'] = $projects;
                
                // Get artist's events
                $eventsQuery = "SELECT e.* FROM events e
                                JOIN artist_events ae ON e.id = ae.event_id
                                WHERE ae.artist_id = :artist_id";
                $eventsStmt = $db->prepare($eventsQuery);
                $eventsStmt->bindParam(":artist_id", $_GET['id']);
                $eventsStmt->execute();
                $events = $eventsStmt->fetchAll(PDO::FETCH_ASSOC);
                $artist['events'] = $events;
                
                http_response_code(200);
                echo json_encode($artist);
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Artist not found."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
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
