
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $database = new Database();
    $db = $database->getConnection();
    
    // Extract ID from URL
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    
    if ($id) {
        try {
            // First, delete associated tasks
            $taskQuery = "DELETE FROM project_tasks WHERE project_id = :id";
            $taskStmt = $db->prepare($taskQuery);
            $taskStmt->bindParam(":id", $id);
            $taskStmt->execute();
            
            // Then delete the project
            $projectQuery = "DELETE FROM projects WHERE id = :id";
            $projectStmt = $db->prepare($projectQuery);
            $projectStmt->bindParam(":id", $id);
            
            if ($projectStmt->execute() && $projectStmt->rowCount() > 0) {
                http_response_code(200);
                echo json_encode(array("message" => "Project deleted successfully."));
            } else {
                http_response_code(404);
                echo json_encode(array("message" => "Project not found or already deleted."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Missing project ID parameter."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
