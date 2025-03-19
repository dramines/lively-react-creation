
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $database = new Database();
    $db = $database->getConnection();
    
    try {
        $query = "SELECT * FROM events";
        if (isset($_GET['user_id'])) {
            $query .= " WHERE user_id = :user_id";
        }
        $query .= " ORDER BY date ASC";
        
        $stmt = $db->prepare($query);
        
        if (isset($_GET['user_id'])) {
            $stmt->bindParam(":user_id", $_GET['user_id']);
        }
        
        $stmt->execute();
        
        $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode($events);
    } catch(PDOException $e) {
        http_response_code(503);
        echo json_encode(array("message" => "Database error: " . $e->getMessage()));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
