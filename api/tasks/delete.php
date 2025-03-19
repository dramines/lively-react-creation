<?php
require_once '../config/database.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $database = new Database();
    $db = $database->getConnection();
    
    $data = json_decode(file_get_contents("php://input"));
    
    if (!empty($data->id)) {
        try {
            $query = "DELETE FROM tasks WHERE id = :id AND user_id = :user_id";
            
            $stmt = $db->prepare($query);
            
            $stmt->bindParam(":id", $data->id);
            $stmt->bindParam(":user_id", $data->user_id);
            
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(array("message" => "Task deleted successfully."));
            } else {
                http_response_code(503);
                echo json_encode(array("message" => "Unable to delete task."));
            }
        } catch(PDOException $e) {
            http_response_code(503);
            echo json_encode(array("message" => "Database error: " . $e->getMessage()));
        }
    } else {
        http_response_code(400);
        echo json_encode(array("message" => "Unable to delete task. No ID provided."));
    }
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed."));
}
?>