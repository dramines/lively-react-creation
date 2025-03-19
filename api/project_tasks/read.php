
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $database = new Database();
    $db = $database->getConnection();
    
    try {
        $query = "SELECT * FROM project_tasks WHERE 1=1";
        
        $params = array();
        
        if (isset($_GET['user_id'])) {
            $query .= " AND user_id = :user_id";
            $params[':user_id'] = $_GET['user_id'];
        }
        
        if (isset($_GET['project_id'])) {
            $query .= " AND project_id = :project_id";
            $params[':project_id'] = $_GET['project_id'];
        }
        
        $query .= " ORDER BY created_at DESC";
        
        $stmt = $db->prepare($query);
        
        // Bind parameters
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        
        $stmt->execute();
        
        $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode($tasks);
    } catch(PDOException $e) {
        http_response_code(503);
        echo json_encode(array("message" => "Database error: " . $e->getMessage()));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
