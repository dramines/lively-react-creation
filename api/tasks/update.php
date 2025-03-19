<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        try {
            $query = "UPDATE tasks 
                      SET title = :title, 
                          description = :description, 
                          status = :status, 
                          due_date = :due_date, 
                          priority = :priority,
                          updated_at = NOW()
                      WHERE id = :id AND user_id = :user_id";
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":title", $data->title);
            $stmt->bindParam(":description", $data->description);
            $stmt->bindParam(":status", $data->status);
            $stmt->bindParam(":due_date", $data->due_date);
            $stmt->bindParam(":priority", $data->priority);
            $stmt->bindParam(":id", $data->id);
            $stmt->bindParam(":user_id", $data->user_id);
            
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