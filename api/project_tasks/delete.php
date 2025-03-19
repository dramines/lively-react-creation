
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $database = new Database();
    $db = $database->getConnection();
    
    // Extract ID from URL
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if ($id) {
        try {
            $query = "DELETE FROM project_tasks WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":id", $id);
            
            if ($stmt->execute() && $stmt->rowCount() > 0) {
                http_response_code(200);
                echo json_encode(array("message" => "Task deleted successfully."));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Task not found or already deleted."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Missing task ID parameter."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
