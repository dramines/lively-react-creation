
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $database = new Database();
    $db = $database->getConnection();
    
    try {
        $query = "SELECT p.*, a.name as artist_name 
                FROM projects p
                LEFT JOIN artists a ON p.artist_id = a.id
                WHERE 1=1";
        
        $params = array();
        
        if (isset($_GET['user_id'])) {
            $query .= " AND p.user_id = :user_id";
            $params[':user_id'] = $_GET['user_id'];
        }
        
        if (isset($_GET['artist_id'])) {
            $query .= " AND p.artist_id = :artist_id";
            $params[':artist_id'] = $_GET['artist_id'];
        }
        
        $query .= " ORDER BY p.created_at DESC";
        
        $stmt = $db->prepare($query);
        
        // Bind parameters
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->execute();
        
        $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode($projects);
    } catch(PDOException $e) {
        http_response_code(503);
        echo json_encode(array("message" => "Database error: " . $e->getMessage()));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
