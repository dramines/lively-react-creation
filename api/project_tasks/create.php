
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->title) && !empty($data->project_id) && !empty($data->user_id)) {
        try {
            $query = "INSERT INTO project_tasks 
                    (id, title, description, status, assigned_to, deadline, project_id, user_id) 
                    VALUES 
                    (UUID(), :title, :description, :status, :assigned_to, :deadline, :project_id, :user_id)";
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":title", $data->title);
            $stmt->bindParam(":description", $data->description);
            $stmt->bindParam(":status", $data->status);
            $stmt->bindParam(":assigned_to", $data->assigned_to);
            $stmt->bindParam(":deadline", $data->deadline);
            $stmt->bindParam(":project_id", $data->project_id);
            $stmt->bindParam(":user_id", $data->user_id);
            
            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(array("message" => "Task created successfully.", "id" => $db->lastInsertId()));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to create task."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to create task. Data is incomplete."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
