
<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        try {
            $query = "UPDATE project_tasks 
                    SET title = :title, 
                        description = :description, 
                        status = :status,
                        assigned_to = :assigned_to,
                        deadline = :deadline,
                        updated_at = NOW()
                    WHERE id = :id";
            
            if (isset($data->user_id)) {
                $query .= " AND user_id = :user_id";
            }
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":title", $data->title);
            $stmt->bindParam(":description", $data->description);
            $stmt->bindParam(":status", $data->status);
            $stmt->bindParam(":assigned_to", $data->assigned_to);
            $stmt->bindParam(":deadline", $data->deadline);
            $stmt->bindParam(":id", $data->id);
            
            if (isset($data->user_id)) {
                $stmt->bindParam(":user_id", $data->user_id);
            }
            
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array("message" => "Task updated successfully."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to update task."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to update task. Data is incomplete."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>
